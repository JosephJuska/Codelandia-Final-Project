create or replace function create_favorite(
    p_user_id int,
    p_product_item_id int
) 
returns int
as $$
declare
    v_user_id int;
    v_product_item_id int;
    v_favorite_id int;
    v_id int;
begin
    select id into v_user_id from users where deleted = 0 and is_active = true and verified = true and id = p_user_id;
    if v_user_id is null then
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    select pi.id into v_product_item_id from product_items as pi join products as p on p.id = pi.product_id where p.deleted = 0 and p.is_active = true and pi.deleted = 0 and pi.id = p_product_item_id;
    if v_product_item_id is null then
        raise exception 'Product item not found' using errcode = 'PINF0';
    end if;

    select id into v_favorite_id from favorites where deleted = 0 and user_id = p_user_id and product_item_id = p_product_item_id;
    if v_favorite_id is not null then
        raise exception 'Favorite already exists' using errcode = 'FAE01';
    end if;

    insert into favorites (user_id, product_id) values (v_user_id, v_product_id) returning id into v_id;

    return v_id;   
end;
$$ language plpgsql;



create or replace procedure delete_favorite(
    p_id int,
    p_user_id int
) as $$
declare
    v_favorite_id int;
begin
    select id into v_favorite_id from favorites where deleted = 0 and user_id = p_user_id and id = p_id;
    if v_favorite_id is null then
        raise exception 'Favorite not found' using errcode = 'FNF00';
    end if;

    update favorites set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION get_favorites(
    p_user_id INT,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    user_id INT,
    product_item_id INT,
    product_item_image_path VARCHAR,
    product_name VARCHAR,
    base_price DECIMAL,
    discount DECIMAL,
    colours VARCHAR[],
    created_at TIMESTAMP with time zone,
    updated_at TIMESTAMP with time zone,
    deleted INT,
    deleted_at TIMESTAMP with time zone
) AS $$
BEGIN
    RETURN QUERY
    WITH product_details AS (
        SELECT
            f.id AS favorite_id,
            f.user_id,
            f.product_item_id,
            pi.image_paths[1] AS product_item_image_path,
            p.name AS product_name,
            p.base_price,
            p.category_id,
            p.brand_id,
            p.product_type_id,
            pi.colour_id,
            COALESCE(MAX(d.discount_percentage), 0) AS discount
        FROM 
            favorites f
        JOIN 
            product_items pi ON f.product_item_id = pi.id
        JOIN 
            products p ON pi.product_id = p.id
        LEFT JOIN 
            discounts d ON (
                p.id = d.product_id
                OR p.brand_id = d.brand_id
                OR p.category_id = d.category_id
                OR p.product_type_id = d.product_type_id
                OR EXISTS (
                    SELECT 1
                    FROM categories c
                    WHERE c.id = p.category_id
                    AND c.parent_id IS NOT NULL
                    AND c.id = d.category_id
                )
            )
            AND d.is_active = TRUE
            AND CURRENT_DATE BETWEEN d.start_date AND d.end_date
        WHERE 
            f.user_id = p_user_id
            AND f.deleted = 0
        GROUP BY 
            f.id, f.user_id, f.product_item_id, pi.image_paths, p.name, p.base_price, p.category_id, p.brand_id, p.product_type_id, pi.colour_id
    ), color_details AS (
        SELECT
            pi.id AS product_item_id,
            ARRAY_AGG(c.colour_1 || COALESCE(c.colour_2, '') || COALESCE(c.colour_3, '')) AS colours
        FROM 
            product_items pi
        JOIN
            colours c ON pi.colour_id = c.id
        GROUP BY
            pi.id
    )
    SELECT
        pd.favorite_id AS id,
        pd.user_id,
        pd.product_item_id,
        pd.product_item_image_path,
        pd.product_name,
        pd.base_price,
        pd.discount,
        COALESCE(cd.colours, '{}') AS colours,
        f.created_at,
        f.updated_at,
        f.deleted,
        f.deleted_at
    FROM
        product_details pd
    LEFT JOIN
        color_details cd ON pd.product_item_id = cd.product_item_id
    JOIN
        favorites f ON pd.favorite_id = f.id
    ORDER BY 
        f.created_at DESC
    LIMIT 
        p_limit
    OFFSET 
        p_offset;
END;
$$ LANGUAGE plpgsql;