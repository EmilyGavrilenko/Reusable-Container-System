drop table IF EXISTS containers;
drop table IF EXISTS users;
drop table IF EXISTS transactions;

create table containers (
    ID VARCHAR(20),
    checkedOut VARCHAR (1),
    primary key (ID)
);

create table users (
    ID VARCHAR (100),
    firstName TEXT,
    lastName TEXT,
    primary key (ID)
);

create table transactions (
    user VARCHAR(20),
    container VARCHAR(20),
    datetime DATETIME,
    checkedOut VARCHAR (1),
    primary key (user, container, datetime),
    foreign key (user) references users (ID)
    foreign key (container) references containers (ID)
);
