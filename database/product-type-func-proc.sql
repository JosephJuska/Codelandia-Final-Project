CREATE
OR REPLACE FUNCTION GET_PRODUCT_TYPE_BY_CATEGORY_ID (P_CATEGORY_ID INT) RETURNS TABLE (
	ID INT,
	NAME VARCHAR,
	FIELDS JSONB,
	PRODUCT_COUNT INT,
	CATEGORY_COUNT INT,
	CREATED_AT TIMESTAMP with time zone,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT,
	DELETED_AT TIMESTAMP with time zone
) AS $$
declare
	v_category_id int;
	v_product_type_id int;
begin
	select c.id into v_category_id from categories as c where c.id = p_category_id and c.deleted = 0 limit 1;
	if v_category_id is null then
		raise exception 'Category not found' using errcode = 'CNF00';
	end if;

	select c.product_type_id into v_product_type_id from categories as c where c.id = p_category_id and c.deleted = 0 limit 1;
	if v_product_type_id is null then
		raise exception 'Product type not found' using errcode = 'PTNF0';
	end if;

	RETURN QUERY
    SELECT
        pt.id AS id,
        pt.name AS name,
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', ptf.id,
                'name', ptf.name,
                'field_type_id', ptf.field_type_id,
                'created_at', ptf.created_at,
                'updated_at', ptf.updated_at,
                'deleted', ptf.deleted,
                'deleted_at', ptf.deleted_at
            ))
            FROM product_type_fields ptf
            WHERE ptf.product_type_id = pt.id
            AND ptf.deleted = 0
        ), '[]'::jsonb) AS fields,
        (
            SELECT COUNT(*)::int
            FROM products p
            WHERE p.category_id IN (
                SELECT c.id
                FROM categories c
                WHERE c.product_type_id = pt.id
                AND c.deleted = 0
            )
            AND p.deleted = 0
        ) AS product_count,
        (
            SELECT COUNT(*)::int
            FROM categories c
            WHERE c.product_type_id = pt.id
            AND c.deleted = 0
        ) AS category_count,
        pt.created_at AS created_at,
        pt.updated_at AS updated_at,
        pt.deleted AS deleted,
        pt.deleted_at AS deleted_at
    FROM product_types pt
	JOIN categories as c on c.product_type_id = pt.id
    WHERE pt.deleted = 0
    AND c.id = p_category_id;
end;
$$ LANGUAGE PLPGSQL;



create or replace function get_product_type_by_id (
	p_id int
) returns table (
	ID INT,
	NAME VARCHAR,
	FIELDS JSONB,
	PRODUCT_COUNT INT,
	CATEGORY_COUNT INT,
	CREATED_AT TIMESTAMP with time zone,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT,
	DELETED_AT TIMESTAMP with time zone
) as $$
declare
    v_product_type_id int;
begin
	select pt.id into v_product_type_id from product_types as pt where pt.deleted = 0 and pt.id = p_id;
	if v_product_type_id is null then
		raise exception 'Product type not found' using errcode = 'PTNF0';
	end if;

	RETURN QUERY
    SELECT
        pt.id AS id,
        pt.name AS name,
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', ptf.id,
                'name', ptf.name,
                'field_type_id', ptf.field_type_id,
                'created_at', ptf.created_at,
                'updated_at', ptf.updated_at,
                'deleted', ptf.deleted,
                'deleted_at', ptf.deleted_at
            ))
            FROM product_type_fields ptf
            WHERE ptf.product_type_id = pt.id
            AND ptf.deleted = 0
        ), '[]'::jsonb) AS fields,
        (
            SELECT COUNT(*)::int
            FROM products p
            WHERE p.category_id IN (
                SELECT c.id
                FROM categories c
                WHERE c.product_type_id = pt.id
                AND c.deleted = 0
            )
            AND p.deleted = 0
        ) AS product_count,
        (
            SELECT COUNT(*)::int
            FROM categories c
            WHERE c.product_type_id = pt.id
            AND c.deleted = 0
        ) AS category_count,
        pt.created_at AS created_at,
        pt.updated_at AS updated_at,
        pt.deleted AS deleted,
        pt.deleted_at AS deleted_at
    FROM product_types pt
    WHERE pt.deleted = 0
    AND pt.id = p_id;
end;
$$ language PLPGSQL;



create or replace function search_product_types_by_name (
	p_name varchar,
	p_limit int,
	p_offset int
) returns table (
	ID INT,
	NAME VARCHAR,
	FIELDS JSONB,
	PRODUCT_COUNT INT,
	CATEGORY_COUNT INT,
	CREATED_AT TIMESTAMP with time zone,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT,
	DELETED_AT TIMESTAMP with time zone
) as $$
begin
	RETURN QUERY
    SELECT
        pt.id AS id,
        pt.name AS name,
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', ptf.id,
                'name', ptf.name,
                'field_type_id', ptf.field_type_id,
                'created_at', ptf.created_at,
                'updated_at', ptf.updated_at,
                'deleted', ptf.deleted,
                'deleted_at', ptf.deleted_at
            ))
            FROM product_type_fields ptf
            WHERE ptf.product_type_id = pt.id
            AND ptf.deleted = 0
        ), '[]'::jsonb) AS fields,
        (
            SELECT COUNT(*)::int
            FROM products p
            WHERE p.category_id IN (
                SELECT c.id
                FROM categories c
                WHERE c.product_type_id = pt.id
                AND c.deleted = 0
            )
            AND p.deleted = 0
        ) AS product_count,
        (
            SELECT COUNT(*)::int
            FROM categories c
            WHERE c.product_type_id = pt.id
            AND c.deleted = 0
        ) AS category_count,
        pt.created_at AS created_at,
        pt.updated_at AS updated_at,
        pt.deleted AS deleted,
        pt.deleted_at AS deleted_at
    FROM product_types pt
    WHERE pt.deleted = 0
    AND pt.name ILIKE '%' || p_name || '%'
    LIMIT p_limit offset p_offset;
end;
$$ language PLPGSQL;



CREATE OR REPLACE FUNCTION GET_PRODUCT_TYPES (
    p_search_term VARCHAR,
    p_sort_by VARCHAR
) RETURNS TABLE (
    ID INT,
    NAME VARCHAR,
    FIELDS JSONB,
    PRODUCT_COUNT INT,
    CATEGORY_COUNT INT,
    CREATED_AT TIMESTAMP with time zone,
    UPDATED_AT TIMESTAMP with time zone,
    DELETED INT,
    DELETED_AT TIMESTAMP with time zone
) AS $$
DECLARE
    sort_column VARCHAR;
    sort_order VARCHAR;
BEGIN
    sort_column := CASE
        WHEN p_sort_by IN ('nameASC', 'nameDESC') THEN 'pt.name'
        WHEN p_sort_by IN ('productCountASC', 'productCountDESC') THEN 'product_count'
        ELSE 'pt.name'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'nameASC' THEN 'ASC'
        WHEN p_sort_by = 'nameDESC' THEN 'DESC'
        WHEN p_sort_by = 'productCountASC' THEN 'ASC'
        WHEN p_sort_by = 'productCountDESC' THEN 'DESC'
        ELSE 'ASC'
    END;

    RETURN QUERY EXECUTE format('
        SELECT
            pt.id AS id,
            pt.name AS name,
            COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    ''id'', ptf.id,
                    ''name'', ptf.name,
                    ''field_type_id'', ptf.field_type_id,
                    ''created_at'', ptf.created_at,
                    ''updated_at'', ptf.updated_at,
                    ''deleted'', ptf.deleted,
                    ''deleted_at'', ptf.deleted_at
                ))
                FROM product_type_fields ptf
                WHERE ptf.product_type_id = pt.id
                AND ptf.deleted = 0
            ), ''[]''::jsonb) AS fields,
            (
                SELECT COUNT(*)::int
                FROM products p
                WHERE p.category_id IN (
                    SELECT c.id
                    FROM categories c
                    WHERE c.product_type_id = pt.id
                    AND c.deleted = 0
                )
                AND p.deleted = 0
            ) AS product_count,
            (
                SELECT COUNT(*)::int
                FROM categories c
                WHERE c.product_type_id = pt.id
                AND c.deleted = 0
            ) AS category_count,
            pt.created_at AS created_at,
            pt.updated_at AS updated_at,
            pt.deleted AS deleted,
            pt.deleted_at AS deleted_at
        FROM product_types pt
        WHERE pt.deleted = 0
        AND (%L IS NULL OR pt.name ILIKE %L)
        ORDER BY %s %s',
        p_search_term,
        '%' || p_search_term || '%',
        sort_column,
        sort_order
    );

END;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE FUNCTION CREATE_PRODUCT_TYPE (P_NAME VARCHAR)
RETURNS INT
AS $$
declare
	v_product_type_id int;
    v_id int;
begin
	select id into v_product_type_id from product_types where deleted = 0 and name = p_name limit 1;
	if v_product_type_id is not null then
		raise exception 'Product type with name % already exists', p_name using errcode = 'PTAE0';
	end if;

	insert into product_types (name) values (p_name) returning id into v_id;

    return v_id;
end;
$$ LANGUAGE PLPGSQL;

CREATE
OR REPLACE PROCEDURE UPDATE_PRODUCT_TYPE (P_ID INT, P_NAME VARCHAR) AS $$
declare
	v_product_type_id int;
    v_current_product_type record;
begin
	select id into v_product_type_id from product_types where deleted = 0 and id = p_id limit 1;
	if v_product_type_id is null then
		raise exception 'Product type not found' using errcode = 'PTNF0';
	end if;

	v_product_type_id := null;

	select id into v_product_type_id from product_types where name = p_name and id <> p_id and deleted = 0 limit 1;
	if v_product_type_id is not null then
		raise exception 'Product type with name % already exists', p_name using errcode = 'PTAE0';
	end if;

    select * into v_current_product_type from product_types where id = p_id;
    if v_current_product_type.name is distinct from p_name then

	update product_types set name = p_name, updated_at = current_timestamp where id = p_id;

    end if;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE DELETE_PRODUCT_TYPE (P_ID INT) AS $$
declare
	v_product_type_id int;
	v_product_count int;
begin
	select id into v_product_type_id from product_types where deleted = 0 and id = p_id limit 1;
	if v_product_type_id is null then
		raise exception 'Product type not found' using errcode = 'PTNF0';
	end if;

	select count(*) into v_product_count from products as p join categories as c on p.category_id = c.id where p.deleted = 0
	and c.deleted = 0 and c.product_type_id = p_id;
	if v_product_count > 0 then
		raise exception 'Product type cannot be deleted because it is connected to % of products', v_product_count using errcode = 'PTD01';
	end if;

	update product_types set deleted = id, deleted_at = current_timestamp where id = p_id;
	update categories set product_type_id = null where deleted = 0 and product_type_id = p_id;
	update product_type_fields set deleted = id, deleted_at = current_timestamp where deleted = 0 and product_type_id = p_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE FUNCTION CREATE_PRODUCT_TYPE_FIELD (
	P_PRODUCT_TYPE_ID INT,
	P_FIELD_TYPE_ID INT,
	P_NAME VARCHAR
) RETURNS TABLE(id int)
AS $$
declare
	v_product_type_id int;
	v_field_type_id int;
	v_product_type_field_id int;
	v_product_id int;
begin
	select pt.id into v_product_type_id from product_types as pt where pt.deleted = 0 and pt.id = p_product_type_id limit 1;
	if v_product_type_id is null then
		raise exception 'Product type not found' using errcode = 'PTNF0';
	end if;

	select ft.id into v_field_type_id from field_types as ft where ft.id = p_field_type_id limit 1;
	if v_field_type_id is null then
		raise exception 'Field type not found' using errcode = 'FTNF0';
	end if;

	select ptf.id into v_product_type_field_id from product_type_fields as ptf where ptf.deleted = 0 and ptf.product_type_id = p_product_type_id and ptf.name = p_name;
	if v_product_type_field_id is not null then
		raise exception 'Product type field with name % already exists', p_name using errcode = 'PTFAE';
	end if;

	insert into product_type_fields as ptf (product_type_id, field_type_id, name) values 
	(p_product_type_id, p_field_type_id, p_name) returning ptf.id into v_product_type_field_id;

	FOR V_PRODUCT_ID IN 
		SELECT p.id 
		FROM products p
		JOIN categories c ON p.category_id = c.id
		WHERE p.deleted = 0 AND c.product_type_id = P_PRODUCT_TYPE_ID
	LOOP
		INSERT INTO product_fields (product_id, product_type_field_id) 
		VALUES (V_PRODUCT_ID, V_PRODUCT_TYPE_FIELD_ID);
	END LOOP;

	UPDATE products 
	SET updated_at = current_timestamp 
	WHERE deleted = 0 AND category_id IN (
		SELECT c.id FROM categories as c WHERE c.product_type_id = P_PRODUCT_TYPE_ID
	);

    UPDATE product_types set updated = current_timestamp where id = p_product_type_id;

    return query select v_product_type_field_id as id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE UPDATE_PRODUCT_TYPE_FIELD (P_ID INT, P_FIELD_TYPE_ID INT, P_NAME VARCHAR) AS $$
declare
	v_product_type_field_id int;
	v_field_type_id int;
	v_field_type_id_check int;
	v_product_type_id int;
	v_product_id int;
    v_current_product_type_field record;
begin
	select id, field_type_id, product_type_id into v_product_type_field_id, v_field_type_id_check, v_product_type_id from product_type_fields where deleted = 0 and id = p_id limit 1;
	if v_product_type_field_id is null then
		raise exception 'Product type field not found' using errcode = 'PTFNF';
	end if;

	select id into v_field_type_id from field_types where id = p_field_type_id;
	if v_field_type_id is null then
		raise exception 'Field type not found' using errcode = 'FTNF0';
	end if;

	v_field_type_id := null;

	select id into v_product_type_field_id from product_type_fields where deleted = 0 and product_type_id = v_product_type_id and name = p_name and id <> p_id;
	if v_product_type_field_id is not null then
		raise exception 'Product type field with name % already exists', p_name using errcode = 'PTFAE';
	end if;

    select * into v_current_product_type_field from product_type_fields where id = p_id;
    
    if (p_name is distinct from v_current_product_type_field.name) OR
        (p_field_type_id is distinct from v_current_product_type_field.field_type_id) then

	if p_field_type_id <> v_field_type_id_check then
		update product_fields set value = null where deleted = 0 and product_type_field_id = p_id;
		update product_variation_fields set value = null where deleted = 0 and product_type_field_id = p_id;
	end if;

	update product_type_fields set name = p_name, field_type_id = p_field_type_id, updated_at = current_timestamp where id = p_id;

    end if;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE DELETE_PRODUCT_TYPE_FIELD (P_ID INT) AS $$
declare
	v_product_type_field_id int;
begin
	select id into v_product_type_field_id from product_type_fields where deleted = 0 and id = p_id limit 1;
	if v_product_type_field_id is null then
		raise exception 'Product type field not found' using errcode = 'PTFNF';
	end if;

	update product_fields set deleted = id, deleted_at = current_timestamp where deleted = 0 and product_type_field_id = p_id;
	update product_variation_fields set deleted = id, deleted_at = current_timestamp where deleted = 0 and product_type_field_id = p_id;
	update product_type_fields set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ LANGUAGE PLPGSQL;