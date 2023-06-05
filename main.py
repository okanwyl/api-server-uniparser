import mysql.connector
from utils import close_connection, connect_to_database, read_database_config


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
