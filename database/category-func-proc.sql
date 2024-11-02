CREATE
OR REPLACE FUNCTION CREATE_CATEGORY (
	P_NAME VARCHAR,
	P_SLUG VARCHAR,
	P_PARENT_ID INT,
	P_PRODUCT_TYPE_ID INT,
	P_IMAGE_PATH VARCHAR
) 
RETURNS INT
AS $$
DECLARE
    v_parent_id INT;
    v_product_type_id INT;
    v_category_id INT;
    v_id int;
BEGIN
    IF p_parent_id IS NOT NULL THEN
        SELECT id, product_type_id INTO v_parent_id, v_product_type_id 
        FROM categories 
        WHERE id = p_parent_id AND deleted = 0 
        LIMIT 1;
        
        IF v_parent_id IS NULL THEN
            RAISE EXCEPTION 'Parent category not found' USING errcode = 'CNF10';
        END IF;

        IF v_product_type_id IS NOT NULL THEN
            if p_product_type_id is not null and p_product_type_id <> v_product_type_id then
				raise exception 'Product type does not match with parent category' using errcode = 'PTM00';
			end if;

			p_product_type_id := v_product_type_id;
        END IF;
    END IF;

	v_product_type_id := null;

    IF p_product_type_id IS NOT NULL THEN
        SELECT id INTO v_product_type_id 
        FROM product_types 
        WHERE id = p_product_type_id AND deleted = 0 
        LIMIT 1;

        IF v_product_type_id IS NULL THEN
            RAISE EXCEPTION 'Product type not found' USING errcode = 'PTNF0';
        END IF;
    END IF;

    SELECT id INTO v_category_id
	FROM categories 
    WHERE deleted = 0 and (name = p_name OR slug = p_slug);

    IF v_category_id is not null THEN
        RAISE EXCEPTION 'Category with name % and/or slug % already exists', p_name, p_slug USING errcode = 'CAE01';
    END IF;

    INSERT INTO categories (name, slug, parent_id, product_type_id, image_path) 
    VALUES (p_name, p_slug, p_parent_id, p_product_type_id, p_image_path)
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE DELETE_CATEGORY (P_ID INT) AS $$
DECLARE
    v_category_id INT;
    v_parent_count INT;
    v_product_count INT;
BEGIN
    SELECT id INTO v_category_id
    FROM categories 
    WHERE id = p_id AND deleted = 0 
    LIMIT 1;

    IF v_category_id IS NULL THEN
        RAISE EXCEPTION 'Category not found' USING errcode = 'CNF00';
    END IF;

    WITH RECURSIVE child_categories AS (
        SELECT id 
        FROM categories 
        WHERE parent_id = p_id AND deleted = 0
        UNION ALL
        SELECT c.id 
        FROM categories c
        INNER JOIN child_categories cc ON cc.id = c.parent_id
        WHERE c.deleted = 0
    ) SELECT COUNT(*) INTO v_parent_count FROM child_categories;

    IF v_parent_count > 0 THEN
        RAISE EXCEPTION 'Category cannot be deleted because it is a parent of % categories', v_parent_count USING errcode = 'CD001';
    END IF;

	WITH RECURSIVE child_categories AS (
        SELECT id 
        FROM categories 
        WHERE parent_id = p_id AND deleted = 0
        UNION ALL
        SELECT c.id 
        FROM categories c
        INNER JOIN child_categories cc ON cc.id = c.parent_id
        WHERE c.deleted = 0
    ),	products_linked_to_category AS (
        SELECT p.id 
        FROM products p
        WHERE p.category_id = p_id AND p.deleted = 0
        UNION ALL
        SELECT p.id 
        FROM products p
        INNER JOIN child_categories cc ON cc.id = p.category_id
        WHERE p.deleted = 0
    ) SELECT COUNT(*) INTO v_product_count FROM products_linked_to_category;

    IF v_product_count > 0 THEN
        RAISE EXCEPTION 'Category cannot be deleted because it is associated with % products', v_product_count USING errcode = 'CD002';
    END IF;

    UPDATE categories 
    SET deleted = id, deleted_at = CURRENT_TIMESTAMP 
    WHERE id = p_id;
END;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE UPDATE_CATEGORY (
	P_ID INT,
	P_NAME VARCHAR,
	P_SLUG VARCHAR,
	P_PARENT_ID INT,
	P_PRODUCT_TYPE_ID INT,
	P_IMAGE_PATH VARCHAR
) AS $$
DECLARE
    v_category_id INT;
    v_parent_id INT;
    v_prev_product_type_id INT;
    v_parent_product_type_id INT;
    v_child_product_type_exists INT;
    v_product_type_exists INT;
    v_product_type_count INT;
    v_child_count INT;
    v_product_count INT;
BEGIN
    SELECT id, product_type_id INTO v_category_id, v_prev_product_type_id
    FROM categories
    WHERE id = p_id AND deleted = 0 limit 1;

    IF v_category_id IS NULL THEN
        RAISE EXCEPTION 'Category not found' USING errcode = 'CNF00';
    END IF;

    SELECT id INTO v_category_id
    FROM categories
    WHERE (name = p_name OR slug = p_slug) AND deleted = 0 AND id <> p_id limit 1;

    IF v_category_id IS NOT NULL THEN
        RAISE EXCEPTION 'Category with name % and/or slug % already exists', p_name, p_slug USING errcode = 'CAE01';
    END IF;

    IF p_parent_id IS NOT NULL THEN
        SELECT id, product_type_id INTO v_parent_id, v_parent_product_type_id
        FROM categories
        WHERE id = p_parent_id AND deleted = 0 limit 1;

        IF p_parent_id = p_id then
            raise exception 'Category cannot be set as its own parent' using errcode = 'CAS00';
        end if;

        IF v_parent_id IS NULL THEN
            RAISE EXCEPTION 'Parent category not found' USING errcode = 'CNF10';
        END IF;

        IF p_product_type_id IS NOT NULL AND v_parent_product_type_id IS NOT NULL THEN
            IF p_product_type_id <> v_parent_product_type_id THEN
                RAISE EXCEPTION 'Product type does not match with parent category' USING errcode = 'PTM01';
            END IF;
        END IF;
    END IF;

    IF p_product_type_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_product_type_count
        FROM product_types
        WHERE id = p_product_type_id AND deleted = 0;

        IF v_product_type_count = 0 THEN
            RAISE EXCEPTION 'Product type not found' USING errcode = 'PTNF0';
        END IF;
    END IF;

    WITH RECURSIVE child_categories AS (
        SELECT id, product_type_id
        FROM categories
        WHERE id = p_id AND deleted = 0
        UNION ALL
        SELECT c.id, c.product_type_id
        FROM categories c
        INNER JOIN child_categories cc ON cc.id = c.parent_id
        WHERE c.deleted = 0
    )
    SELECT COUNT(*) INTO v_child_count
    FROM child_categories;

    SELECT COUNT(*) INTO v_product_count
    FROM products
    WHERE category_id = p_id AND deleted = 0;

    IF v_child_count > 0 THEN
        IF p_product_type_id IS NOT NULL THEN
            WITH RECURSIVE child_categories AS (
                SELECT id, product_type_id
                FROM categories
                WHERE id = p_id AND deleted = 0
                UNION ALL
                SELECT c.id, c.product_type_id
                FROM categories c
                INNER JOIN child_categories cc ON cc.id = c.parent_id
                WHERE c.deleted = 0
            )
            SELECT COUNT(DISTINCT product_type_id) INTO v_child_product_type_exists
            FROM child_categories
            WHERE product_type_id IS NOT NULL;

            IF v_child_product_type_exists > 1 THEN
                RAISE EXCEPTION 'Category must have the same product type as its children or have no product type' USING errcode = 'CU001';
            END IF;
        END IF;
    END IF;

    IF p_product_type_id IS NULL AND v_product_count > 0 THEN
        RAISE EXCEPTION 'Product type cannot be removed if category has products' USING errcode = 'CU002';
    END IF;

    UPDATE categories
    SET
        name = p_name,
        slug = p_slug,
        parent_id = p_parent_id,
        product_type_id = p_product_type_id,
		image_path = coalesce(p_image_path, image_path),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;

END;
$$ LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION GET_ALL_CATEGORIES_HIERARCHY() RETURNS TABLE (
    ID INT,
    NAME VARCHAR,
    SLUG VARCHAR,
    PARENT_ID INT,
    PARENT_NAME VARCHAR,
    PRODUCT_TYPE_ID INT,
    PRODUCT_TYPE_NAME VARCHAR,
    IMAGE_PATH VARCHAR,
    CREATED_AT TIMESTAMP WITH TIME ZONE,
    UPDATED_AT TIMESTAMP WITH TIME ZONE,
    LEVEL INT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE category_tree AS (
        SELECT 
            c.id, 
            c.name, 
            c.slug, 
            c.parent_id, 
            c.product_type_id, 
            c.image_path, 
            c.created_at, 
            c.updated_at, 
            c.deleted, 
            c.deleted_at, 
            1 AS level
        FROM categories AS c
        WHERE c.parent_id IS NULL AND c.deleted = 0

        UNION ALL

        SELECT 
            c.id, 
            c.name, 
            c.slug, 
            c.parent_id, 
            c.product_type_id, 
            c.image_path, 
            c.created_at, 
            c.updated_at, 
            c.deleted, 
            c.deleted_at, 
            ct.level + 1 AS level
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
        WHERE c.deleted = 0
    )
    SELECT 
        ct.id, 
        ct.name, 
        ct.slug, 
        ct.parent_id, 
        (SELECT c.name FROM categories c WHERE c.id = ct.parent_id) AS parent_name,
        ct.product_type_id, 
        (SELECT pt.name FROM product_types pt WHERE pt.id = ct.product_type_id) AS product_type_name, 
        ct.image_path, 
        ct.created_at, 
        ct.updated_at, 
        ct.level
    FROM category_tree AS ct
    ORDER BY level, parent_id, id;
END;
$$ LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION get_all_categories(
    p_has_product_type BOOLEAN
) RETURNS TABLE (
    ID INT,
    NAME VARCHAR,
    SLUG VARCHAR,
    PARENT_ID INT,
    PARENT_NAME VARCHAR, 
    PRODUCT_TYPE_ID INT,
    PRODUCT_TYPE_NAME VARCHAR,
    IMAGE_PATH VARCHAR,
    CREATED_AT TIMESTAMP WITH TIME ZONE,
    UPDATED_AT TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.parent_id, 
        (SELECT c.name FROM categories c WHERE c.id = c.parent_id) AS parent_name,
        c.product_type_id, 
        (SELECT pt.name FROM product_types pt WHERE pt.id = c.product_type_id) AS product_type_name, 
        c.image_path, 
        c.created_at, 
        c.updated_at
    FROM categories c
    WHERE c.deleted = 0
    AND (
        p_has_product_type IS NULL
        OR (p_has_product_type IS TRUE AND c.product_type_id IS NOT NULL)
        OR (p_has_product_type IS FALSE AND c.product_type_id IS NULL)
    );
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_category_by_id (
    p_id INT
) RETURNS TABLE (
    ID INT,
    NAME VARCHAR,
    SLUG VARCHAR,
    PARENT_ID INT,
    PARENT_NAME VARCHAR,
    PRODUCT_TYPE_ID INT,
    PRODUCT_TYPE_NAME VARCHAR,
    IMAGE_PATH VARCHAR,
    CREATED_AT TIMESTAMP WITH TIME ZONE,
    UPDATED_AT TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_category_id INT;
BEGIN
    SELECT c.id INTO v_category_id FROM categories c WHERE c.id = p_id AND c.deleted = 0;
    
    IF v_category_id IS NULL THEN
        RAISE EXCEPTION 'Category not found' USING ERRCODE = 'CNF00';
    END IF;

    RETURN QUERY
    SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.parent_id, 
        (SELECT c.name FROM categories c WHERE c.id = c.parent_id) AS parent_name,
        c.product_type_id, 
        (SELECT pt.name FROM product_types pt WHERE pt.id = c.product_type_id) AS product_type_name,
        c.image_path, 
        c.created_at, 
        c.updated_at
    FROM categories c 
    WHERE c.id = p_id;
END;
$$ LANGUAGE PLPGSQL;




create or replace function get_category_by_slug (
    p_slug varchar
) returns table (like categories) as $$
declare
    v_category_id int;
begin
    select id into v_category_id from categories where deleted = 0 and slug = p_slug;
    if v_category_id is null then
        raise exception 'Category not found' using errcode = 'CNF00';
    end if;

    return query
    select * from categories where id = v_category_id;
end;
$$ language PLPGSQL;