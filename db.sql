-- Active: 1675064026199@@pijardb-do-user-13063919-0.b.db.ondigitalocean.com@25060@food-easy@public
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


DROP TABLE saved ;

-- CREATE Table recipe(
--     id_recipe VARCHAR(255) PRIMARY KEY,
--     name_recipe VARCHAR(255),
--     photo VARCHAR(255),
--     video VARCHAR(255),
--     ingredients VARCHAR(1000),
--     date_post TIMESTAMP DEFAULT current_timestamp,
--     id_user VARCHAR(255)  REFERENCES users(id_user) NOT NULL
-- );

CREATE TABLE recipes (
    id varchar(255) not null,
    title VARCHAR(255) NOT NULL,
    image varchar(255) not null,
    ingredient text NOT NULL,
    video varchar(255) not null,
    id_user varchar(255) not null REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    post_at timestamp default current_timestamp,
    UNIQUE (id)
);

CREATE TABLE saved (
    id SERIAL NOT NULL,
    id_user varchar(255) not null,
    id_recipe varchar(255) not null
);

CREATE TABLE likes (
    id SERIAL NOT NULL,
    id_user varchar(255) not null REFERENCES users (id_user) ON DELETE CASCADE ON UPDATE CASCADE,
    id_recipe varchar(255) not null REFERENCES recipes (id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO likes(id_user, id_recipe) VALUES ('3cdde07b-95d8-4ef1-a077-52d66b97cc65', 'd1cb058d-1b13-478f-8146-1db9be9e23e5');

SELECT likes.id, recipes.title, recipes.image, recipes.id from likes, recipes WHERE likes.id_user='3cdde07b-95d8-4ef1-a077-52d66b97cc65' AND likes.id_recipe=recipes.id;

SELECT saved.id, recipes.title, recipes.image, recipes.id as recipe_id from saved, recipes WHERE saved.id_user = 'e41d1f41-dee3-4a3e-8b41-b263e1923c95' AND saved.id_recipe= recipes.id;

SELECT * FROM recipes WHERE id_user = 'e41d1f41-dee3-4a3e-8b41-b263e1923c95';