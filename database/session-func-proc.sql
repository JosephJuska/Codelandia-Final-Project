CREATE
OR REPLACE PROCEDURE FINISH_SESSION (
	P_USER_ID INT,
	P_TOKEN VARCHAR
) AS $$
declare
    v_session_id int;
begin
    select id into v_session_id
    from sessions
    where deleted = 0 
    and user_id = p_user_id 
    and session_token = p_token
    limit 1;

    if v_session_id is null then
        raise exception 'Session not found' using errcode = 'SNF00';
    end if;

    update sessions 
    set expired = true, updated_at = current_timestamp 
    where id = v_session_id;
end;
$$ LANGUAGE PLPGSQL;