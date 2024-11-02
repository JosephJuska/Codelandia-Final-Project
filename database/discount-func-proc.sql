create or replace function create_discount (
    p_product_id int,
    p_category_id int,
    p_brand_id int,
    p_product_type_id int,
    p_discount_percentage int,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone,
    p_is_active bool
) 
returns int
as $$
declare
    v_id int;
    v_count int;
begin
    v_count := (CASE WHEN p_product_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_category_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_brand_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_product_type_id IS NOT NULL THEN 1 ELSE 0 END);
    
    if v_count > 1 then
        raise exception 'Only one of product_id, category_id, brand_id, or product_type_id must be provided' using errcode = 'DC001';
    end if;

    if v_count = 0 then
        raise exception 'One of product_id, category_id, brand_id, or product_type_id must be provided' using errcode = 'DC002';
    end if;

    if p_product_id is not null then
        select id into v_id from products where deleted = 0 and id = p_product_id;
        if v_id is null then
            raise exception 'Product not found' using errcode = 'PNF00';
        end if;
    end if;

    if p_category_id is not null then
        select id into v_id from categories where deleted = 0 and id = p_category_id;
        if v_id is null then
            raise exception 'Category not found' using errcode = 'CNF00';
        end if;
    end if;

    if p_brand_id is not null then
        select id into v_id from brands where id = p_brand_id;
        if v_id is null then
            raise exception 'Brand not found' using errcode = 'BNF00';
        end if;
    end if;

    if p_product_type_id is not null then
        select id into v_id from product_types where deleted = 0 and id = p_product_type_id;
        if v_id is null then
            raise exception 'Product type not found' using errcode = 'PTNF0';
        end if;
    end if;

    insert into discounts (product_id, category_id, brand_id, product_type_id, discount_percentage, start_date, end_date, is_active) values
    (p_product_id, p_category_id, p_brand_id, p_product_type_id, p_discount_percentage, p_start_date, p_end_date, p_is_active)
    returning id into v_id;

    return v_id;
end;
$$ language plpgsql;



create or replace procedure update_discount(
    p_id int,
    p_product_id int,
    p_category_id int,
    p_brand_id int,
    p_product_type_id int,
    p_discount_percentage int,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone,
    p_is_active bool
) as $$
declare
    v_id int;
    v_count int;
    v_discount_id int;
    v_current_discount record;
begin
    select id into v_discount_id from discounts where deleted = 0 and id = p_id;
    if v_discount_id is null then
        raise exception 'Discount not found' using errcode = 'DNF00';
    end if;

    v_count := (CASE WHEN p_product_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_category_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_brand_id IS NOT NULL THEN 1 ELSE 0 END) +
               (CASE WHEN p_product_type_id IS NOT NULL THEN 1 ELSE 0 END);
    
    if v_count > 1 then
        raise exception 'Only one of product_id, category_id, brand_id, or product_type_id must be provided' using errcode = 'DC001';
    end if;

    if v_count = 0 then
        raise exception 'One of product_id, category_id, brand_id, or product_type_id must be provided' using errcode = 'DC002';
    end if;

    if p_product_id is not null then
        select id into v_id from products where deleted = 0 and id = p_product_id;
        if v_id is null then
            raise exception 'Product not found' using errcode = 'PNF00';
        end if;
    end if;

    if p_category_id is not null then
        select id into v_id from categories where deleted = 0 and id = p_category_id;
        if v_id is null then
            raise exception 'Category not found' using errcode = 'CNF00';
        end if;
    end if;

    if p_brand_id is not null then
        select id into v_id from brands where id = p_brand_id;
        if v_id is null then
            raise exception 'Brand not found' using errcode = 'BNF00';
        end if;
    end if;

    if p_product_type_id is not null then
        select id into v_id from product_types where deleted = 0 and id = p_product_type_id;
        if v_id is null then
            raise exception 'Product type not found' using errcode = 'PTNF0';
        end if;
    end if;

    select * into v_current_discount from discounts where id = p_id;

    if (p_product_id is distinct from v_current_discount.product_id) OR
        (p_brand_id is distinct from v_current_discount.brand_id) OR
        (p_category_id is distinct from v_current_discount.category_id) OR
        (p_product_type_id is distinct from v_current_discount.product_type_id) OR
        (p_discount_percentage is distinct from v_current_discount.discount_percentage) OR
        (p_start_date is distinct from v_current_discount.start_date) OR
        (p_end_date is distinct from v_current_discount.end_date) OR
        (p_is_active is distinct from v_current_discount.is_active) then

    update discounts set product_id = p_product_id, category_id = p_category_id, brand_id = p_brand_id, product_type_id = p_product_type_id,
    discount_percentage = p_discount_percentage, start_date = p_start_date, end_date = p_end_date, is_active = p_is_active,
    updated_at = current_timestamp where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_discount(
    p_id int
) as $$
declare
    v_discount_id int;
begin
    select id into v_discount_id from discounts where deleted = 0 and id = p_id;
    if v_discount_id is null then
        raise exception 'Discount not found' using errcode = 'DNF00';
    end if;

    update discounts set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



create or replace function get_discount_by_id(
    p_id int
) returns table (
    id INT,
    discount_percentage INT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN,
    brand_id INT,
    brand_name varchar,
    category_id INT,
    category_name varchar,
    product_id INT,
    product_name varchar,
    product_type_id INT,
    product_type_name varchar,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted INT,
    deleted_at TIMESTAMP WITH TIME ZONE
)
as $$
declare
    v_discount_id int;
begin
    select d.id into v_discount_id from discounts d where d.deleted = 0 and d.id = p_id;
    if v_discount_id is null then
        raise exception 'Discount not found' using errcode = 'DNF00';
    end if;

    return query
    SELECT 
            d.id,
            d.discount_percentage,
            d.start_date,
            d.end_date,
            d.is_active,
            b.id AS brand_id,
            b.name AS brand_name,
            c.id AS category_id,
            c.name AS category_name,
            p.id AS product_id,
            p.name AS product_name,
            pt.id AS product_type_id,
            pt.name AS product_type_name,
            d.created_at,
            d.updated_at,
            d.deleted,
            d.deleted_at
        FROM 
            discounts as d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN categories c ON d.category_id = c.id
        LEFT JOIN product_types pt ON d.product_type_id = pt.id
        LEFT JOIN products p ON d.product_id = p.id
        WHERE d.id = p_id and d.deleted = 0;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION get_discounts(
    p_is_active BOOLEAN,
    p_sort_by VARCHAR,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE,
    p_start_percentage INT,
    p_end_percentage INT,
    p_is_product BOOLEAN,
    p_is_category BOOLEAN,
    p_is_brand BOOLEAN,
    p_is_product_type BOOLEAN,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    discount_percentage INT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN,
    brand_id INT,
    brand_name varchar,
    category_id INT,
    category_name varchar,
    product_id INT,
    product_name varchar,
    product_type_id INT,
    product_type_name varchar,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted INT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    page_count INT
) AS $$
DECLARE
    v_page_count INT;
    v_total_count INT;
    sort_column VARCHAR;
    sort_order VARCHAR;
    v_has_type_check BOOLEAN DEFAULT FALSE;
BEGIN
    IF p_is_product OR p_is_category OR p_is_brand OR p_is_product_type THEN
        v_has_type_check := TRUE;
    END IF;

    SELECT COUNT(*)::INT INTO v_total_count
    FROM discounts as d
    WHERE d.deleted = 0
      AND (p_is_active IS NULL OR 
            (p_is_active = TRUE AND d.is_active = TRUE AND d.start_date <= current_timestamp AND d.end_date >= current_timestamp) OR 
            (p_is_active = FALSE AND (d.is_active = FALSE OR d.start_date > current_timestamp OR d.end_date < current_timestamp))
      )
      AND (p_start_date IS NULL OR d.start_date >= p_start_date)
      AND (p_end_date IS NULL OR d.end_date <= p_end_date)
      AND (d.discount_percentage >= p_start_percentage AND d.discount_percentage <= p_end_percentage)
      AND (v_has_type_check = FALSE OR
          (p_is_product = TRUE AND d.product_id IS NOT NULL) OR
          (p_is_category = TRUE AND d.category_id IS NOT NULL) OR
          (p_is_brand = TRUE AND d.brand_id IS NOT NULL) OR
          (p_is_product_type = TRUE AND d.product_type_id IS NOT NULL));

    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by IN ('percentageASC', 'percentageDESC') THEN 'd.discount_percentage'
        WHEN p_sort_by IN ('newest', 'oldest') THEN 'd.created_at'
        ELSE 'd.discount_percentage'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'percentageASC' THEN 'ASC'
        WHEN p_sort_by = 'percentageDESC' THEN 'DESC'
        WHEN p_sort_by = 'newest' THEN 'DESC'
        WHEN p_sort_by = 'oldest' THEN 'ASC'
        ELSE 'ASC'
    END;

    RETURN QUERY EXECUTE format('
        SELECT 
            d.id,
            d.discount_percentage,
            d.start_date,
            d.end_date,
            d.is_active,
            b.id AS brand_id,
            b.name AS brand_name,
            c.id AS category_id,
            c.name AS category_name,
            p.id AS product_id,
            p.name AS product_name,
            pt.id AS product_type_id,
            pt.name AS product_type_name,
            d.created_at,
            d.updated_at,
            d.deleted,
            d.deleted_at,
            %L::INT AS page_count
        FROM 
            discounts as d
        LEFT JOIN brands b ON d.brand_id = b.id
        LEFT JOIN categories c ON d.category_id = c.id
        LEFT JOIN product_types pt ON d.product_type_id = pt.id
        LEFT JOIN products p ON d.product_id = p.id
        WHERE 
            d.deleted = 0 AND
            (%L IS NULL OR 
                (%L = TRUE AND d.is_active = TRUE AND d.start_date <= current_timestamp AND d.end_date >= current_timestamp) OR 
                (%L = FALSE AND (d.is_active = FALSE OR d.start_date > current_timestamp OR d.end_date < current_timestamp))
            ) AND
            (%L IS NULL OR d.start_date >= %L) AND
            (%L IS NULL OR d.end_date <= %L) AND
            (d.discount_percentage >= %L AND d.discount_percentage <= %L) AND
            (%L = FALSE OR 
                (%L = TRUE AND d.product_id IS NOT NULL) OR
                (%L = TRUE AND d.category_id IS NOT NULL) OR
                (%L = TRUE AND d.brand_id IS NOT NULL) OR
                (%L = TRUE AND d.product_type_id IS NOT NULL))
        ORDER BY 
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_is_active,
        p_is_active,
        p_is_active,
        p_start_date,
        p_start_date,
        p_end_date,
        p_end_date,
        p_start_percentage,
        p_end_percentage,
        v_has_type_check,
        p_is_product,
        p_is_category,
        p_is_brand,
        p_is_product_type,
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;