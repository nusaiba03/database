CREATE DATABASE IF NOT EXISTS AERO_SCOPE;
USE aero_scope;
# Create the app user
CREATE USER IF NOT EXISTS 'aero_scope_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON aero_scope.* TO ' aero_scope_app'@'localhost';

# Create the flights tables
CREATE TABLE IF NOT EXISTS flights (
id INT AUTO_INCREMENT,
name VARCHAR(50),
price DECIMAL(5, 2),
PRIMARY KEY(id));

# Create the users tables
CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT,
username VARCHAR(50)NOT NULL UNIQUE,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
hashedPassword VARCHAR(255) NOT NULL,
role ENUM('admin', 'user') DEFAULT 'user',
PRIMARY KEY (id)
);

ALTER TABLE users
ADD role ENUM('admin', 'user') DEFAULT 'user';

UPDATE users
SET role = 'admin'
WHERE username = 'Sam';