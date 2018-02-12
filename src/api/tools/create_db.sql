CREATE TABLE files_versions (id integer primary key autoincrement, file_id integer, date_created integer, content text);
CREATE TABLE files (id integer primary key autoincrement, name text, date_created number, user_id number);
CREATE TABLE users (id integer primary key autoincrement, name text, email text, image text, fbid number, date_created number);
CREATE TABLE metadata (key TEXT, value TEXT, user_id NUMBER, PRIMARY KEY (key, user_id));
