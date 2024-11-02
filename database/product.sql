create table if not exists colours(
	id serial primary key,
	colour_1 varchar(10) not null,
	colour_2 varchar(10),
	colour_3 varchar(10),
	deleted int default 0 not null,
	deleted_at timestamp with time zone
);

create table if not exists brands(
	id serial primary key,
	name varchar(100) not null,
	image_path varchar(1000) not null,
	code int not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique(name, code, deleted)
);

create table if not exists field_types(
	id serial primary key,
	name varchar(20) not null unique
);
insert into field_types (name) values
('string'),
('number'),
('boolean');

create table if not exists currencies(
	id serial primary key,
    azn decimal not null,
	eur decimal not null,
	tr decimal not null,
	updated_at timestamp with time zone
);
insert into currencies (azn, eur, tr) values (1.7, 0.9, 34.21);

create table if not exists product_types(
	id serial primary key,
	name varchar(50) not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (name, deleted)
);

create table if not exists product_type_fields(
	id serial primary key,
	name varchar(50) not null,
	product_type_id int not null,
	foreign key(product_type_id) references product_types(id),
	field_type_id int not null,
	foreign key(field_type_id) references field_types(id),
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (name, product_type_id, deleted)
);

create table if not exists categories(
	id serial primary key,
	name varchar(50) not null,
	slug varchar(100) not null,
	parent_id int,
	foreign key(parent_id) references categories(id),
	product_type_id int,
	foreign key(product_type_id) references product_types(id),
	image_path varchar(1000) not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (name, parent_id, product_type_id, deleted)
);

create table if not exists products(
	id serial primary key,
	name varchar(200) not null,
	description varchar(1000) not null,
	is_active bool default false not null,
	sku int not null,
	slug varchar(400) not null,
	brand_id int not null,
	foreign key (brand_id) references brands(id),
	category_id int not null,
	foreign key (category_id) references categories(id),
	base_price decimal(10, 2) not null,
	rating int default 0 not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (name, sku, deleted)
);

create table if not exists product_fields(
	id serial primary key,
	product_id int not null,
	foreign key (product_id) references products(id),
	product_type_field_id int not null,
	foreign key (product_type_field_id) references product_type_fields(id),
	value varchar not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (product_id, product_type_field_id, deleted)
);

create table if not exists product_items(
	id serial primary key,
	colour_id int not null,
	foreign key (colour_id) references colours(id),
	product_id int not null,
	foreign key (product_id) references products(id),
	image_paths varchar[] default '{}',
	stock int default 0 not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (colour_id, product_id, deleted)
);

create table if not exists product_variations(
	id serial primary key,
	name varchar(200) not null,
	product_item_id int not null,
	foreign key (product_item_id) references product_items(id),
	base_price decimal(10, 2) not null,
	stock int default 0 not null,
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (name, product_item_id, deleted)
);

create table if not exists product_variation_fields(
	id serial primary key,
	product_variation_id int not null,
	foreign key (product_variation_id) references product_variations(id),
	product_type_field_id int not null,
	foreign key (product_type_field_id) references product_type_fields(id),
	value varchar(200),
	created_at timestamp with time zone default current_timestamp not null,
	updated_at timestamp with time zone,
	deleted int default 0 not null,
	deleted_at timestamp with time zone,
	unique (product_variation_id, product_type_field_id, deleted)
);