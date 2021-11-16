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
import json

from ..SharedFunctions import authenticator

import azure.functions as func

pymysql.install_as_MySQLdb()

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
        mysql_engine_string = "mysql://{0}:{1}@{2}/{3}".format(mysql_user, mysql_password, mysql_host, mysql_dbname)
        self.mysql_engine = sqlalchemy.create_engine(mysql_engine_string)

        print("connected to mysql live")

    def authenticate(self):
        authenticated, response = authenticator.authenticate(self.token)
        if not authenticated:
            return False, response
        else:
            return True, response

    def fetch_bad_uids_data(self, xform_id_string):
        invalid_rows = pd.DataFrame(pd.read_sql("SELECT DISTINCT uid, err, data FROM invalid_row_table_pairs WHERE xform_id_string = '{}' AND resolved = 0".format(xform_id_string), self.shadow_engine))
        return invalid_rows

    # def fetch_uid_history(self, xform_id_string):
    #     uid_history = pd.DataFrame(pd.read_sql("SELECT DISTINCT uid, err, data FROM invalid_row_table_pairs WHERE xform_id_string = '{}' AND resolved = 1".format(xform_id_string), self.shadow_engine))
    #     return uid_history

    def fetch_all_data(self, xform_id_string):
        all_rows = pd.DataFrame(pd.read_sql("SELECT data, uid FROM kobo WHERE xform_id_string = '{}'".format(xform_id_string), self.mysql_engine))
        return all_rows

    def fetch_distinct_uids(self, xform_id_string, resolved):
        distinct_uids = pd.DataFrame(pd.read_sql("SELECT DISTINCT uid, data FROM invalid_row_table_pairs WHERE xform_id_string = '{}' and resolved = '{}'".format(xform_id_string, resolved), self.shadow_engine))
        return distinct_uids

    # def generate_uid_history(self):
    #     uid_history = self.fetch_uid_history(self.xform_id_string)
    #     valid_list = []

    #     for index, row_entry in uid_history.iterrows():
    #         if row_entry.get("uid") not in invalid_rows.uid.tolist():
    #             # print(row_entry.get("uid"))
    #             valid_list.append({"data": row_entry.get("data"), "errs": row_entry.get("err")})

    def generate_invalid_rows(self, xform_id_string, history=False):
        # all_rows = pd.DataFrame(pd.read_sql("SELECT data, uid FROM kobo WHERE xform_id_string = '{}'".format(xform_id_string), self.mysql_engine))
        if history:
            distinct_uids = self.fetch_distinct_uids(xform_id_string, 1)
        else:
            distinct_uids = self.fetch_distinct_uids(xform_id_string, 0)
        invalid_data = []
        for index, row_entry in distinct_uids.iterrows():
            uid = row_entry.get("uid")
            data = row_entry.get("data")
            # print(data)
            errs = pd.DataFrame(pd.read_sql("SELECT DISTINCT err FROM invalid_row_table_pairs WHERE uid = '{}'".format(uid), self.shadow_engine))
            # print(errs.get("err"), uid)
            errs_list = []
            for index, row_entry in errs.iterrows():
                errs_list.append(row_entry.get("err"))

            invalid_data.append({"data": data, "errs": errs_list, "uid": uid})

        # print(invalid_data)

        return invalid_data

    def generate_valid_rows(self):
        invalid_rows = self.fetch_bad_uids_data(self.xform_id_string)
        all_rows = self.fetch_all_data(self.xform_id_string)
        valid_list = []

        for index, row_entry in all_rows.iterrows():
            uid = row_entry.get("uid")
            if uid not in invalid_rows.uid.tolist():
                # print(row_entry.get("uid"))
                valid_list.append({"data": row_entry.get("data"), "errs": row_entry.get("err"), "uid": uid})

        return valid_list

    def create_row_object(self):
        uid_history = self.generate_invalid_rows(self.xform_id_string, True)
        valid_data = self.generate_valid_rows()
        invalid_data = self.generate_invalid_rows(self.xform_id_string)

        data = {
            "valid_data": valid_data,
            "invalid_data": invalid_data,
            "uid_history": uid_history,
        }

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
        return func.HttpResponse(error, status_code=400)
