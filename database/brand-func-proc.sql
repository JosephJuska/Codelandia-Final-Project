CREATE OR REPLACE FUNCTION GET_BRANDS (
    p_search_term VARCHAR,
    p_sort_by VARCHAR,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    name VARCHAR,
    code INT,
    image_path VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    page_count INT
) AS $$
DECLARE
    v_page_count INT;
    v_total_count INT;
    sort_column VARCHAR;
    sort_order VARCHAR;
BEGIN
    SELECT COUNT(*)::INT
    INTO v_total_count
    FROM brands AS b
    WHERE 
        b.deleted = 0 AND
        (
        p_search_term IS NULL OR 
        b.code::TEXT = p_search_term OR 
        b.name ILIKE '%' || p_search_term || '%'
        );

    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by IN ('nameASC', 'nameDESC') THEN 'UPPER(b.name)'
        WHEN p_sort_by IN ('codeASC', 'codeDESC') THEN 'b.code'
        ELSE 'UPPER(b.name)'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'nameASC' THEN 'ASC'
        WHEN p_sort_by = 'nameDESC' THEN 'DESC'
        WHEN p_sort_by = 'codeASC' THEN 'ASC'
        WHEN p_sort_by = 'codeDESC' THEN 'DESC'
        ELSE 'ASC'
    END;

    RETURN QUERY EXECUTE format('
        SELECT 
            b.id,
            b.name,
            b.code,
            b.image_path,
            b.created_at,
            b.updated_at,
            %L::INT AS page_count
        FROM 
            brands AS b
        WHERE 
            b.deleted = 0 AND
            %L IS NULL OR b.code::TEXT = %L OR b.name ILIKE %L
        ORDER BY 
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_search_term,
        p_search_term,
        '%' || p_search_term || '%',
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;



create or replace function get_brand_by_id (
	p_id int
) returns table (like brands) as $$
declare
	v_brand_id int;
begin
	select id into v_brand_id from brands where id = p_id and deleted = 0;
	if v_brand_id is null then
		raise exception 'Brand not found' using errcode = 'BNF00';
	end if;

	return query
    select * from brands where id = p_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE FUNCTION CREATE_BRAND (P_NAME VARCHAR, P_CODE INT, P_IMAGE_PATH VARCHAR) 
RETURNS INT
AS $$
declare
	v_brand_id int;
    v_id int;
begin
	select id into v_brand_id from brands where name = p_name and deleted = 0 limit 1;
	if v_brand_id is not null then
		raise exception 'Brand with name % already exists', p_name using errcode = 'BAE01';
	end if;

	v_brand_id := null;

	select id into v_brand_id from brands where code = p_code and deleted = 0 limit 1;
	if v_brand_id is not null then
		raise exception 'Brand with code % already exists', p_code using errcode = 'BAE02';
	end if;

	insert into brands (name, code, image_path) values (p_name, p_code, p_image_path) returning id into v_id;

    return v_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE UPDATE_BRAND (
	P_ID INT,
	P_NAME VARCHAR,
	P_CODE INT,
	P_IMAGE_PATH VARCHAR
) AS $$
declare
	v_brand_id int;
    v_current_brand record;
begin
	select id into v_brand_id from brands where id = p_id and deleted = 0 limit 1;
	if v_brand_id is null then
		raise exception 'Brand not found' using errcode = 'BNF00';
	end if;

	v_brand_id := null;

	select id into v_brand_id from brands where name = p_name and id <> p_id and deleted = 0 limit 1;
	if v_brand_id is not null then
		raise exception 'Brand with name % already exists', p_name using errcode = 'BAE01';
	end if;

	v_brand_id := null;

	select id into v_brand_id from brands where code = p_code and id <> p_id and deleted = 0 limit 1;
	if v_brand_id is not null then
		raise exception 'Brand with code % already exists', p_code using errcode = 'BAE02';
	end if;

    select * into v_current_brand from brands where id = p_id;

    if (p_name is distinct from v_current_brand.name) or
        (p_code is distinct from v_current_brand.code) or
        (p_image_path is not null and p_image_path is distinct from v_current_brand.image_path) then

	update brands set 
    name = p_name, 
    code = p_code, 
    image_path = coalesce(p_image_path, image_path),
    updated_at = current_timestamp
    where id = p_id;

    end if;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE DELETE_BRAND (P_ID INT) AS $$
declare
	v_brand_id int;
	v_product_count int;
begin
	select id into v_brand_id from brands where id = p_id and deleted = 0 limit 1;
	if v_brand_id is null then
		raise exception 'Brand not found' using errcode = 'BNF00';
	end if;

	select count(*) into v_product_count from products where brand_id = p_id;
	if v_product_count > 0 then
		raise exception 'Brand cannot be deleted because it is connected to % products', v_product_count using errcode = 'BD001';
	end if;

	update brands
    set deleted = id, deleted_at = current_timestamp
    where id = p_id;
end;
$$ LANGUAGE PLPGSQL;