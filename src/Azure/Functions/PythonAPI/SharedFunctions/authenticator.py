import logging
import http.client	
import json
from six.moves.urllib.request import urlopen
from functools import wraps
import os

# from flask import Flask, request, jsonify, _request_ctx_stack
# from flask_cors import cross_origin
from jose import jwt



def authenticate(token):	
    # setup management api request 	
    # auth0_users_authorization =  "Bearer " + token

    auth0_domain = os.environ["AUTH0_DOMAIN"]
    auth0_audience = os.environ["AUTH0_AUDIENCE"]
    algorithms = ["RS256"]
    
    # auth0_connection =  http.client.HTTPSConnection("onfarmtech.org")	
    # auth0_users_headers = { 'authorization': auth0_users_authorization }	
    # # request users	
    # logging.info(auth0_users_headers)
    # auth0_connection.request("GET", "/api/private", headers=auth0_users_headers)
    # auth0_users_res = auth0_connection.getresponse()	
    # auth0_users_data = auth0_users_res.read()	
    # # convert to json	
    # json_auth0_users_data = auth0_users_data.decode('utf8').replace("'", '"')	
    
    # logging.info("data = " + json_auth0_users_data)
    # if json_auth0_users_data == "Unauthorized":
    #     logging.info("You are not authorized to access this function")
    #     return "Not Authenticated"
    # else:
    #     return "Authenticated"

    return requires_auth(algorithms, auth0_audience, auth0_domain, token)

# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

# # Format error response and append status code
# def get_token_auth_header():
#     """Obtains the Access Token from the Authorization Header
#     """
#     auth = request.headers.get("Authorization", None)
#     if not auth:
#         raise AuthError({"code": "authorization_header_missing",
#                         "description":
#                             "Authorization header is expected"}, 401)

#     parts = auth.split()

#     if parts[0].lower() != "bearer":
#         raise AuthError({"code": "invalid_header",
#                         "description":
#                             "Authorization header must start with"
#                             " Bearer"}, 401)
#     elif len(parts) == 1:
#         raise AuthError({"code": "invalid_header",
#                         "description": "Token not found"}, 401)
#     elif len(parts) > 2:
#         raise AuthError({"code": "invalid_header",
#                         "description":
#                             "Authorization header must be"
#                             " Bearer token"}, 401)

#     token = parts[1]
#     return token

def requires_auth(algorithms, auth0_audience, auth0_domain, token):
    """Determines if the Access Token is valid
    """
    # @wraps(f)
    # def decorated(*args, **kwargs):
        # token = get_token_auth_header()
    jsonurl = urlopen("https://" + auth0_domain + "/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())
    print("jwks")
    print(jwks)
    try:
        unverified_header = jwt.get_unverified_header(token)
    except Exception:
        return False, {"code": "invalid_format",
                "description": "token format is invalid"}
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=algorithms,
                audience=auth0_audience,
                issuer="https://" + auth0_domain + "/"
            )
        except jwt.ExpiredSignatureError:
            return False, {"code": "token_expired",
                           "description": "token is expired"}
        except jwt.JWTClaimsError:
            return False, {"code": "invalid_claims",
                           "description": "incorrect claims, please check the audience and issuer"}
        except Exception:
            return False, {"code": "invalid_header",
                           "description": "Unable to parse authentication token."}

    return True, {"code": "successfully validated token"}