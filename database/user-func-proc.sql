CREATE OR REPLACE FUNCTION get_users(
    p_admin_id int,
    p_is_active BOOLEAN,
    p_is_verified BOOLEAN,
    p_roles INT[],
    p_search_term VARCHAR,
    p_sort_by VARCHAR,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    ID INT,
    FIRST_NAME VARCHAR,
    LAST_NAME VARCHAR,
    USERNAME VARCHAR,
    EMAIL VARCHAR,
    PASSWORD VARCHAR,
    ROLE_ID INT,
    VERIFIED BOOLEAN,
    IS_ACTIVE BOOLEAN,
    CREATED_AT TIMESTAMP WITH TIME ZONE,
    UPDATED_AT TIMESTAMP WITH TIME ZONE,
    DELETED INT,
    DELETED_AT TIMESTAMP WITH TIME ZONE,
    PAGE_COUNT INT
) AS $$
DECLARE
    v_page_count INT;
    v_total_count INT;
    sort_column VARCHAR;
    sort_order VARCHAR;
BEGIN
    SELECT COUNT(*)::INT into v_total_count
        FROM 
            USERS U
        WHERE 
            (p_is_active IS NULL OR U.IS_ACTIVE = p_is_active) AND
            (p_is_verified IS NULL OR U.VERIFIED = p_is_verified) AND
            ((p_roles IS NULL OR p_roles = '{}'::INT[]) OR U.ROLE_ID = ANY(p_roles)) AND
            (p_search_term IS NULL OR 
                (U.FIRST_NAME ILIKE '%' || p_search_term || '%' OR 
                 U.LAST_NAME ILIKE '%' || p_search_term || '%' OR 
                 U.EMAIL ILIKE '%' || p_search_term || '%' OR
                 U.USERNAME ILIKE '%' || p_search_term || '%')
            )
            AND U.DELETED = 0
            AND U.ID <> p_admin_id;
    
    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by in ('firstNameASC', 'firstNameDESC') THEN 'U.FIRST_NAME'
        WHEN p_sort_by in ('lastNameASC', 'lastNameDESC') THEN 'U.LAST_NAME'
        WHEN p_sort_by in ('usernameASC', 'usernameDESC') THEN 'U.USERNAME'
        WHEN p_sort_by in ('newest', 'oldest') THEN 'U.CREATED_AT'
        ELSE 'U.FIRST_NAME'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'firstNameASC' THEN 'ASC'
        WHEN p_sort_by = 'firstNameDESC' THEN 'DESC'
        WHEN p_sort_by = 'lastNameASC' THEN 'ASC'
        WHEN p_sort_by = 'lastNameDESC' THEN 'DESC'
        WHEN p_sort_by = 'usernameASC' THEN 'ASC'
        WHEN p_sort_by = 'usernameDESC' THEN 'DESC'
        WHEN p_sort_by = 'newest' THEN 'DESC'
        WHEN p_sort_by = 'oldest' THEN 'ASC'
        ELSE 'ASC'
    END;

    RETURN QUERY EXECUTE format('
        SELECT 
            U.ID AS ID,
            U.FIRST_NAME AS FIRST_NAME,
            U.LAST_NAME AS LAST_NAME,
            U.USERNAME AS USERNAME,
            U.EMAIL AS EMAIL,
            U.PASSWORD AS PASSWORD,
            U.ROLE_ID AS ROLE_ID,
            U.VERIFIED AS VERIFIED,
            U.IS_ACTIVE AS IS_ACTIVE,
            U.CREATED_AT AS CREATED_AT,
            U.UPDATED_AT AS UPDATED_AT,
            U.DELETED AS DELETED,
            U.DELETED_AT AS DELETED_AT,
            %L::INT AS PAGE_COUNT
        FROM 
            USERS AS U
        WHERE 
            (%L IS NULL OR U.IS_ACTIVE = %L) AND
            (%L IS NULL OR U.VERIFIED = %L) AND
            ((%L IS NULL OR %L = ''{}''::INT[]) OR U.ROLE_ID = ANY(%L)) AND
            (%L IS NULL OR 
                (U.FIRST_NAME ILIKE ''%%'' || %L || ''%%'' OR 
                 U.LAST_NAME ILIKE ''%%'' || %L || ''%%'' OR 
                 U.EMAIL ILIKE ''%%'' || %L || ''%%'' OR
                 U.USERNAME ILIKE ''%%'' || %L || ''%%'')
            )
            AND U.DELETED = 0
            AND U.ID <> %L
        ORDER BY 
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_is_active,
        p_is_active,
        p_is_verified,
        p_is_verified,
        p_roles,
        p_roles,
        p_roles,
        p_search_term,
        p_search_term,
        p_search_term,
        p_search_term,
        p_search_term,
        p_admin_id,
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;



create or replace procedure update_account(
    p_id int,
    p_first_name varchar,
    p_last_name varchar,
    p_username varchar,
    p_email varchar,
    p_password varchar,
    p_role_id int,
    p_verified boolean,
    p_is_active boolean
) as $$
declare
    v_user_id int;
    v_current_user record;
BEGIN
    select id into v_user_id from users where id = p_id and deleted = 0;
    if v_user_id is null THEN
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    v_user_id := null;

    select id into v_user_id from users where p_username is not null and username = p_username and deleted = 0 and id <> p_id;
    if v_user_id is not null THEN
        raise exception 'User with username % already exists', p_username using errcode = 'UAE01';
    end if;

    v_user_id := null;

    select id into v_user_id from users where p_email is not null and deleted = 0 and email = p_email and id <> p_id;
    if v_user_id is not null THEN
        raise exception 'User with email % already exists', p_email using errcode = 'UAE02';
    end if;

    select * into v_current_user from users where id = p_id;

    if (p_first_name is not null and p_first_name is distinct from v_current_user.first_name) or
        (p_last_name is not null and p_last_name is distinct from v_current_user.last_name) or
        (p_username is distinct from v_current_user.username) or
        (p_email is not null and p_email is distinct from v_current_user.email) or
        (p_password is not null and p_password is distinct from v_current_user.password) or
        (p_role_id is not null and p_role_id is distinct from v_current_user.role_id) or
        (p_verified is not null and p_verified is distinct from v_current_user.verified) or
        (p_is_active is not null and p_is_active is distinct from v_current_user.is_active) then
    
    update users
    set
        first_name = coalesce(p_first_name, first_name),
        last_name = coalesce(p_last_name, last_name),
        username = p_username,
        email = coalesce(p_email, email),
        password = coalesce(p_password, password),
        role_id = coalesce(p_role_id, role_id),
        verified = coalesce(p_verified, verified),
        is_active = coalesce(p_is_active, is_active),
        updated_at = current_timestamp
    where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_user(
    p_id int
) as $$
declare
    v_user_id int;
BEGIN
    select id into v_user_id from users where id = p_id and deleted = 0;
    if v_user_id is null THEN
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    update users
    set
        deleted = id,
        deleted_at = current_timestamp
    where id = p_id;
end;
$$ language plpgsql;