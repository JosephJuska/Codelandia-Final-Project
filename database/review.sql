create table if not exists reviews (
    id serial primary key,
    title varchar(100),
    description varchar(500),
    review decimal(2, 1),
    product_id int not null,
    foreign key (product_id) references products(id),
    name varchar(50),
    email varchar(300) not null,
    CREATED_AT TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT DEFAULT 0 NOT NULL,
	DELETED_AT TIMESTAMP with time zone,
	UNIQUE (product_id, email, deleted)
);

insert into reviews (title, description, review, product_id, name, email) values ('Satisfied', 'Satisfied', 5, 3, 'John', '9hX5w@example.com');