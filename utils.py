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
