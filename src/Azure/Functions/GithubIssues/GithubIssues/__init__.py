import logging	
import azure.functions as func	
import http.client	
import requests	
import json	
import sys	

DEBUG = True

# github issues class to handle actions on github issues	
class GithubIssues:	
    #  setup connection	
    auth0_connection =  http.client.HTTPSConnection("psa-tech-dashboard.auth0.com")	
    # class variable to avoid repeating the same text	
    RESPONSE_STRING = 'Response:'	
    GITHUB_REPO_OWNER = 'precision-sustainable-ag'	
    GITHUB_REPO_NAME = 'data_corrections'	
    HEADER = { 'content-type': 'application/json' }
    
    # constructor sets the user variable	
    def __init__(self, user):	
        self.user = user	
    # method to fetch the Auth0 management API token	
    def get_token(self):	
        # payload and header	
        auth0_payload = "{\"client_id\":\"RKkiHSDtTGQWijgy7q7Pi7sheonzWZke\",\"client_secret\":\"pzoI_Zwp4i-PSlb0lHVOZTyl8zZ8iQmuzJ8GNfR4pY1Ttr1PgXPK3Bbk-LdRXyf9\",\"audience\":\"https://psa-tech-dashboard.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"	
        auth0_headers = self.HEADER	
        # request token	
        self.auth0_connection.request("POST", "/oauth/token", auth0_payload, auth0_headers)	
        auth0_token_res = self.auth0_connection.getresponse()	
        auth0_token_data = auth0_token_res.read()	
        # convert to json	
        json_auth0_token_data = auth0_token_data.decode('utf8').replace("'", '"')	
        auth0_token_json_data = json.loads(json_auth0_token_data)	
        # logging.info and store access token	
        if DEBUG:
            logging.info("Auth 0 Management API Token = " + auth0_token_json_data['access_token'] + '\n')	
            logging.info("\n\n")
        management_api_token = auth0_token_json_data['access_token']	
        # set class variable for management toke	
        self.management_api_token = management_api_token	
    # method to fetch all the Auth0 users info including github token	
    def get_users(self):	
        # setup management api request 	
        auth0_users_authorization =  "Bearer " + self.management_api_token	
        auth0_users_headers = { 'authorization': auth0_users_authorization }	
        # request users	
        self.auth0_connection.request("GET", "/api/v2/users", headers=auth0_users_headers)	
        auth0_users_res = self.auth0_connection.getresponse()	
        auth0_users_data = auth0_users_res.read()	
        # convert to json	
        json_auth0_users_data = auth0_users_data.decode('utf8').replace("'", '"')	
        auth0_users_json_data = json.loads(json_auth0_users_data)	
        # iterate through users and logging.info out for debugging	
        if DEBUG:
            # logging.info out all users tokens tokens
            for user in auth0_users_json_data:	
                logging.info(user.get("nickname") + "'s token = " + user.get("identities")[0].get("access_token"))	
            logging.info("\n\n")
        # set class variable for users in json format	
        self.auth0_users_json_data = auth0_users_json_data	
    # method to search for a users github token in self.auth0_users_json_data	
    def get_users_github_token(self):	
        for user in self.auth0_users_json_data:	
            if user.get("nickname") == self.user:	
                github_user_token = user.get("identities")[0].get("access_token")	
        # logging.infos users token for debugging	
        if DEBUG:
            # logging.info users token 
            logging.info(self.user + "'s token is: " + github_user_token)	
            logging.info("\n\n")
        # sets class variable for the users github token	
        self.github_user_token = github_user_token	
    # method to make an issue using a specific users github token	
    def create_github_issue(self, title, body, assignees, labels):	
        # Create an issue on github.com using the given parameters	
        # Url to create issues via POST	
        url = 'https://api.github.com/repos/%s/%s/issues' % (self.GITHUB_REPO_OWNER, self.GITHUB_REPO_NAME)	
        	
        # Headers	
        headers = {	
            "Authorization": "token %s" % self.github_user_token,	
            "Accept": "application/vnd.github.v3+json"	
        }	
        	
        # Create our issue working properly, just need to add labels etc	
        data = {	
            'title': title,	
            'body': body,	
            'assignees': assignees,	
            'labels': labels	
        }	
        payload = json.dumps(data)	
        # Add the issue to our repository	
        response = requests.request("POST", url, data=payload, headers=headers)	
        if response.status_code == 201:	
            logging.info ('Successfully created issue "%s"' % title)	
            # logging.info (self.RESPONSE_STRING, response.content)	
        else:	
            logging.info ('Could not create Issue "%s"' % title)	
            logging.info (self.RESPONSE_STRING, response.content)	
    def create_github_comment(self, issue_number, body):	
        # Create an issue on github.com using the given parameters	
        # Url to create issues via POST	
        url = 'https://api.github.com/repos/%s/%s/issues/%s/comments' % (self.GITHUB_REPO_OWNER, self.GITHUB_REPO_NAME, issue_number)	
        	
        # Headers	
        headers = {	
            "Authorization": "token %s" % self.github_user_token,	
            "Accept": "application/vnd.github.v3+json"	
        }	
        	
        # Create our issue working properly, just need to add labels etc	
        data = {	
            'body': body,	
        }	
        payload = json.dumps(data)	
        # Add the issue to our repository	
        response = requests.request("POST", url, data=payload, headers=headers)	
        logging.info(response.status_code)	
        if response.status_code == 201:	
            logging.info ('Successfully created Comment "%s" on issue #%s' % (body, issue_number))	
            # logging.info (self.RESPONSE_STRING, response.content)	
        else:	
            logging.info ('Could not create Comment "%s"' % body)	
            logging.info (self.RESPONSE_STRING, response.content)	

    def authenticate(self, token):	
        # setup management api request 	
        auth0_users_authorization =  "Bearer " + token
        
        auth0_connection =  http.client.HTTPSConnection("dev.onfarmtech.org")	
        logging.info("hi")
        auth0_users_headers = { 'authorization': auth0_users_authorization }	
        # request users	
        logging.info(auth0_users_headers)
        auth0_connection.request("GET", "/api/private", headers=auth0_users_headers)
        auth0_users_res = auth0_connection.getresponse()	
        auth0_users_data = auth0_users_res.read()	
        # convert to json	
        json_auth0_users_data = auth0_users_data.decode('utf8').replace("'", '"')	
        
        logging.info("data = " + json_auth0_users_data)
        logging.info("hi")
        if json_auth0_users_data == "Unauthorized":
            logging.info("You are not authorized to access this function")
            return "Not Authenticated"
        else:
            return "Authenticated"

    def set_class_variables(self):
        self.get_token()	
        self.get_users()	
        self.get_users_github_token()

def main(req: func.HttpRequest) -> func.HttpResponse:	
    # variable to avoid reuse
    HEADER = { 'content-type': 'application/json' }

    # log that the function is called
    logging.info('Python HTTP trigger function processed a request.')	

    # in a try catch because if the payload is not json it causes exception
    try:	
        # get the body as a json object
        req_body = req.get_json()	
        if DEBUG:
            logging.info("Request body = " + json.dumps(req_body))	
            logging.info("\n\n")

        # get params
        action = req_body.get('action')	
        user = req_body.get('user')	
        title = req_body.get('title')	
        body = req_body.get('body')	
            
        try:	
            assignees = req_body.get('assignees')	
            labels = req_body.get('labels')	
        except Exception:	
            assignees = 'none'	
            labels = 'none'	
            
        comment = req_body.get('comment')	
        number = req_body.get('number')	
        token = req_body.get('token')	

        if DEBUG:
            # debug logging.infos
            logging.info("Action param = " + action)	
            logging.info("User param = " + user)
            if title and body and assignees and labels:	
                logging.info("Title param = " + title)	
                logging.info("Body param = " + body)	
                logging.info("Assignees = " + str(assignees))	
                logging.info("Labels = " + str(labels))
            if comment and number:
                logging.info("Comment param = " + comment)	
                logging.info("Number param = " + str(number))	
            logging.info("Token param = " + token)	
            logging.info("\n")

        # instantiate GithupIssues class
        ghi = GithubIssues(user)
        # authenticate user based on token	
        authenticated = ghi.authenticate(token)	
        if authenticated == "Not Authenticated":
            return func.HttpResponse(	
                # body may be unneeded
                body = token + " You are not authorized",	
                status_code=401,	
                headers=HEADER	
            )
        else:
            # if action is create
            # set all the needed class variables
            ghi.set_class_variables()
            if action == "create":	
                # create issue
                ghi.create_github_issue(title, body, assignees, labels)	
                # send back response
                return func.HttpResponse(	
                    # body may be unneeded
                    body = json.dumps({"test": "test"}),	
                    status_code=201,	
                    headers=HEADER	
                )	
            # if action is comment
            elif action == "comment":	
                # create comment
                ghi.create_github_comment(number, comment)	
                # send back response
                return func.HttpResponse(	
                    # body may be unneeded
                    body = json.dumps({"test": "test"}),	
                    status_code=201,	
                    headers=HEADER	
                )	
    # handle exceptions 
    except Exception as error:
        logging.info("Program encountered exception: " + str(error))
        return func.HttpResponse(
            body = str(error),
            status_code=400,
            headers=HEADER
        )