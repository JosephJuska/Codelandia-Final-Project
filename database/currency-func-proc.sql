create or replace procedure update_currency(
    p_azn decimal,
    p_eur decimal,
    p_try decimal
) as $$
begin
    if (p_azn is distinct from (select azn from currencies where id = 1)) or
        (p_eur is distinct from (select eur from currencies where id = 1)) or
        (p_try is distinct from (select tr from currencies where id = 1)) then

    update currencies
    set azn = p_azn,
        eur = p_eur,
        tr = p_try,
        updated_at = current_timestamp
    where id = 1;

    end if;
end;
$$ language plpgsql;