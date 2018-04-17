import sys
import logging
import pymysql
import db_creds

def getLogger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    return logger


def dbConnect():
	try:
		conn = pymysql.connect(db_creds.db_host,
            user=db_creds.db_username, passwd=db_creds.db_password,
            db=db_creds.db_name,
			connect_timeout=5,
			cursorclass=pymysql.cursors.DictCursor
		)

		return conn
	except Exception as e:
		getLogger().error("Connection error! " + str(e))
		sys.exit()

	return False

def dbRow(sql, *params):
	""" query exactly one row from the DB """
	conn = dbConnect()
	try:
		cur = conn.cursor()
		cur.execute(sql, params)
		result = cur.fetchone()

	except Exception as e:
		getLogger().error("dbRow error! " + str(e))
		sys.exit()

	finally:
		conn.close()

	return result


def dbQuery(sql, *params):
	""" query rows from the DB """
	conn = dbConnect()
	try:
		cur = conn.cursor()
		cur.execute(sql, params)
		result = cur.fetchall()

	except Exception as e:
		getLogger().error("dbQuery error! " + str(e))
		sys.exit()

	finally:
		conn.close()

	return result


def dbExec(sql, *params):
	""" execute query to the DB """
	conn = dbConnect()
	result = True
	try:
		cur = conn.cursor()
		cur.execute(sql, params)
		
		if sql.lower().startswith('insert'):
			result = cur.lastrowid
			
	except Exception as e:
		getLogger().error('Execution error! ' + str(e))
		sys.exit()

	finally:
		conn.commit()
		conn.close()

	return result
