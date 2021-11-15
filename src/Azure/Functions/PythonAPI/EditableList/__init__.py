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

class EditableList:
    def __init__(self, req):
        self.connect_to_shadow_live()

        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            self.token = req_body.get('token')
            self.version = req_body.get('version')

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

    def fetch_editable_list(self):
        editable_list = pd.DataFrame(pd.read_sql("SELECT editable_list FROM editable_list_by_version WHERE version = '{}'".format(self.version), self.shadow_engine))
        return editable_list

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    try:
        el = EditableList(req)

        authenticated, response = el.authenticate()
        if not authenticated:
            return func.HttpResponse(json.dumps(response), headers={'content-type': 'application/json'}, status_code=400)
            
        editable_list = el.fetch_editable_list().editable_list.tolist()
        if not editable_list:
            return func.HttpResponse(json.dumps({"message": "no version in shadow db"}), headers={'content-type': 'application/json'}, status_code=400)
                
        return func.HttpResponse(body=json.dumps(editable_list[0]), headers={'content-type': 'application/json'}, status_code=200)

    except Exception:
        error = traceback.format_exc()
        logging.error(error)
        return func.HttpResponse(error, status_code=400)
