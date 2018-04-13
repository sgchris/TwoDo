import db


def _success(obj):
    """ Return success object (prepend "result": "ok" to the object) """
    if not obj:
        obj = {}
    obj['result'] = 'ok'
    return obj

def _error(obj):
    """ Return failure object (prepend "result": "error" to the object) """
    if isinstance(obj, basestring):
        obj = {"error":obj}

    obj['result'] = 'error'
    return obj

def getUser(fbid):
    """ get a user from the database by fbid (param) """
    result = db.dbRow('select * from users where fbid=%s', fbid);
    if not result:
        return False

    return result
