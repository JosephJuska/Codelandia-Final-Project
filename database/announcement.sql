create table if not exists announcements (
    id serial primary key,
    title varchar(100) not null,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    is_active bool default false not null,
    created_at timestamp with time zone default current_timestamp not null,
    updated_at timestamp with time zone,
    deleted int default 0 not null,
    deleted_at timestamp with time zone
);