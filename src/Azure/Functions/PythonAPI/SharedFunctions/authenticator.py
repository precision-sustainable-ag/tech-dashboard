import logging
import http.client	
import json
from six.moves.urllib.request import urlopen
from functools import wraps
import os
from jose import jwt

def authenticate(token):	
    auth0_domain = os.environ["AUTH0_DOMAIN"]
    auth0_audience = os.environ["AUTH0_AUDIENCE"]
    algorithms = ["RS256"]

    return requires_auth(algorithms, auth0_audience, auth0_domain, token)

def requires_auth(algorithms, auth0_audience, auth0_domain, token):
    """Determines if the Access Token is valid"""
    jsonurl = urlopen("https://" + auth0_domain + "/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())

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