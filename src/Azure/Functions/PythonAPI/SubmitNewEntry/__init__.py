import logging
import pandas as pd
import sys
import psycopg2
from psycopg2 import sql
import os
import sqlalchemy
import traceback
import mysql.connector
import pymysql
import MySQLdb
import json

from ..SharedFunctions import authenticator

import azure.functions as func

pymysql.install_as_MySQLdb()

class SubmitNewEntry:
    def __init__(self, req):
        self.connect_to_shadow_live()
        self.connect_to_mysql_live()

        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            self.token = req_body.get('token')
            self.data = req_body.get('data')
            self.asset_name = req_body.get('asset_name')
            self.id = req_body.get('id')
            self.xform_id_string = req_body.get('xform_id_string')
            self.uid = req_body.get('uid')
            # print(self.uid)

    def authenticate(self):
        authenticated, response = authenticator.authenticate(self.token)
        if not authenticated:
            return False, response
        else:
            return True, response

    def connect_to_shadow_live(self):
        postgres_host = os.environ.get('LIVE_SHADOW_HOST')
        postgres_dbname = os.environ.get('LIVE_SHADOW_DBNAME')
        postgres_user = os.environ.get('LIVE_SHADOW_USER')
        postgres_password = os.environ.get('LIVE_SHADOW_PASSWORD')
        postgres_sslmode = os.environ.get('LIVE_SHADOW_SSLMODE')

        # Make postgres connections
        postgres_con_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(postgres_host, postgres_user, postgres_dbname, postgres_password, postgres_sslmode)
        # print(postgres_con_string)
        self.shadow_con = psycopg2.connect(postgres_con_string)
        self.shadow_cur = self.shadow_con.cursor()
        self.shadow_con.autocommit = True

        postgres_engine_string = "postgresql://{0}:{1}@{2}/{3}".format(postgres_user, postgres_password, postgres_host, postgres_dbname)
        self.shadow_engine = sqlalchemy.create_engine(postgres_engine_string)

        print("connected to shadow live")

    def connect_to_mysql_live(self):
        mysql_host = os.environ.get('MYSQL_HOST')
        mysql_dbname = os.environ.get('MYSQL_DBNAME')
        mysql_user = os.environ.get('MYSQL_USER')
        mysql_password = os.environ.get('MYSQL_PASSWORD')

        self.mysql_con = pymysql.connect(user=mysql_user, database=mysql_dbname, host=mysql_host, password=mysql_password, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
        self.mysql_cur = self.mysql_con.cursor()
        self.mysql_con.autocommit = True

        print("connected to mysql live")

    def insert_new_form(self):
        sql_string = "INSERT INTO kobo (id, asset_name, data, xform_id_string) VALUES (%s, %s, %s, %s)"
        self.mysql_cur.execute(sql_string, (self.id, self.asset_name, self.data, self.xform_id_string))
        # self.mysql_cur
        self.mysql_con.commit()

    def set_resolved(self):
        sql_string = "UPDATE invalid_row_table_pairs SET resolved = 1 WHERE uid = %s"
        self.shadow_cur.execute(sql_string, (self.uid,))
        # self.mysql_cur
        self.mysql_con.commit()

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    try:
        sne = SubmitNewEntry(req)

        authenticated, response = sne.authenticate()
        if not authenticated:
            return func.HttpResponse(json.dumps(response), headers={'content-type': 'application/json'}, status_code=400)
            
        sne.insert_new_form()
        sne.set_resolved()
                
        return func.HttpResponse(body="Successfully inserted new entry", headers={'content-type': 'application/json'}, status_code=201)

    except Exception:
        error = traceback.format_exc()
        logging.error(error)
        return func.HttpResponse(error, status_code=400)
