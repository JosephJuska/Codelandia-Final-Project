create or replace function create_announcement(
    p_title varchar,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone,
    p_is_active bool
) 
returns int
as $$
declare
    v_id int;
begin
    insert into announcements (title, start_date, end_date, is_active) values (p_title, p_start_date, p_end_date, p_is_active) returning id into v_id;
    return v_id;
end;
$$ language plpgsql;

create or replace procedure update_announcement(
    p_id int,
    p_title varchar,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone,
    p_is_active bool
) as $$
declare
    v_announcement_id int;
    v_current_announcement record;
begin
    select id into v_announcement_id from announcements where deleted = 0 and id = p_id;
    if v_announcement_id is null then
        raise exception 'Announcement not found' using errcode = 'ANF00';
    end if;

    select * into v_current_announcement from announcements where id = p_id and deleted = 0;

    if (p_title is distinct from v_current_announcement.title) or
       (p_start_date is distinct from v_current_announcement.start_date) or
       (p_end_date is distinct from v_current_announcement.end_date) or
       (p_is_active is distinct from v_current_announcement.is_active) then

    update announcements
    set title = p_title, start_date = p_start_date, end_date = p_end_date, is_active = p_is_active, updated_at = current_timestamp
    where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_announcement(
    p_id int
) as $$
declare
    v_announcement_id int;
begin
    select id into v_announcement_id from announcements where deleted = 0 and id = p_id;
    if v_announcement_id is null then
        raise exception 'Announcement not found' using errcode = 'ANF00';
    end if;

    update announcements
    set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



create or replace function get_announcement_by_id(
    p_id int
) returns table (like announcements)
as $$
declare
    v_announcement_id int;
begin
    select id into v_announcement_id from announcements where deleted = 0 and id = p_id;
    if v_announcement_id is null then
        raise exception 'Announcement not found' using errcode = 'ANF00';
    end if;

    return query
    select * from announcements where id = p_id;
end;
$$ language plpgsql;



create or replace function get_active_announcements()
returns table (like announcements)
as $$
begin
    return query
    select * from announcements where deleted = 0 and is_active = true and current_timestamp >= start_date and current_date <= current_timestamp order by start_date desc limit 5;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION GET_ANNOUNCEMENTS (
    p_is_active BOOLEAN,
    p_search_term VARCHAR,
    p_sort_by VARCHAR,
    p_start_date TIMESTAMP with time zone,
    p_end_date TIMESTAMP with time zone,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    title VARCHAR,
    start_date TIMESTAMP with time zone,
    end_date TIMESTAMP with time zone,
    is_active BOOLEAN,
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
    FROM announcements AS a
    WHERE 
        (p_search_term IS NULL OR a.title ILIKE '%' || p_search_term || '%') AND
        (p_is_active IS NULL OR 
            (p_is_active = TRUE AND a.is_active = TRUE AND a.start_date <= current_timestamp AND a.end_date >= current_timestamp) OR 
            (p_is_active = FALSE AND (a.is_active = FALSE OR a.start_date > current_timestamp OR a.end_date < current_timestamp))
        ) AND
        (p_start_date IS NULL OR p_end_date IS NULL OR (a.start_date <= p_start_date AND a.end_date >= p_end_date));

    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by IN ('titleASC', 'titleDESC') THEN 'a.title'
        WHEN p_sort_by IN ('newest', 'oldest') THEN 'a.created_at'
        ELSE 'a.title'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'titleASC' THEN 'ASC'
        WHEN p_sort_by = 'titleDESC' THEN 'DESC'
        WHEN p_sort_by = 'newest' THEN 'DESC'
        WHEN p_sort_by = 'oldest' THEN 'ASC'
        ELSE 'ASC'
    END;

    RETURN QUERY EXECUTE format('
        SELECT 
            a.id,
            a.title,
            a.start_date,
            a.end_date,
            a.is_active,
            a.created_at,
            a.updated_at,
            a.deleted,
            a.deleted_at,
            %L::INT AS page_count
        FROM 
            announcements AS a
        WHERE 
            (%L IS NULL OR a.title ILIKE %L) AND
            (%L IS NULL OR 
                (%L = TRUE AND a.is_active = TRUE AND a.start_date <= CURRENT_TIMESTAMP AND a.end_date >= CURRENT_TIMESTAMP) OR 
                (%L = FALSE AND (a.is_active = FALSE OR a.start_date > CURRENT_TIMESTAMP OR a.end_date < CURRENT_TIMESTAMP))
            ) AND
            (%L IS NULL OR %L IS NULL OR (a.start_date <= %L AND a.end_date >= %L))
            AND a.deleted = 0
        ORDER BY 
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_search_term,
        '%' || p_search_term || '%',
        p_is_active,
        p_is_active,
        p_is_active,
        p_start_date,
        p_end_date,
        p_start_date,
        p_end_date,
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;