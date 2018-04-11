import logging
import pymysql

db_host = "grinotes.cemssk6v1d31.eu-central-1.rds.amazonaws.com"
db_username = "grinotes"
db_password = "WmuPLVGj3jG6fTKL"
db_name = "grinotes" 

def getLogger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    return logger
    

def dbConnect():
	try: 
		conn = pymysql.connect(
			db_host, user=db_username, passwd=db_password, db=db_name, 
			connect_timeout=5,
			cursorclass=pymysql.cursors.DictCursor
		)

		return conn
	except Exception as e:
		logger.error("Connection error! " + str(e))
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
		logger.error("dbRow error! " + str(e))
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
		logger.error("dbQuery error! " + str(e))
		sys.exit()

	finally:
		conn.close()
	
	return result


def dbExec(sql, *params):
	""" execute query to the DB """
	conn = dbConnect()
	try:
		cur = conn.cursor()
		cur.execute(sql, params)
		result = cur.fetchall()

	except Exception as e:
		print 'Execution error! ' + str(e)
		sys.exit()

	finally:
		conn.commit()
		conn.close()
	
	return result

