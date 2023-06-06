import mysql.connector
from utils import (
    University,
    close_connection,
    connect_to_database,
    extract_column,
    insert_university_data,
    read_database_config,
)


config = read_database_config()


cnx, cur = connect_to_database(config)
if cnx and cur:
    try:
        cur.execute("SHOW TABLES")

        tables = cur.fetchall()

        for table in tables:
            print(table[0])
    except mysql.connector.Error as e:
        print(f"Error executing SQL query: {e}")
    finally:
        close_connection(cnx, cur)


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


org = build_university_from_csv("./dataset/ege_filtered.csv")

insert_university_data(org)
