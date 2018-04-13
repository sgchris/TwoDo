import sys
import json
import logging
from tools import db
import pymysql

def lambda_handler(event, context):
    """
    This function fetches the files list of a user
    params:
        event.fbid
    """

    # receive parameters
    fbid = event['fbid']

    filesList = db.dbQuery(
        'SELECT f.id, f.name, LENGTH(fv.content) as size '+
        'FROM files f ' +
            'LEFT JOIN files_versions fv ON fv.file_id = f.id '+
        'WHERE f.user_id = %s '+
        'GROUP BY f.id '+
        'ORDER BY f.date_created ASC, fv.date_created DESC',
        fbid
    )

    return {'result':'ok', 'files':filesList}
