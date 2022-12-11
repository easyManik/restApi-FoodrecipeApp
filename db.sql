-- Active: 1670551262223@@127.0.0.1@5432@foodrecipe
create table users(
    id_user VARCHAR(255) PRIMARY KEY,
    name VARCHAR(50) not NULL,
    email VARCHAR(100) NOT NULL, 
    phonenumber BIGINT NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    photo VARCHAR(255) DEFAULT NULL
    );

ALTER TABLE users ADD verif INT;

ALTER TABLE users ADD otp varchar(32);


DROP TABLE users ;

CREATE Table recipe(
    id_recipe SERIAL PRIMARY KEY,
    name_recipe VARCHAR(255),
    photo VARCHAR(255),
    video VARCHAR(255),
    ingredients VARCHAR(1000),
    date_post TIMESTAMP DEFAULT current_timestamp,
    id_user INT  REFERENCES users(id_user) NOT NULL
);


CREATE TABLE comments (
    id_comment SERIAL PRIMARY KEY,
    comments VARCHAR(500) NOT NULL,
    id_user INT REFERENCES  users(id_user) NOT NULL,
    id_recipe INT REFERENCES recipe(id_recipe) NOT NULL,
    data_comment TIMESTAMP DEFAULT current_timestamp
);