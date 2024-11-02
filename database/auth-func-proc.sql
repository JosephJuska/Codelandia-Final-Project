CREATE
OR REPLACE FUNCTION CREATE_USER (
	P_FIRST_NAME VARCHAR(50),
	P_LAST_NAME VARCHAR(50),
	P_USERNAME VARCHAR(50),
	P_EMAIL VARCHAR(300),
	P_PASSWORD VARCHAR(255),
	P_ROLE_ID INT,
	P_VERIFIED BOOL,
	P_IS_ACTIVE BOOL
) RETURNS INT AS $$
declare
	v_user_id int;
begin
	select id into v_user_id from users where deleted = 0 and email = p_email limit 1;
	if v_user_id is not null then
		raise exception 'User with email % already exists', p_email using errcode = 'UAE01';
	end if;

	v_user_id := null;

	select id into v_user_id from users where deleted = 0 and (p_username is not null and username = p_username) limit 1;
	if v_user_id is not null then
		raise exception 'User with username % already exists', p_username using errcode = 'UAE02';
	end if;
	
	insert into users (first_name, last_name, username, email, password, role_id, verified, is_active) values 
	(p_first_name, p_last_name, p_username, p_email, p_password, p_role_id, p_verified, p_is_active) returning id into v_user_id;
	return v_user_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION get_account_details_writer(
	p_id INT
) RETURNS TABLE (
    id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    username VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP with time zone,
    updated_at TIMESTAMP with time zone,
    total_blogs INT,
    published_blogs INT,
    unpublished_blogs INT,
    total_comments INT
)  AS $$
DECLARE
	v_user_id int;
BEGIN
	select u.id into v_user_id from users u where u.id = p_id and u.deleted = 0 and u.verified = true and u.is_active = true and u.role_id >= 2;
	if v_user_id is null then
		raise exception 'Writer not found' using errcode = 'UNF00';
	end if;

    RETURN QUERY
    SELECT
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.created_at,
        u.updated_at,
        COALESCE(total_blogs.total, 0) AS total_blogs,
        COALESCE(published_blogs.published, 0) AS published_blogs,
        COALESCE(total_blogs.total, 0) - COALESCE(published_blogs.published, 0) AS unpublished_blogs,
        COALESCE(total_comments.total, 0) AS total_comments
    FROM
        users u
    LEFT JOIN (
        SELECT
            author_id,
            COUNT(*)::INT AS total
        FROM
            blogs
        WHERE
            author_id = p_id
            AND deleted = 0
        GROUP BY
            author_id
    ) total_blogs ON u.id = total_blogs.author_id
    LEFT JOIN (
        SELECT
            author_id,
            COUNT(*)::INT AS published
        FROM
            blogs
        WHERE
            author_id = p_id
            AND published = TRUE
            AND deleted = 0
        GROUP BY
            author_id
    ) published_blogs ON u.id = published_blogs.author_id
    LEFT JOIN (
        SELECT
            b.author_id,
            COUNT(*)::INT AS total
        FROM
            comments c
        JOIN
            blogs b ON c.blog_id = b.id
        WHERE
            b.author_id = p_id
            AND c.deleted = 0
        GROUP BY
            b.author_id
    ) total_comments ON u.id = total_comments.author_id
    WHERE
        u.id = p_id
    AND u.deleted = 0;
END;
$$ LANGUAGE plpgsql;



create or replace procedure update_account(
    p_id int,
    p_first_name varchar,
    p_last_name varchar,
    p_username varchar,
    p_password varchar
) as $$
declare
    v_user_id int;
begin
    select id into v_user_id from users where deleted = 0 and p_username is not null and username = p_username and id <> p_id;
    if v_user_id is not null and p_username is not null then
        raise exception 'User with username %s already exists', p_username using errcode = 'UAE01';
    end if;

    update users set first_name = COALESCE(p_first_name, first_name), last_name = COALESCE(p_last_name, last_name), 
    username = p_username, password = COALESCE(p_password, password) where id = p_id;
end;
$$ language plpgsql;