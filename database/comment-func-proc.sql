CREATE OR REPLACE FUNCTION GET_COMMENTS (
    P_BLOG_ID INT,
    P_SEARCH_TERM VARCHAR,
    P_SORT_BY VARCHAR,
    P_LIMIT INT,
    P_OFFSET INT,
    P_IS_ACTIVE BOOL
) RETURNS TABLE (
    ID INT,
    BLOG_ID INT,
    BLOG_TITLE VARCHAR,
    NAME VARCHAR,
    EMAIL VARCHAR,
    CONTENT VARCHAR,
    CREATED_AT TIMESTAMP with time zone,
    UPDATED_AT TIMESTAMP with time zone,
    DELETED INT,
    DELETED_AT TIMESTAMP with time zone,
    PAGE_COUNT INT
) AS $$
DECLARE
	v_blog_id int;
    v_page_count INT;
    v_total_count INT;
    sort_column VARCHAR;
    sort_order VARCHAR;
BEGIN
    IF P_IS_ACTIVE IS NOT NULL THEN
        SELECT b.id 
        INTO v_blog_id
        FROM blogs AS b
        WHERE 
            b.id = P_BLOG_ID
            AND b.deleted = 0
            AND b.published = P_IS_ACTIVE
        LIMIT 1;

        IF v_blog_id IS NULL THEN
            RAISE EXCEPTION 'Blog not found' USING ERRCODE = 'BNF00';
        END IF;

	ELSE
		SELECT b.id into v_blog_id from blogs as b
		where (p_blog_id is null or b.id = p_blog_id)
		and b.deleted = 0 limit 1;

		IF v_blog_id IS NULL THEN
            RAISE EXCEPTION 'Blog not found' USING ERRCODE = 'BNF00';
		END IF;

    END IF;

    SELECT COUNT(*)::INT
    INTO v_total_count
    FROM comments AS c
    WHERE 
        (P_BLOG_ID IS NULL OR c.blog_id = P_BLOG_ID)
        AND c.deleted = 0
        AND (P_SEARCH_TERM IS NULL OR 
             (c.name ILIKE '%' || P_SEARCH_TERM || '%' OR c.email ILIKE '%' || P_SEARCH_TERM || '%'));

    v_page_count := CEIL(v_total_count / P_LIMIT::FLOAT)::INT;
    IF v_page_count = 0 THEN
        v_page_count := 1;
    END IF;

    sort_column := CASE
        WHEN P_SORT_BY IN ('newest', 'oldest') THEN 'c.created_at'
        WHEN P_SORT_BY IN ('nameASC', 'nameDESC') THEN 'UPPER(c.name)'
        ELSE 'c.created_at'
    END;

    sort_order := CASE
        WHEN P_SORT_BY = 'nameASC' THEN 'ASC'
        WHEN P_SORT_BY = 'nameDESC' THEN 'DESC'
        WHEN P_SORT_BY = 'oldest' THEN 'ASC'
        ELSE 'DESC'
    END;

    RETURN QUERY
    EXECUTE format('
        SELECT 
            c.id, 
            c.blog_id, 
            b.title AS blog_title,
            c.name, 
            c.email, 
            c.content, 
            c.created_at, 
            c.updated_at, 
            c.deleted, 
            c.deleted_at,
            %L::INT AS page_count
        FROM 
            comments AS c
        JOIN 
            blogs AS b ON c.blog_id = b.id
        WHERE 
            (%L IS NULL OR b.id = %L)
            AND c.deleted = 0
            AND (%L IS NULL OR (c.name ILIKE %L OR c.email ILIKE %L))
        ORDER BY 
            %s %s
        LIMIT %s OFFSET %s',
        v_page_count,
        P_BLOG_ID,
        P_BLOG_ID,
        P_SEARCH_TERM,
        '%' || P_SEARCH_TERM || '%',
        '%' || P_SEARCH_TERM || '%',
        sort_column,
        sort_order,
        P_LIMIT,
        P_OFFSET
    );
END;
$$ LANGUAGE plpgsql;



CREATE
OR REPLACE FUNCTION CREATE_COMMENT (
	P_NAME VARCHAR,
	P_EMAIL VARCHAR,
	P_CONTENT VARCHAR,
	P_ID INT
) 
RETURNS INT
AS $$
declare
	v_blog_id int;
	v_comment_id int;
    v_id int;
begin
	select id into v_blog_id from blogs where 
	deleted = 0 and 
	published = true and 
	id = p_id limit 1;

	if v_blog_id is null then
		raise exception 'Blog not found' using errcode = 'BNF00';
	end if;

	select id into v_comment_id from comments where
	deleted = 0 and
	email = p_email
	limit 1;

	if v_comment_id is not null then
		raise exception 'Comment with email % already exists', p_email using errcode = 'CAE01';
	end if;

	insert into comments (name, email, content, blog_id) values (p_name, p_email, p_content, p_id)
    returning id into v_id;

    return v_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE DELETE_COMMENT (P_ID INT) AS $$
declare
	v_comment_id int;
begin
	select id into v_comment_id from comments where deleted = 0 and id = p_id;
	if v_comment_id is null then
		raise exception 'Comment not found' using errcode = 'CNF00';
	end if;

	update comments set
	deleted = id,
	deleted_at = current_timestamp where id = p_id;
end;
$$ LANGUAGE PLPGSQL;