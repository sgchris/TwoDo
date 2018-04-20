import sys
import json
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
        return helpers._error('file ID was not provided')

    # get the required version id (might be empty)
    versionId = event['versionid'] if "versionid" in event else 0

    fbid = event['fbid']
    if not fbid or len(fbid) == 0:
        return helpers._error('facebook id was not provided')

    # get user
    userObj = helpers.getUser(fbid)
    if not userObj:
        return helpers._error('user not found')

    userId = userObj['id']

    # prepare SQL with params
    versionCondition = ""
    sqlParams = {"file_id":fileId, "user_id":userId}
    if versionId:
        sqlParams['version_id'] = versionId
        versionCondition = " AND fv.id = %(version_id)s "

    sqlString = """
    	SELECT f.id, f.name,
            IFNULL(fv.content, "") as content,
            IFNULL(fv.date_created, 0) as date_created,
            COUNT(f.id) as total_versions
        FROM files f
            LEFT JOIN files_versions fv
                ON fv.file_id = f.id """
    sqlString += versionCondition
    sqlString += """
        WHERE f.id = %(file_id)s AND f.user_id = %(user_id)s
        GROUP BY f.id
        ORDER BY fv.date_created DESC
        LIMIT 1"""

    fileData = db.dbRow(sqlString, sqlParams)
    if not fileData:
        return helpers._error('file not found')

    # get the last 15 versions
    versionsList = db.dbQuery("""
        SELECT * FROM files_versions
        WHERE file_id = %s
        ORDER BY date_created DESC LIMIT 15""",
        fileId
    )

    return helpers._success({'data': fileData, 'versions': versionsList})
