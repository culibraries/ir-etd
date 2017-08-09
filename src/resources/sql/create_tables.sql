-- Database scripts for etd
--
-- To create the etd database, run the following scripts in sequence in
-- the MySQL CLI. The first script creates the database object itself. This
-- is followed by the script to create the tables in the database. The final
-- scripts set up the service account with the require privileges.

-- Run this command first
CREATE DATABASE etd CHARACTER SET utf8;

-- Before creating the database tables, USE the target database first
USE etd;

-- Main submission table
CREATE TABLE submission (
	submission_id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	sequence_num VARCHAR(10) NOT NULL,
	title VARCHAR(200) NOT NULL,
	fulltext_url VARCHAR(200) NOT NULL,
	keywords VARCHAR(200) NOT NULL,
	abstract VARCHAR(4000) NOT NULL,
	author1_fname VARCHAR(50) NOT NULL,
	author1_mname VARCHAR(50) NOT NULL,
	author1_lname VARCHAR(50) NOT NULL,
	author1_suffix VARCHAR(10) NOT NULL,
	author1_email VARCHAR(50) NOT NULL,
	author1_institution VARCHAR(50) NOT NULL,
	advisor1 VARCHAR(50) NOT NULL,
	advisor2 VARCHAR(50) NOT NULL,
	advisor3 VARCHAR(50) NOT NULL,
	advisor4 VARCHAR(50) NOT NULL,
	advisor5 VARCHAR(50) NOT NULL,
	disciplines VARCHAR(200) NOT NULL,
	comments VARCHAR(500) NOT NULL,
	degree_name VARCHAR(50) NOT NULL,
	department VARCHAR(50) NOT NULL,
	document_type CHAR(12) NOT NULL,
	embargo_date VARCHAR(5) NOT NULL,
	publication_date DATE NOT NULL,
	season CHAR(20) NOT NULL,
	workflow_status CHAR(1) NOT NULL,
	identikey CHAR(8) NOT NULL,
	create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	update_date TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	acceptance CHAR(2) NOT NULL
);

-- Degree name reference table
CREATE TABLE degree_name_ref (
	degree_name_id INT(10) UNSIGNED NOT NULL PRIMARY KEY,
	degree_name_short VARCHAR(10) NOT NULL,
	degree_name_long VARCHAR(100) NOT NULL
);

-- Discipline reference table
CREATE TABLE discipline_ref (
	discipline_id INT(10) UNSIGNED NOT NULL PRIMARY KEY,
	discipline_name VARCHAR(100) NOT NULL

);

-- Finally, create the service user that the application will use
-- to access the database
CREATE USER 'etd_service'@'localhost' IDENTIFIED BY 'cuboulder';
GRANT SELECT, INSERT, UPDATE ON etd.submission TO 'etd_service'@'128.138.184.102';
GRANT SELECT etd.degree_name_ref TO 'etd_service'@'128.138.184.102';
GRANT SELECT etd.discipline_ref TO 'etd_service'@'128.138.184.102';
