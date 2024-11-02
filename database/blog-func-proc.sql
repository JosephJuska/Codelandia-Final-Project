create or replace function get_blog_by_slug(
	p_slug varchar
) returns table (
	ID INT,
	AUTHOR_ID INT,
	AUTHOR_USERNAME VARCHAR,
	TITLE VARCHAR,
	SLUG VARCHAR,
	BANNER_PATH VARCHAR,
	DESCRIPTION VARCHAR,
	SUB_DESCRIPTION VARCHAR,
	RAW_CONTENT TEXT,
	CONTENT TEXT,
	PUBLISHED BOOL,
	PUBLISH_DATE TIMESTAMP with time zone,
	CREATED_AT TIMESTAMP with time zone,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT,
	DELETED_AT TIMESTAMP with time zone
) as $$
declare
	v_blog_id int;
begin
	select b.id into v_blog_id from blogs as b where b.deleted = 0 and b.published = true and b.slug = p_slug limit 1;
	if v_blog_id is null then
		raise exception 'Blog not found' using errcode = 'BNF00';
	end if;

	return query
	select b.id, u.id, u.username, b.title, b.slug, b.banner_path, b.description, b.sub_description, b.raw_content, b.content, b.published, b.publish_date, b.created_at, b.updated_at, b.deleted, b.deleted_at from blogs as b join users as u on b.author_id = u.id where 
	b.id = v_blog_id;
end;
$$ language plpgsql;



create or replace function search_blogs_by_title (
	p_title varchar,
	p_limit int,
	p_offset int
) returns table (
	ID INT,
	AUTHOR_ID INT,
	AUTHOR_USERNAME VARCHAR,
	TITLE VARCHAR,
	SLUG VARCHAR,
	BANNER_PATH VARCHAR,
	DESCRIPTION VARCHAR,
	SUB_DESCRIPTION VARCHAR,
	RAW_CONTENT TEXT,
	CONTENT TEXT,
	PUBLISHED BOOL,
	PUBLISH_DATE TIMESTAMP with time zone,
	CREATED_AT TIMESTAMP with time zone,
	UPDATED_AT TIMESTAMP with time zone,
	DELETED INT,
	DELETED_AT TIMESTAMP with time zone
) as $$
begin
	return query
	select b.id, u.id, u.username, b.title, b.slug, b.banner_path, b.description, b.sub_description, b.raw_content, b.content, b.published, b.publish_date, b.created_at, b.updated_at, b.deleted, b.deleted_at from blogs as b join users as u on b.author_id = u.id where 
	b.deleted = 0 and b.title ILIKE '%' || p_title || '%' limit p_limit offset p_offset;
end;
$$ language plpgsql;



CREATE OR REPLACE FUNCTION get_blogs(
    p_published BOOLEAN,
    p_sort_by VARCHAR,
    p_authors INT[],
    p_title VARCHAR,
    p_limit INT,
    p_offset INT
) RETURNS TABLE (
    id INT,
    author_id INT,
    author_username VARCHAR,
    title VARCHAR,
    slug VARCHAR,
    banner_path VARCHAR,
    description VARCHAR,
    sub_description VARCHAR,
    raw_content TEXT,
    content TEXT,
    published BOOL,
    publish_date TIMESTAMP with time zone,
    comment_count INT,
    page_count INT,
    created_at TIMESTAMP with time zone,
    updated_at TIMESTAMP with time zone,
    deleted INT,
    deleted_at TIMESTAMP with time zone
) AS $$
DECLARE
    v_page_count INT;
    v_total_count INT;
    sort_column VARCHAR;
    sort_order VARCHAR;
BEGIN
    SELECT COUNT(*)::INT
    INTO v_total_count
    FROM blogs AS b
    WHERE 
        b.deleted = 0
        AND (p_published IS NULL OR b.published = p_published)
        AND ((p_authors IS NULL OR p_authors = '{}'::INT[]) OR b.author_id = ANY(p_authors))
        AND (p_title IS NULL OR b.title ILIKE '%' || p_title || '%');

    v_page_count := CEIL(v_total_count / p_limit::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN p_sort_by IN ('newest', 'oldest') THEN 'b.created_at'
        WHEN p_sort_by IN ('titleASC', 'titleDESC') THEN 'UPPER(b.title)'
        ELSE 'b.created_at'
    END;

    sort_order := CASE
        WHEN p_sort_by = 'titleASC' THEN 'ASC'
        WHEN p_sort_by = 'titleDESC' THEN 'DESC'
        WHEN p_sort_by = 'oldest' THEN 'ASC'
        ELSE 'DESC'
    END;

    RETURN QUERY
    EXECUTE format('
        SELECT 
            b.id AS id,
            u.id AS author_id,
            u.username AS author_username,
            b.title AS title,
            b.slug AS slug,
            b.banner_path AS banner_path,
            b.description AS description,
            b.sub_description AS sub_description,
            b.raw_content AS raw_content,
            b.content AS content,
            b.published AS published,
            b.publish_date AS publish_date,
            COUNT(c.id)::INT AS comment_count,
            %L::INT AS page_count,
            b.created_at AS created_at,
            b.updated_at AS updated_at,
            b.deleted AS deleted,
            b.deleted_at AS deleted_at
        FROM 
            blogs AS b
        JOIN 
            users AS u ON b.author_id = u.id
        LEFT JOIN 
            comments AS c ON c.blog_id = b.id AND c.deleted = 0
        WHERE 
            b.deleted = 0
            AND (%L IS NULL OR b.published = %L)
            AND ((%L IS NULL OR %L = ''{}''::INT[]) OR b.author_id = ANY(%L))
            AND (%L IS NULL OR b.title ILIKE %L)
        GROUP BY 
            b.id, u.id
        ORDER BY
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        p_published,
		p_published,
        p_authors,
		p_authors,
        p_authors,
		p_title,
        '%' || p_title || '%',
        sort_column,
        sort_order,
        p_limit,
        p_offset
    );
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION GET_BLOG_BY_ID (
    P_ID INT
) RETURNS TABLE (
    ID INT,
    AUTHOR_ID INT,
    AUTHOR_USERNAME VARCHAR,
    AUTHOR_EMAIL VARCHAR,
    TITLE VARCHAR,
    SLUG VARCHAR,
    BANNER_PATH VARCHAR,
    DESCRIPTION VARCHAR,
    SUB_DESCRIPTION VARCHAR,
    RAW_CONTENT TEXT,
    CONTENT TEXT,
    PUBLISHED BOOL,
    PUBLISH_DATE TIMESTAMP with time zone,
    COMMENT_COUNT INT,
    CREATED_AT TIMESTAMP with time zone,
    UPDATED_AT TIMESTAMP with time zone,
    DELETED INT,
    DELETED_AT TIMESTAMP with time zone
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM blogs b WHERE b.id = P_ID AND b.deleted = 0) THEN
        RAISE EXCEPTION 'Blog not found' USING ERRCODE = 'BNF00';
    END IF;

    RETURN QUERY
    SELECT 
        b.id, 
        b.author_id, 
        u.username AS author_username, 
        u.email as author_email,
        b.title, 
        b.slug, 
        b.banner_path, 
        b.description, 
        b.sub_description, 
        b.raw_content, 
        b.content, 
        b.published, 
        b.publish_date, 
        COUNT(c.id)::INT AS comment_count, 
        b.created_at, 
        b.updated_at, 
        b.deleted, 
        b.deleted_at
    FROM 
        blogs b
        JOIN users u ON b.author_id = u.id
        LEFT JOIN comments c ON c.blog_id = b.id AND c.deleted = 0
    WHERE 
        b.id = P_ID AND b.deleted = 0
    GROUP BY 
        b.id, u.username, u.email; 
END;
$$ LANGUAGE plpgsql;



CREATE
OR REPLACE PROCEDURE DELETE_BLOG (P_BLOG_ID INT, P_AUTHOR_ID INT DEFAULT NULL) AS $$
declare
	v_blog_id int;
begin
	select id into v_blog_id from blogs
	where deleted = 0 and 
	id = p_blog_id and 
	(p_author_id is null or author_id = p_author_id)
	limit 1;

	if v_blog_id is null then
		raise exception 'Blog not found' using errcode = 'BNF00';
	end if;

	update blogs set deleted = p_blog_id, deleted_at = current_timestamp where id = p_blog_id;
    update comments set deleted = id, deleted_at = current_timestamp where blog_id = p_blog_id and deleted = 0;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE FUNCTION CREATE_BLOG (
	P_AUTHOR_ID INT,
	P_TITLE VARCHAR,
	P_SLUG VARCHAR,
	P_BANNER_PATH VARCHAR,
	P_DESCRIPTION VARCHAR,
	P_SUB_DESCRIPTION VARCHAR,
	P_RAW_CONTENT TEXT,
	P_CONTENT TEXT,
	P_PUBLISHED BOOL
) 
RETURNS INT
AS $$
declare
	v_user_id int;
	v_blog_id int;
	v_publish_date timestamp with time zone;
    v_id int;
begin
	select id into v_user_id from users where id = p_author_id and deleted = 0;
	if v_user_id is null then
		raise exception 'User not found' using errcode = 'UNF00';
	end if;

	select id into v_blog_id from blogs where (title = p_title or slug = p_slug) and deleted = 0;
	if v_blog_id is not null then
		raise exception 'Blog with title % already exists', p_title using errcode = 'BAE01';
	end if;

	if p_published = true then
		v_publish_date := current_timestamp;
	end if;

	insert into blogs (author_id, title, slug, banner_path, description, sub_description, raw_content, content, published, publish_date) values
	(p_author_id, p_title, p_slug, p_banner_path, p_description, p_sub_description, p_raw_content, p_content, p_published, v_publish_date)
    returning id into v_id;

    return v_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE UPDATE_BLOG (
	P_ID INT,
	P_AUTHOR_ID INT,
	P_ROLE_ID INT,
	P_TITLE VARCHAR,
	P_SLUG VARCHAR,
	P_BANNER_PATH VARCHAR,
	P_DESCRIPTION VARCHAR,
	P_SUB_DESCRIPTION VARCHAR,
	P_RAW_CONTENT TEXT,
	P_CONTENT TEXT,
	P_PUBLISHED BOOL
) AS $$
declare
	v_blog_id int;
	v_author_id int;
	v_publish_date timestamp with time zone;
    v_current_blog record;
begin
	if p_role_id < 2 then
		raise exception 'You are not authorized to update this blog' using errcode = 'BU001';
	end if;

	select id into v_blog_id from blogs where deleted = 0 and id = p_id limit 1;
	if v_blog_id is null then
		raise exception 'Blog not found' using errcode = 'BNF00';
	end if;

	select author_id into v_author_id from blogs where id = p_id and deleted = 0 limit 1;
	if v_author_id <> p_author_id and p_role_id < 3 then
		raise exception 'You are not authorized to update this blog' using errcode = 'BU001';
	end if;

	v_blog_id := null;
	
	select id into v_blog_id from blogs where (title = p_title or slug = p_slug) and deleted = 0 and id <> p_id limit 1;
	if v_blog_id is not null then
		raise exception 'Blog with title % already exists', p_title using errcode = 'BAE01';
	end if;

	if p_published = true then
		v_publish_date := current_timestamp;
	elsif p_published = false then
		v_publish_date := null;
	end if;

    select * into v_current_blog from blogs where id = p_id and deleted = 0;

    if (p_author_id is not null and p_author_id IS DISTINCT FROM v_current_blog.author_id) OR
       (p_title IS DISTINCT FROM v_current_blog.title) OR
       (p_slug IS DISTINCT FROM v_current_blog.slug) OR
       (p_banner_path iS NOT NULL AND p_banner_path IS DISTINCT FROM v_current_blog.banner_path) OR
       (p_description IS DISTINCT FROM v_current_blog.description) OR
       (p_sub_description IS DISTINCT FROM v_current_blog.sub_description) OR
       (p_raw_content IS DISTINCT FROM v_current_blog.raw_content) OR
       (p_content IS DISTINCT FROM v_current_blog.content) OR
       (p_published IS DISTINCT FROM v_current_blog.published) THEN
    
	update blogs set 
	author_id = coalesce(p_author_id, author_id),
	title = p_title, 
	slug = p_slug, 
	banner_path = coalesce(p_banner_path, banner_path), 
	description = p_description, 
	sub_description = p_sub_description, 
	raw_content = p_raw_content, 
	content = p_content, 
	published = p_published, 
	publish_date = v_publish_date, 
	updated_at = current_timestamp 
	where id = p_id;

    end if;
end;
$$ LANGUAGE PLPGSQL;