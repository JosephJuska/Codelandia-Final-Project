CREATE
OR REPLACE PROCEDURE VERIFY_AND_UPDATE_PASSWORD (P_USER_ID INT, P_TOKEN VARCHAR, P_PASSWORD VARCHAR) AS $$
declare
    v_user_id int;
    v_verification_id int;
begin
    select id into v_user_id 
    from users 
    where 
        deleted = 0 and 
        is_active = true and 
        verified = true and
        id = p_user_id
    limit 1;

    if v_user_id is null then
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    select id into v_verification_id
    from verifications 
    where 
        confirmed = false and
		password = true and
        expires_at > current_timestamp and
        user_id = p_user_id and
        verification_token = p_token
    limit 1;

    if v_verification_id is null then
        raise exception 'Verification not found' using errcode = 'VNF00';
    end if;

    update users 
    set password = p_password, updated_at = current_timestamp 
    where id = p_user_id;

    update verifications 
    set confirmed = true 
    where id = v_verification_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE VERIFY_AND_UPDATE_ACCOUNT (P_USER_ID INT, P_TOKEN VARCHAR) AS $$
declare
    v_user_id int;
    v_verification_id int;
begin
    select id into v_user_id 
    from users 
    where 
        deleted = 0 and 
        is_active = true and 
        verified = false and
        id = p_user_id
    limit 1;

    if v_user_id is null then
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    select id into v_verification_id
    from verifications 
    where 
        confirmed = false and
		account = true and
        expires_at > current_timestamp and
        user_id = p_user_id and
        verification_token = p_token
    limit 1;

    if v_verification_id is null then
        raise exception 'Verification not found' using errcode = 'VNF00';
    end if;

    update users 
    set verified = true, updated_at = current_timestamp 
    where id = p_user_id;

    update verifications 
    set confirmed = true 
    where id = v_verification_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE
OR REPLACE PROCEDURE VERIFY_AND_UPDATE_EMAIL (P_USER_ID INT, P_TOKEN VARCHAR) AS $$
declare
    v_user_id int;
    v_verification_id int;
    v_new_email varchar;
begin
    select id into v_user_id 
    from users 
    where 
        deleted = 0 and 
        is_active = true and 
        verified = true and
        id = p_user_id
    limit 1;

    if v_user_id is null then
        raise exception 'User not found' using errcode = 'UNF00';
    end if;

    select id, new_email into v_verification_id, v_new_email 
    from verifications 
    where 
        confirmed = false and
		email = true and
        expires_at > current_timestamp and
        user_id = p_user_id and
        verification_token = p_token
    limit 1;

    if v_verification_id is null then
        raise exception 'Verification not found' using errcode = 'VNF00';
    end if;

    v_user_id := null;

    select id into v_user_id from users where deleted = 0 and is_active = true and email = v_new_email limit 1;

    if v_user_id is not null then
        raise exception 'User with email % already exists', v_new_email using errcode = 'UAE01';
    end if;

    update users 
    set email = v_new_email, updated_at = current_timestamp 
    where id = p_user_id;

    update verifications 
    set confirmed = true 
    where id = v_verification_id;
end;
$$ LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION clear_unverified_users()
RETURNS int
AS $$
DECLARE
    v_affected_count int;
BEGIN
    UPDATE users
    SET deleted = id,
        deleted_at = current_timestamp
    WHERE deleted = 0
      AND verified = false
      AND created_at < NOW() - INTERVAL '30 minutes';

    GET DIAGNOSTICS v_affected_count = ROW_COUNT;

    RETURN v_affected_count;
END;
$$ LANGUAGE plpgsql;