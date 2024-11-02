create table if not exists discounts (
    id serial primary key,
    product_id int,
    foreign key (product_id) references products(id),
    category_id int,
    foreign key (category_id) references categories(id),
    brand_id int,
    foreign key (brand_id) references brands(id),
    product_type_id int,
    foreign key (product_type_id) references product_types(id),
    discount_percentage int not null,
    start_date timestamp WITH TIME ZONE not null,
    end_date timestamp WITH TIME ZONE not null,
    is_active bool not null,
    created_at timestamp WITH TIME ZONE default current_timestamp not null,
    updated_at timestamp WITH TIME ZONE,
    deleted int default 0 not null,
    deleted_at timestamp WITH TIME ZONE
);