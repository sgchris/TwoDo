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
    file_id = event['file_id']
    fbid = event['fbid']

    # validate params
    if not file_id or len(file_id) == 0:
        return helpers._error('file_id was not provided')
    if not fbid or len(fbid) == 0:
        return helpers._error('facebook id was not provided')

    # check the user
    userObj = helpers.getUser(fbid)
    if userObj == False:
        return helpers._error('cannot find the user')

    userId = userObj['id']

    # check if the file already exists
    file = db.dbRow('SELECT id FROM files WHERE id = %s AND user_id = %s',
        file_id, userId
    )
    if not file:
        return helpers._error('file not found')

    # insert new file to the DB
    db.dbExec('DELETE FROM files WHERE id = %s', file_id)
    db.dbExec('DELETE FROM files_versions WHERE file_id = %s', file_id)

    return helpers._success()
