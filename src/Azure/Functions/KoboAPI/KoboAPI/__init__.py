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

import azure.functions as func

class KoboAPI:
    def __init__(self):
        self.connect_to_shadow_live()
        self.connect_to_mysql_live()

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

    def fetch_bad_uids_data(self, asset_name):
        invalid_uids = pd.DataFrame(pd.read_sql("SELECT DISTINCT uid FROM invalid_row_table_pairs WHERE asset_name = '{}'".format(asset_name), self.shadow_engine))
        return invalid_uids.uid.tolist()

    def fetch_all_data(self, asset_name):
        all_rows = pd.DataFrame(pd.read_sql("SELECT data, uid FROM kobo WHERE asset_name = '{}'".format(asset_name), self.mysql_engine))
        return all_rows

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    kobo = KoboAPI()
    invalid_uids = kobo.fetch_bad_uids_data("psa gps")
    print(invalid_uids)

    all_rows = kobo.fetch_all_data("psa gps")
    print(all_rows)

    data = {
        "valid_data": [],
        "invalid_data": []
    }

    for index, row_entry in all_rows.iterrows():
        if row_entry.get("uid") in invalid_uids:
            print(row_entry.get("uid"))
            data["invalid_data"].append(row_entry.get("data"))
        else:
            data["valid_data"].append(row_entry.get("data"))

    print(json.dumps(data["valid_data"]))
    print(json.dumps(data["invalid_data"]))

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    # if name:
    return func.HttpResponse(body=json.dumps(data), headers={'content-type': 'application/json'}, status_code=200)
    # else:
    #     return func.HttpResponse(
    #          "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #          status_code=200
    #     )
