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
    row = db.dbRow('SELECT `value` FROM `metadata` WHERE `key` = %s AND `user_id` = %s',
        key, userId
    )

    return helpers._success({"key": key, "value": row['value']})
