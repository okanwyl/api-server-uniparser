import json
from typing import List
import csv
from typing import NamedTuple
import mysql.connector
from dotenv import load_dotenv
import os
from scholarly import scholarly

load_dotenv()


class DatabaseConfig(NamedTuple):
    host: str
    port: int
    username: str
    password: str
    database: str

    def __str__(self) -> str:
        return (
            f"host: {self.host}\n"
            f"port: {self.port}\n"
            f"username: {self.username}\n"
            f"password: {self.password}\n"
            f"database: {self.database}\n"
        )


class University(NamedTuple):
    name: str
    initials: str
    href: str
    scholar: str

    def __str__(self) -> str:
        return (
            f"name: {self.name}\n"
            f"initials: {self.initials}\n"
            f"href: {self.href}\n"
            f"scholar: {self.scholar}\n"
        )


class Course:
    course_id: str
    name: str
    code: str
    info: str
    href: str
    university_id: int

    def __init__(self, name, code, info, href, university_id=None, instructor_id=None):
        self.name = name
        self.code = code
        self.info = info
        self.href = href
        self.university_id = university_id

    def __str__(self) -> str:
        return (
            f"name: {self.name}\n"
            f"course_id: {self.course_id}\n"
            f"code: {self.code}\n"
            f"info: {self.info}\n"
            f"href: {self.href}\n"
            f"university_id: {self.university_id}\n"
        )


class Instructor:
    scholar_id: str
    profile_picture: str
    filtered_name: str
    titled_name: str
    interests: str
    citedby: int
    citedby5y: int
    hindex: int
    hindex5y: int
    i10index: int
    i10index5y: int
    university_id: int
    course_name: str
    db_uid: str
    parsable: bool
    visited: bool
    affilation: str
    email_domain: str

    def __init__(
        self,
        filtered_name=None,
        titled_name=None,
        scholar_id=None,
        profile_picture=None,
        interests=None,
        university_id=None,
        citedby=None,
        citedby5y=None,
        hindex=None,
        hindex5y=None,
        i10index=None,
        i10index5y=None,
        db_uid=None,
        course_name=None,
        parsable=False,
        visited=False,
        affilation=None,
        email_domain=None,
    ):
        self.scholar_id = scholar_id
        self.profile_picture = profile_picture
        self.filtered_name = filtered_name
        self.titled_name = titled_name
        self.interests = interests
        self.university_id = university_id
        self.citedby = citedby
        self.citedby5y = citedby5y
        self.hindex = hindex
        self.hindex5y = hindex5y
        self.i10index = i10index
        self.i10index5y = i10index5y
        self.course_name = course_name
        self.parsable = parsable
        self.visited = visited
        self.db_uid = db_uid
        self.affilation = affilation
        self.email_domain = email_domain

    def __str__(self) -> str:
        return (
            f"scholar_id: {self.scholar_id}\n"
            f"profile_picture: {self.profile_picture}\n"
            f"filtered_name: {self.filtered_name}\n"
            f"titled_name: {self.titled_name}\n"
            f"interests: {self.interests}\n"
            f"university_id: {self.university_id}\n"
            f"citedby: {self.citedby}\n"
            f"citedby5y: {self.citedby5y}\n"
            f"hindex5y: {self.hindex5y}\n"
            f"i10index: {self.i10index}\n"
            f"i10index5y: {self.i10index5y}\n"
            f"course_name: {self.course_name}\n"
            f"db_uid: {self.db_uid}\n"
        )


class Publication:
    title: str
    citation: str
    author_pub_id: str
    num_citation: int
    instructor_id: str
    university_id: str

    def __init__(
        self, title, citation, author_pub_id, num_citation, instructor_id, university_id
    ):
        self.title = title
        self.citation = citation
        self.author_pub_id = author_pub_id
        self.num_citation = num_citation
        self.instructor_id = instructor_id
        self.university_id = university_id


def connect_to_database(config: DatabaseConfig):
    try:
        cnx = mysql.connector.connect(
            host=config.host,
            port=config.port,
            user=config.username,
            password=config.password,
            database=config.database,
        )

        cur = cnx.cursor()

        return cnx, cur
    except mysql.connector.Error as e:
        print(f"Error connecting to the database: {e}")
        return None, None


def close_connection(cnx, cur):
    if cur:
        cur.close()
    if cnx:
        cnx.close()


def read_database_config() -> DatabaseConfig:
    host = os.getenv("DB_HOST")

    port = os.getenv("DB_PORT")
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_DATABASE")
    db = DatabaseConfig(
        host=host, port=port, username=username, password=password, database=database
    )

    return db


def extract_column(csv_file, column_index, use_unique=False):
    column_data = []
    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            if len(row) > column_index:
                column_data.append(row[column_index])

    if use_unique:
        column_data = list(set(column_data))

    return column_data


def insert_university_data(csv_file: str):
    config = read_database_config()

    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    org = build_university_from_csv(csv_file)

    universities = set()
    courses = set()
    instructors = set()
    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row
        for row in reader:
            if len(row) >= 5:
                university = University(
                    name=row[0], initials=row[1], href=row[9], scholar=row[8]
                )
                universities.add(university)

                course_href = row[2]
                course_code = row[3]
                course_name = row[4]
                course_info = row[5]

                full_name = row[6]
                filtered_name = row[7]

                course = Course(
                    code=course_code,
                    name=course_name,
                    info=course_info,
                    href=course_href,
                    instructor_id=None,
                    university_id=None,
                )

                instructor = Instructor(
                    titled_name=full_name, filtered_name=filtered_name
                )

                instructor.course_name = course.name
                courses.add(course)
                instructors.add(instructor)

    insert_university_query = """
    INSERT INTO universities (name, initials, href, scholar)
    VALUES (%s, %s, %s, %s)
    """

    insert_course_query = """
    INSERT INTO courses (name, code, info, href, universityId)
    VALUES (%s, %s, %s, %s, %s)
    """

    insert_instructor_query = """
    INSERT INTO  instructors (filtered_name, titled_name, universityId)
    VALUES (%s, %s, %s)
    """

    insert_instructors_courses_courses = """
    INSERT INTO instructors_courses_courses (instructorsId, coursesId)
    VALUES (%s, %s)
    """

    if len(universities) > 1:
        raise Exception("bad csv")

    university = universities.pop()
    cur.execute(
        insert_university_query,
        (university.name, university.initials, university.href, university.scholar),
    )
    university_id = cur.lastrowid

    for course in courses:
        if course.university_id is None:
            course.university_id = university_id

    visited_inst = set()
    for course in courses:
        cur.execute(
            insert_course_query,
            (course.name, course.code, course.info, course.href, course.university_id),
        )
        course_id = cur.lastrowid
        course.course_id = course_id

        cnx.commit()

    for course in courses:
        try:
            instrc = find_instructor_by_course(instructors, "course_name", course.name)
            for inst in instrc:
                try_find_on_db = find_instructor_by_filtered_name(inst.filtered_name)
                if try_find_on_db is None:
                    cur.execute(
                        insert_instructor_query,
                        (inst.filtered_name, inst.titled_name, university_id),
                    )
                    inst.db_uid = cur.lastrowid
                    cur.execute(
                        insert_instructors_courses_courses,
                        (inst.db_uid, course.course_id),
                    )
                    cnx.commit()
                else:
                    cur.execute(
                        insert_instructors_courses_courses,
                        (try_find_on_db.db_uid, course.course_id),
                    )
                    cnx.commit()
        except:
            continue

    close_connection(cnx, cur)

    print("University data inserted successfully!")


def build_university_from_csv(csv_file: str) -> University:
    organization = extract_column(csv_file, 0, True)
    initials = extract_column(csv_file, 1, True)
    scholar = extract_column(csv_file, 8, True)
    href = extract_column(csv_file, 9, True)

    if len(initials) > 1:
        raise Exception("CSV not correct for standards")

    if len(organization) > 1:
        raise Exception("CSV not correct for standards")

    if len(scholar) > 1:
        raise Exception("CSV not correct for standards")

    if len(href) > 1:
        raise Exception("CSV not correct for standards")

    org = University(
        href=href[0], initials=initials[0], scholar=scholar[0], name=organization[0]
    )
    return org


# Find objects based on a field value
def find_instructor_by_course(courses, field, value):
    matching_courses = set()
    for course in courses:
        if getattr(course, field) == value:
            matching_courses.add(course)
    return matching_courses


def find_instructor_by_filtered_name(filtered_name):
    config = read_database_config()
    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    query = """
    SELECT
        instructors.id
    FROM
        instructors
    WHERE
        instructors.filtered_name = %s
    LIMIT 1
    """

    cur.execute(query, (filtered_name,))
    result = cur.fetchone()

    if result:
        instructor = Instructor(
            db_uid=result[0],
        )
    else:
        instructor = None

    close_connection(cnx, cur)

    return instructor


def get_all_instructors() -> List[Instructor]:
    config = read_database_config()
    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    query = "SELECT * FROM instructors WHERE visited = 0;"
    cur.execute(query)
    rows = cur.fetchall()

    instructors = []
    for row in rows:
        instructor = Instructor(
            db_uid=row[0],
            filtered_name=row[11],
            titled_name=row[12],
            scholar_id=row[1],
            profile_picture=row[13],
            interests=row[14],
            citedby=row[2],
            citedby5y=row[3],
            hindex=row[4],
            hindex5y=row[5],
            i10index=row[6],
            i10index5y=row[7],
            university_id=row[10],
        )
        instructors.append(instructor)

    close_connection(cnx, cur)

    return instructors


def update_instructor_object(instructor: Instructor):
    config = read_database_config()
    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    update_instructor_query = """
    UPDATE instructors SET
    filtered_name = %s,
    titled_name = %s,
    scholar_id = %s,
    profile_picture = %s,
    interests = %s,
    citedby = %s,
    citedby5y = %s,
    hindex = %s,
    hindex5y = %s,
    i10index = %s,
    i10index5y = %s,
    parsable = %s,
    visited = %s,
    affilation = %s,
    email_domain = %s
    WHERE id = %s
    """

    cur.execute(
        update_instructor_query,
        (
            instructor.filtered_name,
            instructor.titled_name,
            instructor.scholar_id,
            instructor.profile_picture,
            instructor.interests,
            instructor.citedby,
            instructor.citedby5y,
            instructor.hindex,
            instructor.hindex5y,
            instructor.i10index,
            instructor.i10index5y,
            instructor.parsable,
            instructor.visited,
            instructor.affilation,
            instructor.email_domain,
            instructor.db_uid,
        ),
    )
    cnx.commit()


def parse_scholarly(filtered_name: str, university_initials: str) -> json:
    try:
        search_query = scholarly.search_author(
            filtered_name + ", " + university_initials
        )
        author = next(search_query)

        obj = scholarly.fill(author, sections=["basics", "indices", "publications"])
        json_str = json.dumps(obj, indent=4, ensure_ascii=False)
        return json_str

    except StopIteration:
        return None


def create_publication_from_obj(obj: Publication):
    config = read_database_config()
    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    insert_publication_query = """
    INSERT INTO  publications (title, citation, author_pub_id, num_citations, instructorId, universityId)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cur.execute(
        insert_publication_query,
        (
            obj.title,
            obj.citation,
            obj.author_pub_id,
            obj.num_citation,
            obj.instructor_id,
            obj.university_id,
        ),
    )
    cnx.commit()
