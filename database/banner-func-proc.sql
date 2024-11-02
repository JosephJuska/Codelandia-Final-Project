create or replace function create_banner (
    p_header varchar,
    p_sub_header varchar,
    p_background_path varchar,
    p_button_text varchar,
    p_button_link varchar,
    p_is_active bool,
    p_active_till timestamp with time zone
) 
returns int
as $$
declare
    v_id int;
begin
    insert into banners (header, sub_header, background_path, button_text, button_link, is_active, active_till) values
    (p_header, p_sub_header, p_background_path, p_button_text, p_button_link, p_is_active, p_active_till) returning id into v_id;

    return v_id;
end;
$$ language plpgsql;



create or replace procedure update_banner (
    p_id int,
    p_header varchar,
    p_sub_header varchar,
    p_background_path varchar,
    p_button_text varchar,
    p_button_link varchar,
    p_is_active bool,
    p_active_till timestamp with time zone
) as $$
declare
    v_banner_id int;
    v_current_banner record;
begin
    select id into v_banner_id from banners where id = p_id and deleted = 0 limit 1;
    if v_banner_id is null then
        raise exception 'Banner not found' using errcode = 'BNF00';
    end if;

    select * into v_current_banner from banners where id = p_id and deleted = 0;

    if (p_header is distinct from v_current_banner.header) or
        (p_sub_header is distinct from v_current_banner.sub_header) or
        (p_background_path is not null and p_background_path is distinct from v_current_banner.background_path) or
        (p_button_text is distinct from v_current_banner.button_text) or
        (p_button_link is distinct from v_current_banner.button_link) or
        (p_is_active is distinct from v_current_banner.is_active) or
        (p_active_till is distinct from v_current_banner.active_till) then

    update banners set 
    header = p_header, 
    sub_header = p_sub_header, 
    background_path = coalesce(p_background_path, background_path), 
    button_text = p_button_text, 
    button_link = p_button_link, 
    is_active = p_is_active, 
    active_till = p_active_till, 
    updated_at = current_timestamp 
    where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_banner (
    p_id int
) as $$
declare
    v_banner_id int;
begin
    select id into v_banner_id from banners where id = p_id and deleted = 0 limit 1;
    if v_banner_id is null then
        raise exception 'Banner not found' using errcode = 'BNF00';
    end if;

    update banners set deleted = 1, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION get_banners(
    p_is_active BOOLEAN,
    p_sort_by VARCHAR,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    header VARCHAR,
    sub_header VARCHAR,
    background_path VARCHAR,
    button_text VARCHAR,
    button_link VARCHAR,
    is_active BOOLEAN,
    active_till TIMESTAMP with time zone,
    created_at TIMESTAMP with time zone,
    updated_at TIMESTAMP with time zone,
    deleted INT,
    deleted_at TIMESTAMP with time zone,
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
    FROM banners AS b
    WHERE 
        b.deleted = 0
        AND (
            (p_is_active IS NULL)
            OR (p_is_active = TRUE AND b.is_active = TRUE AND b.active_till <= CURRENT_DATE)
            OR (p_is_active = FALSE AND b.is_active = FALSE OR b.active_till > CURRENT_DATE)
        );

    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by IN ('activeTillASC', 'activeTillDESC') THEN 'b.active_till'
        WHEN p_sort_by IN ('headerASC', 'headerDESC') THEN 'UPPER(b.header)'
        WHEN p_sort_by IN ('newest', 'oldest') THEN 'b.created_at'
        ELSE 'b.created_at'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'headerASC' THEN 'ASC'
        WHEN p_sort_by = 'headerDESC' THEN 'DESC'
        WHEN p_sort_by = 'activeTillASC' THEN 'ASC'
        WHEN p_sort_by = 'activeTillDESC' THEN 'DESC'
        WHEN p_sort_by = 'newest' THEN 'DESC'
        WHEN p_sort_by = 'oldest' THEN 'ASC'
        ELSE 'DESC'
    END;

    RETURN QUERY
    EXECUTE format('
        SELECT 
            b.id AS id,
            b.header AS header,
            b.sub_header AS sub_header,
            b.background_path AS background_path,
            b.button_text AS button_text,
            b.button_link AS button_link,
            b.is_active AS is_active,
            b.active_till AS active_till,
            b.created_at AS created_at,
            b.updated_at AS updated_at,
            b.deleted AS deleted,
            b.deleted_at AS deleted_at,
            %L::INT AS page_count
        FROM 
            banners AS b
        WHERE 
            b.deleted = 0
            AND ((%L IS NULL)
                OR (%L = TRUE AND b.is_active = TRUE AND b.active_till <= CURRENT_DATE)
                OR (%L = FALSE AND b.is_active = FALSE OR b.active_till > CURRENT_DATE))
        ORDER BY
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_is_active,
        p_is_active,
        p_is_active,
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;



create or replace function get_banner_by_id (
    p_id int
) returns table (like banners) as $$
declare
    v_banner_id int;
begin
    select id into v_banner_id from banners where id = p_id and deleted = 0 limit 1;
    if v_banner_id is null then
        raise exception 'Banner not found' using errcode = 'BNF00';
    end if;
    
    return query select * from banners where id = p_id;
end;
$$ language plpgsql;