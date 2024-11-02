create table if not exists favorites (
    id serial primary key,
    user_id int not null,
    foreign key (user_id) references users(id),
    product_item_id int not null,
    foreign key (product_item_id) references product_items(id),
    created_at timestamp with time zone default current_timestamp not null,
    updated_at timestamp with time zone,
    deleted int default 0 not null,
    deleted_at timestamp with time zone
);