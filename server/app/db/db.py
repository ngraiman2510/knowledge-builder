import os
import sqlite3

import sqlite_vec
from langchain_community.vectorstores import SQLiteVec
from langchain_openai import OpenAIEmbeddings


def connect_sqlite_db() -> sqlite3.Connection:
    db_path = os.path.join(os.path.dirname(__file__), "../../data/knowledge_base.db")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    return conn


def create_sqlite_instance() -> SQLiteVec:
    connection = connect_sqlite_db()
    embeddings = OpenAIEmbeddings()
    return SQLiteVec(
        connection=connection, table="knowledge_base", embedding=embeddings
    )
