create or replace function create_team_member (
    p_full_name varchar,
    p_job_position varchar,
    p_short_description varchar,
    p_facebook_link varchar,
    p_twitter_link varchar,
    p_youtube_link varchar,
    p_pinterest_link varchar,
    p_instagram_link varchar,
    p_image_path varchar
) 
returns int
as $$
declare
    v_id int;
begin
    insert into team_members(full_name, job_position, short_description, facebook_link, twitter_link, youtube_link, pinterest_link, instagram_link, image_path) 
    values (p_full_name, p_job_position, p_short_description, p_facebook_link, p_twitter_link, p_youtube_link , p_pinterest_link, p_instagram_link, p_image_path)
    returning id into v_id;

    return v_id;
end;
$$ language plpgsql;



create or replace procedure update_team_member (
    p_id int,
    p_full_name varchar,
    p_job_position varchar,
    p_short_description varchar,
    p_facebook_link varchar,
    p_twitter_link varchar,
    p_youtube_link varchar,
    p_pinterest_link varchar,
    p_instagram_link varchar,
    p_image_path varchar
) as $$
declare
    v_team_member_id int;
    v_current_team_member record;
begin
    select id into v_team_member_id from team_members where id = p_id and deleted = 0 limit 1;
    if v_team_member_id is null then
        raise exception 'Team member not found' using errcode = 'TMNF0';
    end if;

    select * into v_current_team_member from team_members where id = p_id;

    if (p_full_name is distinct from v_current_team_member.full_name) or
        (p_job_position is distinct from v_current_team_member.job_position) or
        (p_short_description is distinct from v_current_team_member.short_description) or
        (p_facebook_link is distinct from v_current_team_member.facebook_link) or
        (p_twitter_link is distinct from v_current_team_member.twitter_link) or
        (p_youtube_link is distinct from v_current_team_member.youtube_link) or
        (p_pinterest_link is distinct from v_current_team_member.pinterest_link) or
        (p_instagram_link is distinct from v_current_team_member.instagram_link) or
        (p_image_path is not null and p_image_path is distinct from v_current_team_member.image_path) then

    update team_members set full_name = p_full_name, job_position = p_job_position, short_description = p_short_description,
    facebook_link = p_facebook_link, twitter_link = p_twitter_link, youtube_link = p_youtube_link, pinterest_link = p_pinterest_link,
    instagram_link = p_instagram_link, image_path = coalesce(p_image_path, image_path), updated_at = current_timestamp where id = p_id;

    end if;
end;
$$ language plpgsql;



create or replace procedure delete_team_member (
    p_id int
) as $$
declare
    v_team_member_id int;
begin
    select id into v_team_member_id from team_members where id = p_id and deleted = 0 limit 1;
    if v_team_member_id is null then
        raise exception 'Team member not found' using errcode = 'TMNF0';
    end if;

    update team_members set deleted = id, deleted_at = current_timestamp where id = p_id;
end;
$$ language plpgsql;



create or replace function get_team_members()
returns table (like team_members) as $$
begin
    return query
    select * from team_members where deleted = 0;
end;
$$ language plpgsql;



create or replace function get_team_member_by_id(
    p_id int
) returns table (
    id int,
    full_name varchar,
    job_position varchar,
    short_description varchar,
    facebook_link varchar,
    twitter_link varchar,
    youtube_link varchar,
    pinterest_link varchar,
    instagram_link varchar,
    image_path varchar,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted int,
    deleted_at timestamp with time zone
) as $$
declare
    v_team_member_id int;
begin
    select tm.id into v_team_member_id from team_members as tm where tm.id = p_id and tm.deleted = 0;
    if v_team_member_id is null then
        raise exception 'Team member not found' using errcode = 'TMNF0';
    end if;
    
    return query
    select * from team_members as tm where tm.id = p_id;
end;
$$ language plpgsql;