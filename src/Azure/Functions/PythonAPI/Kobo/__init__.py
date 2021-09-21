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

class KoboAPI:
    def __init__(self, req):
        self.connect_to_shadow_live()
        self.connect_to_mysql_live()

        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            self.token = req_body.get('token')
            self.xform_id_string = req_body.get('xform_id_string')

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
        
        # Make mysql connections
        mysql_engine_string = "mysql+mysqlconnector://{0}:{1}@{2}/{3}".format(mysql_user, mysql_password, mysql_host, mysql_dbname)
        self.mysql_engine = sqlalchemy.create_engine(mysql_engine_string)

        print("connected to mysql live")

    def authenticate(self):
        authenticated, response = authenticator.authenticate(self.token)
        if not authenticated:
            return False, response
        else:
            return True, response

    def fetch_bad_uids_data(self, xform_id_string):
        invalid_rows = pd.DataFrame(pd.read_sql("SELECT DISTINCT uid, err, data FROM invalid_row_table_pairs WHERE xform_id_string = '{}'".format(xform_id_string), self.shadow_engine))
        return invalid_rows

    def fetch_all_data(self, xform_id_string):
        all_rows = pd.DataFrame(pd.read_sql("SELECT data, uid FROM kobo WHERE xform_id_string = '{}'".format(xform_id_string), self.mysql_engine))
        return all_rows

    def create_row_object(self):
        invalid_rows = self.fetch_bad_uids_data(self.xform_id_string)
        all_rows = self.fetch_all_data(self.xform_id_string)

        data = {
            "valid_data": [],
            "invalid_data": []
        }

        print(invalid_rows)

        # invalid_uids = []

        # for index, invalid_row in invalid_rows.iterrows():
        #     invalid_uids.append(invalid_row.get("uid"))

        for index, row_entry in all_rows.iterrows():
            if row_entry.get("uid") not in invalid_rows.uid.tolist():
                # print(row_entry.get("uid"))
                data["valid_data"].append({"data": row_entry.get("data"), "err": row_entry.get("err")})
            # else:
            #     data["valid_data"].append(row_entry.get("data"))

        for index, row_entry in invalid_rows.iterrows():
            data["invalid_data"].append({"data": row_entry.get("data"), "err": row_entry.get("err")})

        return data

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        kobo = KoboAPI(req)

        authenticated, response = kobo.authenticate()
        if not authenticated:
            return func.HttpResponse(json.dumps(response), headers={'content-type': 'application/json'}, status_code=400)

        data = kobo.create_row_object()
        if not data.get("valid_data") and not data.get("invalid_data"):
            return func.HttpResponse(json.dumps({"message": "no xform_id_string in dbs"}), headers={'content-type': 'application/json'}, status_code=400)

        return func.HttpResponse(body=json.dumps(data), headers={'content-type': 'application/json'}, status_code=200)
    except Exception:
        error = traceback.format_exc()
        logging.error(error)
        return func.HttpResponse(error, status_code=200)
