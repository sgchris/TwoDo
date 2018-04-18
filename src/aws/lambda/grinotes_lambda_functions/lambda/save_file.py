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
    fileId = event['fileid']
    if not fileId:
        return helpers._error('file id was not provided')

    # usually one of them is provided
    name = event['name'] if 'name' in event else False
    content = event['content'] if 'content' in event else False

    fbid = event['fbid']
    if not fbid or len(fbid) == 0:
        return helpers._error('facebook id was not provided')

    # check the user
    userObj = helpers.getUser(fbid)
    if userObj == False:
        return helpers._error('cannot find the user')
    userId = userObj['id']

    # check file exists
    fileData = db.dbRow('SELECT * FROM files WHERE id = %s AND user_id = %s', fileId, userId)
    if not fileData:
        return helpers._error('file not found')

    # update only the name of the file
    if name:
        db.dbExec('UPDATE files SET name = %s WHERE id = %s', name, fileId)

    if content:
        db.dbExec('INSERT INTO files_versions (file_id, date_created, content) VALUES (%s, %s, %s)',
            fileId, time.time(), content)

    return helpers._success()
