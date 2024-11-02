create or replace procedure create_subscriber(
    p_email varchar,
    token varchar
) as $$ 
declare
    v_subscriber_id int;
    v_is_subscribed boolean;
begin
    select id, subscribed into v_subscriber_id, v_is_subscribed from subscribers where email = p_email and deleted = 0 limit 1;
    if v_is_subscribed is not null and v_is_subscribed is not true then
        raise exception 'Subscriber with email % is already subscribed', p_email using errcode = 'SAE00';
    end if;

    if v_is_subscribed is not null and v_is_subscribed is true then
        update subscribers set subscribed = true, updated_at = current_timestamp where id = v_subscriber_id;
    elsif v_is_subscribed is null then
        insert into subscribers (email, token) values (p_email, p_token);
    end if;
end;
$$ language plpgsql;



create or replace procedure unsubscribe(
    p_token varchar
) as $$
declare
    v_subscriber_id int;
begin
    select id into v_subscriber_id from subscribers where deleted = 0 and subscribed = true and token = p_token limit 1;
    if v_subscriber_id is null then 
        raise exception 'Subscriber not found' using errcode = 'SNF00';
    end if;

    update subscribers set subscribed = false, updated_at = current_timestamp where id = v_subscriber_id;
end;
$$ language plpgsql;