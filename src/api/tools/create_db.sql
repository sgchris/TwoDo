CREATE TABLE files_versions (id integer primary key autoincrement, file_id integer, date_created integer, content text);
CREATE TABLE files (id integer primary key autoincrement, name text, date_created number, user_id number);
CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT, user_id number);
CREATE TABLE users (id integer primary key autoincrement, name text, email text, image text, fbid number, date_created number);
