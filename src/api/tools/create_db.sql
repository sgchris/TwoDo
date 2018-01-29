CREATE TABLE files_versions (id integer primary key autoincrement, file_id integer, date_created integer, content text);
CREATE TABLE files (id integer primary key autoincrement, name text);
CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT);
