import logging
import pandas as pd
import sys
import psycopg2
from psycopg2 import sql
import os
import sqlalchemy
import traceback
import mysql.connector
import json

from ..SharedFunctions import authenticator

import azure.functions as func

class SubmitNewEntry:
    def __init__(self, req):
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

    def authenticate(self):
        authenticated, response = authenticator.authenticate(self.token)
        if not authenticated:
            return False, response
        else:
            return True, response

    def connect_to_mysql_live(self):
        mysql_host = os.environ.get('MYSQL_HOST')
        mysql_dbname = os.environ.get('MYSQL_DBNAME')
        mysql_user = os.environ.get('MYSQL_USER')
        mysql_password = os.environ.get('MYSQL_PASSWORD')
        mysql_ssslmode = os.environ.get('MYSQL_SSLMODE')

        self.mysql_con = mysql.connector.connect(user=mysql_user, database=mysql_dbname, host=mysql_host, password=mysql_password)
        self.mysql_cur = self.mysql_con.cursor()
        self.mysql_con.autocommit = True
        
        # Make mysql connections
        mysql_engine_string = "mysql+mysqlconnector://{0}:{1}@{2}/{3}".format(mysql_user, mysql_password, mysql_host, mysql_dbname)
        self.mysql_engine = sqlalchemy.create_engine(mysql_engine_string)

        print("connected to mysql live")

    def insert_new_form(self):
        sql_string = "INSERT INTO kobo (id, asset_name, data) VALUES (%s, %s, %s)"
        response = self.mysql_cur.execute(sql_string, (self.id, self.asset_name, self.data))
        self.mysql_cur
        self.mysql_con.commit()
        return response

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    try:
        sne = SubmitNewEntry(req)

        authenticated, response = sne.authenticate()
        if not authenticated:
            return func.HttpResponse(json.dumps(response), headers={'content-type': 'application/json'}, status_code=400)
            
        response = sne.insert_new_form()
        if not response:
            return func.HttpResponse(json.dumps({"message": "no version in shadow db"}), headers={'content-type': 'application/json'}, status_code=400)
                
        return func.HttpResponse(body=json.dumps(response), headers={'content-type': 'application/json'}, status_code=200)

    except Exception:
        error = traceback.format_exc()
        logging.error(error)
        return func.HttpResponse(error, status_code=200)
