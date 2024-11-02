create or replace function create_review(
    p_title varchar,
    p_description varchar,
    p_review decimal,
    p_product_id int,
    p_name varchar,
    p_email varchar
) 
returns int
as $$
declare
    v_product_id int;
    v_review_id int;
    v_average_rating decimal;
    v_id int;
begin
    select id into v_product_id from products where deleted = 0 and is_active = true and id = p_product_id;
    if v_product_id is null then
        raise exception 'Product not found' using errcode = 'PNF00';
    end if;

    select id into v_review_id from reviews where deleted = 0 and email = p_email and product_id = p_product_id;
    if v_review_id is not null then
        raise exception 'Review with email % already exists', p_email using errcode = 'RAE01';
    end if;

    insert into reviews (title, description, review, product_id, name, email) values
    (p_title, p_description, p_review, p_product_id, p_name, p_email) returning id into v_id;

    select round(avg(review)::numeric * 2) / 2::numeric into v_average_rating
    from reviews 
    where deleted = 0 and product_id = p_product_id;

    update products set rating = v_average_rating where id = p_product_id;

    return v_id;
end;
$$ language plpgsql;



create or replace procedure delete_review(
    p_id int
) as $$
declare
    v_review_id int;
begin
    select id into v_review_id from reviews where deleted = 0 and id = p_id;
    if v_review_id is null then
        raise exception 'Review not found' using errcode = 'RNF00';
    end if;

    update reviews set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



create or replace function get_review_by_id(
    p_id int
) returns table (like reviews)
as $$
declare
    v_review_id int;
begin
    select id into v_review_id from reviews where deleted = 0 and id = p_id;
    if v_review_id is null then
        raise exception 'Review not found' using errcode = 'RNF00';
    end if;

    return query
    select * from reviews where id = p_id;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION get_reviews(
    p_search_term VARCHAR,
    p_sort_by VARCHAR,
    p_product_id INT,
    p_limit INT,
    p_offset INT
)
RETURNS TABLE (
    id INT,
    title VARCHAR,
    description VARCHAR,
    review DECIMAL(2,1),
    product_id INT,
    product_name VARCHAR,
    name VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    page_count INT
) 
AS $$
DECLARE
    v_total_count INT;
    sort_column VARCHAR := 'r.created_at';
    sort_order VARCHAR := 'DESC';
BEGIN
    IF p_sort_by = 'newest' THEN
        sort_column := 'r.created_at'; 
        sort_order := 'DESC';
    ELSIF p_sort_by = 'oldest' THEN
        sort_column := 'r.created_at'; 
        sort_order := 'ASC';
    ELSIF p_sort_by = 'ratingASC' THEN
        sort_column := 'r.review'; 
        sort_order := 'ASC';
    ELSIF p_sort_by = 'ratingDESC' THEN
        sort_column := 'r.review'; 
        sort_order := 'DESC';
    END IF;

    SELECT COUNT(*)
    INTO v_total_count
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE r.deleted = 0
      AND (p_product_id IS NULL OR r.product_id = p_product_id)
      AND (p_search_term IS NULL OR r.name ILIKE '%' || p_search_term || '%' OR r.email ILIKE '%' || p_search_term || '%');

    RETURN QUERY
    SELECT r.id,
           r.title,
           r.description,
           r.review,
           r.product_id,
           p.name AS product_name,
           r.name,
           r.email,
           r.created_at,
           r.updated_at,
           CEIL(v_total_count::DECIMAL / p_limit)::INT AS page_count
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE r.deleted = 0
      AND (p_product_id IS NULL OR r.product_id = p_product_id)
      AND (p_search_term IS NULL OR r.name ILIKE '%' || p_search_term || '%' OR r.email ILIKE '%' || p_search_term || '%')
    ORDER BY sort_column || ' ' || sort_order
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;



create or replace function get_reviews_by_product_id(
    p_id int,
    p_is_active bool,
    p_limit int,
    p_offset int
) returns table (like reviews)
as $$
declare
    v_product_id int;
begin
    select id into v_product_id from products where deleted = 0 and (p_is_active is null or is_active = p_is_active) 
    and id = v_product_id;
    if v_product_id is null then
        raise exception 'Product not found' using errcode = 'PNF00';
    end if;

    return query
    select * from reviews where deleted = 0 and product_id = v_product_id limit p_limit offset p_offset;
end;
$$ language plpgsql;