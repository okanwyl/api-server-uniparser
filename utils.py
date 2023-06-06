import csv
from typing import NamedTuple
import mysql.connector
from dotenv import load_dotenv
import os

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


def insert_university_data(university: University):
    config = read_database_config()

    cnx, cur = connect_to_database(config)

    if not cnx or not cur:
        raise Exception("cnx and cur not defined")

    insert_query = """
    INSERT INTO universities (name, initials, href, scholar)
    VALUES (%s, %s, %s, %s)
    """
    cur.execute(
        insert_query,
        (university.name, university.initials, university.href, university.scholar),
    )
    cnx.commit()

    close_connection(cnx, cur)

    print("University data inserted successfully!")
