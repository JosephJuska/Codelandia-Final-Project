CREATE OR REPLACE FUNCTION get_products(
  p_search_term VARCHAR,
  p_sort_by VARCHAR,
  p_is_active BOOLEAN,
  p_category_id INT,
  p_brand_id INT,
  p_has_discount BOOLEAN,
  p_start_price DECIMAL,
  p_end_price DECIMAL,
  p_limit INT,
  p_offset INT
)
RETURNS TABLE (
  product_id INT,
  product_name VARCHAR,
  product_description VARCHAR,
  product_sku INT,
  product_slug VARCHAR,
  product_base_price DECIMAL,
  product_rating INT,
  product_created_at TIMESTAMP WITH TIME ZONE,
  product_updated_at TIMESTAMP WITH TIME ZONE,
  brand_id INT,
  brand_name VARCHAR,
  category_id INT,
  category_name VARCHAR,
  category_slug VARCHAR,
  category_product_type_id INT,
  product_items JSON,
  product_fields JSON,
  discount_id INT,
  discount_percentage INT,
  discount_start_date TIMESTAMP WITH TIME ZONE,
  discount_end_date TIMESTAMP WITH TIME ZONE,
  page_count INT
) 
AS $$
DECLARE
  v_total_count INT;
  sort_column VARCHAR := 'p.created_at';
  sort_order VARCHAR := 'DESC';
  v_category_ids INT[];
BEGIN
  IF p_sort_by = 'nameASC' THEN
    sort_column := 'p.name'; sort_order := 'ASC';
  ELSIF p_sort_by = 'nameDESC' THEN
    sort_column := 'p.name'; sort_order := 'DESC';
  ELSIF p_sort_by = 'priceASC' THEN
    sort_column := 'COALESCE(pd.discount_price, p.base_price)'; sort_order := 'ASC';
  ELSIF p_sort_by = 'priceDESC' THEN
    sort_column := 'COALESCE(pd.discount_price, p.base_price)'; sort_order := 'DESC';
  ELSIF p_sort_by = 'newest' THEN
    sort_column := 'p.created_at'; sort_order := 'DESC';
  ELSIF p_sort_by = 'oldest' THEN
    sort_column := 'p.created_at'; sort_order := 'ASC';
  END IF;

  WITH RECURSIVE category_tree AS (
    SELECT c.id
    FROM categories c
    WHERE c.id = p_category_id AND c.deleted = 0
    UNION ALL
    SELECT c2.id
    FROM categories c2
    INNER JOIN category_tree ct ON ct.id = c2.parent_id
    WHERE c2.deleted = 0
  )
  SELECT array_agg(id) INTO v_category_ids FROM category_tree;

  SELECT COUNT(*) INTO v_total_count
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN LATERAL (
    SELECT d.id AS discount_id, d.discount_percentage,
           GREATEST(p.base_price - (p.base_price * d.discount_percentage / 100), 0) AS discount_price,
           d.start_date, d.end_date
    FROM discounts d
    WHERE d.is_active = TRUE AND d.deleted = 0
      AND d.start_date <= NOW() AND d.end_date >= NOW()
    ORDER BY d.discount_percentage DESC
    LIMIT 1
  ) pd ON TRUE
  WHERE p.deleted = 0
    AND (p_is_active IS NULL OR p.is_active = p_is_active)
    AND (p_search_term IS NULL OR p.name ILIKE '%' || p_search_term || '%' OR p.sku::TEXT ILIKE '%' || p_search_term || '%')
    AND (p_category_id IS NULL OR p.category_id = ANY(v_category_ids))
    AND (p_brand_id IS NULL OR p.brand_id = p_brand_id)
    AND (p_has_discount IS NULL OR (pd.discount_id IS NOT NULL) = p_has_discount)
    AND (p_start_price IS NULL OR COALESCE(pd.discount_price, p.base_price) >= p_start_price)
    AND (p_end_price IS NULL OR COALESCE(pd.discount_price, p.base_price) <= p_end_price);

  RETURN QUERY
  SELECT p.id AS product_id,
         p.name AS product_name,
         p.description AS product_description,
         p.sku AS product_sku,
         p.slug AS product_slug,
         p.base_price AS product_base_price,
         p.rating AS product_rating,
         p.created_at AS product_created_at,
         p.updated_at AS product_updated_at,
         b.id AS brand_id,
         b.name AS brand_name,
         c.id AS category_id,
         c.name AS category_name,
         c.slug AS category_slug,
         c.product_type_id AS category_product_type_id,
         (SELECT json_agg(json_build_object(
             'item_id', pi.id,
             'stock', pi.stock,
             'image_paths', pi.image_paths,
             'colour_1', (SELECT colour_1 FROM colours WHERE id = pi.colour_id),
             'colour_2', (SELECT colour_2 FROM colours WHERE id = pi.colour_id),
             'colour_3', (SELECT colour_3 FROM colours WHERE id = pi.colour_id),
             'created_at', pi.created_at,
             'updated_at', pi.updated_at
         )) FROM product_items pi WHERE pi.product_id = p.id AND pi.deleted = 0) AS product_items,
         (SELECT json_agg(json_build_object(
             'field_id', pf.id,
             'field_name', ptf.name,
             'field_value', pf.value
         )) FROM product_fields pf
          JOIN product_type_fields ptf ON pf.product_type_field_id = ptf.id
          WHERE pf.product_id = p.id AND pf.deleted = 0) AS product_fields,
         pd.discount_id,
         pd.discount_percentage,
         pd.start_date AS discount_start_date,
         pd.end_date AS discount_end_date,
         CEIL(v_total_count::DECIMAL / p_limit)::INT AS page_count
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN LATERAL (
        SELECT d.id AS discount_id,
            d.discount_percentage,
            GREATEST(p.base_price - (p.base_price * d.discount_percentage / 100), 0) AS discount_price,
            d.start_date,
            d.end_date
        FROM discounts d
        WHERE d.is_active = TRUE 
        AND d.deleted = 0
        AND d.start_date <= NOW() 
        AND d.end_date >= NOW()
        AND (
            d.product_id = p.id OR                  -- Product-specific discount
            d.product_type_id = c.product_type_id OR -- Product-type discount
            d.category_id = c.id OR                  -- Category discount
            d.brand_id = b.id                        -- Brand discount
        )
        ORDER BY d.discount_percentage DESC
        LIMIT 1
    ) pd ON TRUE

  WHERE p.deleted = 0
    AND (p_is_active IS NULL OR p.is_active = p_is_active)
    AND (p_search_term IS NULL OR p.name ILIKE '%' || p_search_term || '%' OR p.sku::TEXT ILIKE '%' || p_search_term || '%')
    AND (p_category_id IS NULL OR p.category_id = ANY(v_category_ids))
    AND (p_brand_id IS NULL OR p.brand_id = p_brand_id)
    AND (p_has_discount IS NULL OR (pd.discount_id IS NOT NULL) = p_has_discount)
    AND (p_start_price IS NULL OR COALESCE(pd.discount_price, p.base_price) >= p_start_price)
    AND (p_end_price IS NULL OR COALESCE(pd.discount_price, p.base_price) <= p_end_price)
  ORDER BY sort_column || ' ' || sort_order
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_product_by_id(
  p_id INT,
  p_is_active BOOLEAN
)
RETURNS TABLE (
  product_id INT,
  product_name VARCHAR,
  product_description VARCHAR,
  product_sku INT,
  product_slug VARCHAR,
  product_base_price DECIMAL,
  product_rating INT,
  product_is_active BOOLEAN,
  product_created_at TIMESTAMP WITH TIME ZONE,
  product_updated_at TIMESTAMP WITH TIME ZONE,
  brand_id INT,
  brand_name VARCHAR,
  category_id INT,
  category_name VARCHAR,
  category_slug VARCHAR,
  category_product_type_id INT,
  product_items JSON,
  product_fields JSON,
  discount_id INT,
  discount_percentage INT,
  discount_start_date TIMESTAMP WITH TIME ZONE,
  discount_end_date TIMESTAMP WITH TIME ZONE
) 
AS $$
DECLARE
    v_product_id int;
BEGIN
  select p.id into v_product_id from products p where p.deleted = 0 and (p_is_active is null or p.is_active is TRUE) and p.id = p_id;
  if v_product_id is null then
    raise exception 'Product not found' using errcode = 'PNF00';
  end if;

  RETURN QUERY
  WITH product_discount AS (
    SELECT d.id AS discount_id, d.discount_percentage, d.start_date, d.end_date
    FROM discounts d
    LEFT JOIN products p ON d.product_id = p.id
    LEFT JOIN categories c ON d.category_id = c.id
    LEFT JOIN brands b ON d.brand_id = b.id
    LEFT JOIN product_types pt ON d.product_type_id = pt.id
    WHERE (d.product_id = p_id OR c.id = (SELECT p.category_id FROM products as p WHERE p.id = p_id)
           OR b.id = (SELECT p.brand_id FROM products as p WHERE p.id = p_id)
           OR pt.id = (SELECT product_type_id FROM categories WHERE id = (SELECT p.category_id FROM products as p WHERE p.id = p_id)))
      AND d.is_active = TRUE
      AND d.deleted = 0
      AND d.start_date <= NOW()
      AND d.end_date >= NOW()
    ORDER BY d.discount_percentage DESC
    LIMIT 1
  ),
  product_fields_json AS (
    SELECT json_agg(json_build_object(
      'field_id', pf.id,
      'field_name', ptf.name,
      'field_type_id', ft.id,
      'field_value', pf.value,
      'product_type_field_id', ptf.id,
      'field_created_at', pf.created_at,
      'field_updated_at', pf.updated_at
    )) AS product_fields
    FROM product_fields pf
    JOIN product_type_fields ptf ON pf.product_type_field_id = ptf.id
    JOIN field_types ft ON ptf.field_type_id = ft.id
    WHERE pf.product_id = p_id AND pf.deleted = 0
  ),
  product_items_json AS (
    SELECT json_agg(json_build_object(
      'item_id', pi.id,
      'colour_1', (SELECT colour_1 FROM colours WHERE id = pi.colour_id),
      'colour_2', (SELECT colour_2 FROM colours WHERE id = pi.colour_id),
      'colour_3', (SELECT colour_3 FROM colours WHERE id = pi.colour_id),
      'stock', pi.stock,
      'image_paths', pi.image_paths,
      'created_at', pi.created_at,
      'updated_at', pi.updated_at,
      'variations', (SELECT json_agg(json_build_object(
        'variation_id', pv.id,
        'variation_name', pv.name,
        'variation_price', pv.base_price,
        'variation_stock', pv.stock,
        'variation_created_at', pv.created_at,
        'variation_updated_at', pv.updated_at,
        'variation_fields', (SELECT json_agg(json_build_object(
          'field_id', pvf.id,
          'field_type_id', ft.id,
          'field_type', ft.name,
          'field_value', pvf.value,
          'product_type_field_id', ptf.id,
          'field_created_at', pvf.created_at,
          'field_updated_at', pvf.updated_at
        )) 
        FROM product_variation_fields pvf
        JOIN product_type_fields ptf ON pvf.product_type_field_id = ptf.id
        JOIN field_types ft ON ptf.field_type_id = ft.id
        WHERE pvf.product_variation_id = pv.id AND pvf.deleted = 0)
      )) 
      FROM product_variations pv WHERE pv.product_item_id = pi.id AND pv.deleted = 0)
    )) AS product_items
    FROM product_items pi
    WHERE pi.product_id = p_id AND pi.deleted = 0
  )

  SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_description,
    p.sku AS product_sku,
    p.slug AS product_slug,
    p.base_price AS product_base_price,
    p.rating AS product_rating,
    p.is_active AS product_is_active,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    b.id AS brand_id,
    b.name AS brand_name,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    c.product_type_id AS category_product_type_id,
    (SELECT pij.product_items FROM product_items_json as pij) AS product_items,
    (SELECT pfj.product_fields FROM product_fields_json as pfj) AS product_fields,
    pd.discount_id,
    pd.discount_percentage,
    pd.start_date AS discount_start_date,
    pd.end_date AS discount_end_date
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_discount pd ON TRUE
  WHERE p.id = p_id
  AND p.deleted = 0
  AND (p_is_active is null or p.is_active is TRUE);
END;
$$ LANGUAGE plpgsql;



create or replace function create_product(
    p_name varchar,
    p_description varchar,
    p_sku int,
    p_slug varchar,
    p_brand_id int,
    p_category_id int,
    p_base_price decimal,
    p_fields jsonb
) 
returns int
as $$
declare
    v_product_id int;
    v_brand_id int;
begin
    select id into v_brand_id from brands where id = p_brand_id;
    if v_brand_id is null then
        raise exception 'Brand not found' using errcode = 'BNF00';
    end if;

    select id into v_product_id from products where deleted = 0 and (name = p_name or slug = p_slug);
    if v_product_id is not null then
        raise exception 'Product with name % already exists', p_name using errcode = 'PAE01';
    end if;

    v_product_id := null;

    select id into v_product_id from products where deleted = 0 and sku = p_sku;
    if v_product_id is not null then
        raise exception 'Product with sku % already exists', p_sku using errcode = 'PAE02';
    end if;

    insert into products (name, description, sku, slug, brand_id, category_id, base_price) values
    (p_name, p_description, p_sku, p_slug, p_brand_id, p_category_id, p_base_price) returning id into v_product_id;

    INSERT INTO product_fields (product_id, product_type_field_id, value)
    SELECT
        v_product_id,
        (field->>'productTypeFieldID')::INT,
        field->>'value'
    FROM jsonb_array_elements(p_fields) AS field;

    return v_product_id;
end;
$$ language plpgsql;



create or replace procedure update_product(
    p_id int,
    p_name varchar,
    p_description varchar,
    p_sku int,
    p_slug varchar,
    p_brand_id int,
    p_category_id int,
    p_base_price decimal,
    p_is_active bool,
    p_fields jsonb
) as $$
declare
    v_product_id int;
    v_product_type_id int;
    v_category_product_type_id int;
    v_brand_id int;
    v_product_variation_count int;
    v_product_item_count int;
    v_product_type_updated bool default false;
    v_field_id int;
    v_existing_value varchar;
    v_existing_field_type int;
    field_record jsonb;
    v_current_product record;
    v_fields_changed bool default false;
    v_product_changed bool default false;
begin
    select id into v_brand_id from brands where id = p_brand_id;
    if v_brand_id is null then
        raise exception 'Brand not found' using errcode = 'BNF00';
    end if;

    select * into v_current_product from products where deleted = 0 and id = p_id;
    if v_current_product is null then
        raise exception 'Product not found' using errcode = 'PNF00';
    end if;

    select id into v_product_id from products where deleted = 0 and (name = p_name or slug = p_slug) and id <> p_id;
    if v_product_id is not null then
        raise exception 'Product with name % already exists', p_name using errcode = 'PAE01';
    end if;

    select id into v_product_id from products where deleted = 0 and sku = p_sku and id <> p_id;
    if v_product_id is not null then
        raise exception 'Product with sku % already exists', p_sku using errcode = 'PAE02';
    end if;

    select c.product_type_id into v_product_type_id from categories as c join products as p on p.category_id = c.id where p.id = p_id;
    select product_type_id into v_category_product_type_id from categories where id = p_category_id;
    if v_product_type_id <> v_category_product_type_id then
        SELECT COUNT(*) INTO v_product_variation_count FROM product_variations pv JOIN product_items pi ON pv.product_item_id = pi.id and pi.deleted = 0
        WHERE pi.product_id = p_id AND pv.deleted = 0;
        if v_product_variation_count > 0 then
            raise exception 'Product type cannot be updated because product has % of variants', v_product_variation_count using errcode = 'PU001';
        end if;

        update product_fields set deleted = id, deleted_at = current_timestamp where product_id = p_id and deleted = 0;
        v_product_type_updated := true;
    end if;

    select count(*) into v_product_item_count from product_items where product_id = p_id and deleted = 0;
    if v_product_item_count = 0 and p_is_active is true then
        raise exception 'Product cannot be activated without any product items' using errcode = 'PU002';
    end if;

    IF v_product_type_updated IS TRUE THEN
        INSERT INTO product_fields (product_id, product_type_field_id, value)
        SELECT
            p_id,
            (field->>'productTypeFieldID')::INT,
            field->>'value'
        FROM jsonb_array_elements(p_fields) AS field;
        v_fields_changed := true;
    ELSE
        FOR field_record IN SELECT * FROM jsonb_array_elements(p_fields) LOOP
            SELECT id, value, product_type_field_id INTO v_field_id, v_existing_value, v_existing_field_type
            FROM product_fields
            WHERE product_id = p_id 
              AND product_type_field_id = (field_record->>'productTypeFieldID')::INT 
              AND deleted = 0;

            IF v_field_id IS NOT NULL THEN
                IF v_existing_value IS DISTINCT FROM (field_record->>'value') OR 
                   v_existing_field_type IS DISTINCT FROM (field_record->>'productTypeFieldID')::INT THEN
                    UPDATE product_fields
                    SET value = field_record->>'value',
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = v_field_id;
                    v_fields_changed := true;
                END IF;
            ELSE
                INSERT INTO product_fields (product_id, product_type_field_id, value)
                VALUES (p_id, (field_record->>'productTypeFieldID')::INT, field_record->>'value');
                v_fields_changed := true;
            END IF;
        END LOOP;
    END IF;

    IF p_name IS DISTINCT FROM v_current_product.name OR
       p_description IS DISTINCT FROM v_current_product.description OR
       p_sku IS DISTINCT FROM v_current_product.sku OR
       p_slug IS DISTINCT FROM v_current_product.slug OR
       p_brand_id IS DISTINCT FROM v_current_product.brand_id OR
       p_category_id IS DISTINCT FROM v_current_product.category_id OR
       p_base_price IS DISTINCT FROM v_current_product.base_price OR
       p_is_active IS DISTINCT FROM v_current_product.is_active THEN
        v_product_changed := true;
    END IF;

    IF v_product_changed OR v_fields_changed THEN
        update products 
        set name = p_name,
            description = p_description,
            sku = p_sku,
            slug = p_slug,
            brand_id = p_brand_id,
            category_id = p_category_id,
            base_price = p_base_price,
            is_active = p_is_active,
            updated_at = current_timestamp
        where id = p_id;
    END IF;

end;
$$ language plpgsql;



create or replace procedure delete_product(
    p_id int
) as $$
declare
    v_product_id int;
    v_product_is_active bool;
begin
    select id, is_active into v_product_id, v_product_is_active from products where id = p_id and deleted = 0;
    if v_product_id is null then
        raise exception 'Product not found' using errcode = 'PNF00';
    end if;

    if v_product_is_active is true then
        raise exception 'Active product cannot be deleted' using errcode = 'PD001';
    end if;

    UPDATE product_fields
    SET deleted = id, deleted_at = CURRENT_TIMESTAMP
    WHERE product_id = p_id AND deleted = 0;

    UPDATE product_variations
    SET deleted = id, deleted_at = CURRENT_TIMESTAMP
    WHERE product_item_id IN (
        SELECT pi.id FROM product_items as pi
        WHERE pi.product_id = p_id AND pi.deleted = 0
    );

    UPDATE product_items
    SET deleted = id, deleted_at = CURRENT_TIMESTAMP
    WHERE product_id = p_id AND deleted = 0;

    UPDATE products
    SET deleted = id, deleted_at = CURRENT_TIMESTAMP
    WHERE id = p_id AND deleted = 0;
end;
$$ language plpgsql;



create or replace function create_product_item (
    p_product_id int,
    p_stock int,
    p_colour_1 varchar,
    p_colour_2 varchar,
    p_colour_3 varchar,
    p_image_paths varchar[]
) returns int
as $$
declare
    v_colour_id int;
    v_product_id int;
    v_product_item_id int;
begin
    select id into v_product_id from products where deleted = 0 and id = p_product_id;
    if v_product_id is null then
        raise exception 'Product not found' using errcode = 'PNF00';
    end if;

    select c.id into v_colour_id from colours as c join product_items as pi on pi.colour_id = c.id where
    c.colour_1 = p_colour_1 and 
    ((p_colour_2 is null and c.colour_2 is null) or (c.colour_2 = p_colour_2)) 
    and
    ((p_colour_3 is null and c.colour_3 is null) or (c.colour_3 = p_colour_3))
    and pi.deleted = 0 and pi.product_id = p_product_id;
    if v_colour_id is not null then
        raise exception 'Product with this/these colours already exists' using errcode = 'PIAE0';
    end if;

    insert into colours (colour_1, colour_2, colour_3) values (p_colour_1, p_colour_2, p_colour_3) returning id into v_colour_id;
    insert into product_items (product_id, stock, colour_id, image_paths) values (p_product_id, p_stock, v_colour_id, p_image_paths) returning id into v_product_item_id;
    
    return v_product_item_id;
end;
$$ language plpgsql;



create or replace procedure update_product_item (
    p_id int,
    p_stock int,
    p_colour_1 varchar,
    p_colour_2 varchar,
    p_colour_3 varchar,
    p_image_paths varchar[]
) as $$
declare
    v_colour_id int;
    v_product_item_colour_id int;
    v_product_item_id int;
    v_product_id int;
    v_stock int;
    v_image_paths varchar[];
    v_colour_1 varchar;
    v_colour_2 varchar;
    v_colour_3 varchar;
    v_stock_changed bool default false;
    v_image_paths_changed bool default false;
    v_colour_changed bool default false;
begin
    select id, colour_id, product_id, stock, image_paths 
    into v_product_item_id, v_product_item_colour_id, v_product_id, v_stock, v_image_paths
    from product_items where deleted = 0 and id = p_id;
    
    if v_product_item_id is null then
        raise exception 'Product item not found' using errcode = 'PINF0';
    end if;

    select c.id into v_colour_id
    from colours as c
    join product_items as pi on pi.colour_id = c.id
    where c.colour_1 = p_colour_1 and c.colour_2 = p_colour_2 and c.colour_3 = p_colour_3
      and pi.deleted = 0 and pi.product_id = v_product_id and pi.id <> p_id
      and c.id <> v_product_item_colour_id;
      
    if v_colour_id is not null then
        raise exception 'Product with this/these colours already exists' using errcode = 'PIAE0';
    end if;

    select colour_1, colour_2, colour_3 
    into v_colour_1, v_colour_2, v_colour_3 
    from colours where id = v_product_item_colour_id;

    if v_colour_1 is distinct from p_colour_1 or 
       v_colour_2 is distinct from p_colour_2 or 
       v_colour_3 is distinct from p_colour_3 then
        v_colour_changed := true;
    end if;

    if v_colour_changed then
        update colours
        set colour_1 = p_colour_1, colour_2 = p_colour_2, colour_3 = p_colour_3
        where id = v_product_item_colour_id;
    end if;

    if v_stock is distinct from p_stock then
        v_stock_changed := true;
    end if;

    if v_image_paths is distinct from p_image_paths then
        v_image_paths_changed := true;
    end if;

    if v_stock_changed or v_image_paths_changed or v_colour_changed then
        update product_items
        set stock = p_stock,
            image_paths = p_image_paths,
            updated_at = current_timestamp
        where id = p_id;
    end if;

end;
$$ language plpgsql;



create or replace procedure delete_product_item (
    p_id int
) as $$
declare
    v_product_item_id int;
    v_colour_id int;
    v_variation_count int;
    v_product_id int;
    v_is_active bool;
begin
    select id, colour_id, product_id into v_product_item_id, v_colour_id, v_product_id from product_items where deleted = 0 and id = p_id;
    if v_product_item_id is null then
        raise exception 'Product item not found' using errcode = 'PINF0';
    end if;

    select is_active into v_is_active from products where id = v_product_id;
    if v_is_active is true then
        raise exception 'Product item of an active product cannot be deleted' using errcode = 'PID02';
    end if;

    select count(*) into v_variation_count from product_variations where deleted = 0 and product_item_id = p_id;
    if v_variation_count > 0 then
        raise exception 'Product item cannot be deleted because it is connected to % of product variations', v_variation_count using errcode = 'PID01';
    end if;

    update colours set deleted = id, deleted_at = current_timestamp where id = v_colour_id;
    update product_items set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



create or replace function create_product_variation (
    p_name varchar,
    p_stock int,
    p_product_item_id int,
    p_base_price decimal
) returns int 
as $$ 
declare
    v_product_variation_id int;
    v_product_item_id int;
begin
    select id into v_product_item_id from product_items where deleted = 0 and id = p_product_item_id limit 1;
    if v_product_item_id is null then
        raise exception 'Product item not found' using errcode = 'PINF0';
    end if;

    select id into v_product_variation_id from product_variations where deleted = 0 and name = p_name and product_item_id = p_product_item_id limit 1;
    if v_product_variation_id is not null then
        raise exception 'Product variation with name % already exists', p_name using errcode = 'PVAE0';
    end if;

    insert into product_variations (name, stock, product_item_id, base_price) values (p_name, p_stock, p_product_item_id, p_base_price) returning id into v_product_variation_id;

    return v_product_variation_id;
end;
$$ language plpgsql;



create or replace procedure update_product_variation (
    p_id int,
    p_name varchar,
    p_stock int,
    p_base_price decimal
) as $$ 
declare
    v_product_variation_id int;
    v_product_item_id int;
    v_current_product_variation record;
begin
    select id, product_item_id into v_product_variation_id, v_product_item_id from product_variations where deleted = 0 and id = p_id limit 1;
    if v_product_variation_id is null then
        raise exception 'Product variation not found' using errcode = 'PVNF0';
    end if;

    v_product_variation_id := null;

    select id into v_product_variation_id from product_variations where deleted = 0 and name = p_name and product_item_id = v_product_item_id and id <> p_id limit 1;
    if v_product_variation_id is not null then
        raise exception 'Product variation with name % already exists', p_name using errcode = 'PVAE0';
    end if;

    select * into v_current_product_variation from product_variations where id = p_id;

    if (p_name is distinct from v_current_product_variation.name) or
        (p_stock is distinct from v_current_product_variation.stock) or
        (p_base_price is distinct from v_current_product_variation.base_price) then

    update product_variations set 
    name = p_name, 
    stock = p_stock, 
    base_price = p_base_price, 
    updated_at = current_timestamp 
    where id = p_id;
    
    end if;
end;
$$ language plpgsql;



create or replace procedure delete_product_variation(
    p_id int
) as $$ 
declare
    v_product_variation_id int;
    v_product_item_id int;
    v_is_active bool;
begin
    select id, product_item_id into v_product_variation_id, v_product_item_id from product_variations where deleted = 0 and id = p_id limit 1;
    if v_product_variation_id is null then
        raise exception 'Product variation not found' using errcode = 'PVNF0';
    end if;

    select p.is_active into v_is_active from products as p join product_items as pi on p.id = pi.product_id where p.deleted = 0 and pi.id = v_product_item_id and pi.deleted = 0 limit 1;
    if v_is_active is true then
        raise exception 'Product variation of an active product cannot be deleted' using errcode = 'PVD01';
    end if;

    update product_variations set deleted = id, deleted_at = current_timestamp where id = p_id;
    update product_variation_fields set deleted = id, deleted_at = current_timestamp where product_variation_id = p_id and deleted = 0;
end;
$$ language plpgsql;



create or replace function create_product_variation_field (
    p_value varchar,
    p_product_variation_id int,
    p_product_type_field_id int
) returns int
as $$
declare
    v_product_variation_id int;
    v_product_type_field_id int;
    v_product_variation_field_id int;
begin
    select id into v_product_variation_id from product_variations where deleted = 0 and id = p_product_variation_id;
    if v_product_variation_id is null then
        raise exception 'Product variation not found' using errcode = 'PVNF0';
    end if;

    select id into v_product_type_field_id from product_type_fields where deleted = 0 and id = p_product_type_field_id;
    if v_product_type_field_id is null then
        raise exception 'Product type field not found' using errcode = 'PTFNF';
    end if;

    v_product_type_field_id := null;

    SELECT ptf.id INTO v_product_type_field_id
    FROM product_type_fields ptf
    JOIN product_types pt ON ptf.product_type_id = pt.id
    JOIN categories c ON c.product_type_id = pt.id
    JOIN products p ON p.category_id = c.id
    JOIN product_items pi ON pi.product_id = p.id
    JOIN product_variations pv ON pv.product_item_id = pi.id
    WHERE ptf.id = p_product_type_field_id
      AND pv.id = p_product_variation_id
      AND ptf.deleted = 0
      AND pt.deleted = 0
      AND p.deleted = 0
      AND pi.deleted = 0
      AND pv.deleted = 0;

    IF v_product_type_field_id IS NULL THEN
        RAISE EXCEPTION 'Product type field is not associated with the product type of the product variation' USING ERRCODE = 'PVFC0';
    END IF;

    select id into v_product_variation_field_id from product_variation_fields where deleted = 0 and product_variation_id = p_product_variation_id and product_type_field_id = p_product_type_field_id;
    if v_product_variation_field_id is not null then
        raise exception 'Product variation field already exists' using errcode = 'PVFAE';
    end if;

    insert into product_variation_fields (value, product_type_field_id, product_variation_id) values 
    (p_value, p_product_type_field_id, p_product_variation_id) returning id into v_product_variation_field_id;

    return v_product_variation_field_id;
end;
$$ language plpgsql;



create or replace procedure update_product_variation_field(
    p_id int,
    p_value varchar,
    p_product_type_field_id int
) as $$
declare
    v_product_variation_field_id int;
    v_product_type_field_id int;
    v_product_variation_id int;
    v_current_product_variation_field record;
begin
    select id into v_product_variation_field_id from product_variation_fields where deleted = 0 and id = p_id;
    if v_product_variation_field_id is null then
        raise exception 'Product variation field not found' using errcode = 'PVFNF';
    end if;

    select product_variation_id into v_product_variation_id from product_variation_fields where deleted = 0 and id = p_id;

    select id into v_product_type_field_id from product_type_fields where deleted = 0 and id = p_product_type_field_id;
    if v_product_type_field_id is null then
        raise exception 'Product type field not found' using errcode = 'PTFNF';
    end if;

    v_product_type_field_id := null;

    WITH filtered_ptf AS (
    SELECT id, product_type_id 
    FROM product_type_fields 
    WHERE id = p_product_type_field_id AND deleted = 0
    ),
    filtered_pt AS (
        SELECT id
        FROM product_types 
        WHERE deleted = 0
    ),
    filtered_c AS (
        SELECT id, product_type_id
        FROM categories 
        WHERE deleted = 0
    ),
    filtered_p AS (
        SELECT id, category_id 
        FROM products 
        WHERE deleted = 0
    ),
    filtered_pi AS (
        SELECT id, product_id
        FROM product_items 
        WHERE deleted = 0
    ),
    filtered_pv AS (
        SELECT id, product_item_id
        FROM product_variations 
        WHERE deleted = 0
        and id = v_product_variation_id
    ),
    filtered_pvf AS (
        SELECT id, product_variation_id
        FROM product_variation_fields 
        WHERE id = p_id AND deleted = 0
    )
    SELECT ptf.id into v_product_type_field_id
    FROM filtered_ptf ptf
    JOIN filtered_pt pt ON ptf.product_type_id = pt.id
    JOIN filtered_c c ON c.product_type_id = pt.id
    JOIN filtered_p p ON p.category_id = c.id
    JOIN filtered_pi pi ON pi.product_id = p.id
    JOIN filtered_pv pv ON pv.product_item_id = pi.id
    JOIN filtered_pvf pvf ON pvf.product_variation_id = pv.id;

    IF v_product_type_field_id IS NULL THEN
        RAISE EXCEPTION 'Product type field is not associated with the product type of the product variation' USING ERRCODE = 'PVFC0';
    END IF;

    v_product_variation_field_id := null;

    select id into v_product_variation_field_id from product_variation_fields where deleted = 0 and product_variation_id = v_product_variation_id and product_type_field_id = p_product_type_field_id
    and id <> p_id;
    if v_product_variation_field_id is not null then
        raise exception 'Product variation field already exists' using errcode = 'PVFAE';
    end if;

    select * into v_current_product_variation_field from product_variation_fields where deleted = 0 and id = p_id;

    if (p_value is distinct from v_current_product_variation_field.value) or
        (p_product_type_field_id is distinct from v_current_product_variation_field.product_type_field_id) then

    update product_variation_fields set 
    value = p_value, 
    product_type_field_id = p_product_type_field_id, 
    updated_at = current_timestamp 
    where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_product_variation_field(
    p_id int
) as $$
declare
    v_product_variation_field_id int;
begin
    select id into v_product_variation_field_id from product_variation_fields where deleted = 0 and id = p_id;
    if v_product_variation_field_id is null then
        raise exception 'Product variation field not found' using errcode = 'PVFNF';
    end if;

    update product_variation_fields set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;