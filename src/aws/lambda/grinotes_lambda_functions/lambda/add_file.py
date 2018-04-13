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
    name = event['name']
    fbid = event['fbid']

    # validate params
    if not name or len(name) == 0:
        return helpers._error('name was not provided')
    if not fbid or len(fbid) == 0:
        return helpers._error('facebook id was not provided')

    # check the user
    userObj = helpers.getUser(fbid)
    if userObj == False:
        return helpers._error('cannot find the user')

    userId = userObj['id']

    # check if the file already exists
    file = db.dbRow('SELECT id FROM files WHERE name LIKE %s AND user_id = %s',
        '%'+name+'%', userId
    )
    if file:
        return helpers._error('file with this name already exists')

    # insert new file to the DB
    lastInserId = db.dbExec('INSERT INTO files (name, user_id, date_created) VALUES (%s, %s, %s)',
        name, userId, time.time()
    )

    return helpers._success({"fileId": lastInserId})
