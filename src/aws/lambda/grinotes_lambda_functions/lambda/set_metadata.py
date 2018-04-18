import sys
import time
import logging
from tools import db
from tools import helpers
import pymysql

def lambda_handler(event, context):
    """
    This function fetches the files list of a user
    params:
        event.fbid
    """

    # receive parameters
    key = event['key']
    value = event['value']
    fbid = event['fbid']

    # validate params
    if not key or len(key) == 0:
        return helpers._error('key was not provided')
    if not fbid or len(fbid) == 0:
        return helpers._error('facebook id was not provided')

    # check the user
    userObj = helpers.getUser(fbid)
    if userObj == False:
        return helpers._error('cannot find the user')

    userId = userObj['id']

    # check if the file already exists
    result = db.dbExec('REPLACE INTO metadata (key, value, user_id) values (%s, %s, %s)',
        key, value, userId
    )

    return helpers._success()
