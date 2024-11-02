const CREATE_USER = 'select create_user($1, $2, $3, $4, $5, $6, $7, $8) as id';

const GET_USERS = 'select * from get_users($1, $2, $3, $4, $5, $6, $7, $8)';

const GET_OWNERS = 'select * from users where deleted = 0 and verified = true and is_active = true and role_id = any(ARRAY[2,3]) order by username';

const CLEAR_UNVERIFIED_USERS = 'select clear_unverified_users() as affected_count';

const getUserByID = (verified = null, isActive = null) => {
    let query = 'select * from users where id = $1 and deleted = 0';
    if(verified !== null) query += ` and verified = ${verified}`;
    if(isActive !== null) query += ` and is_active = ${isActive}`;

    return query;
};

const getUserByEmail = (verified = null, isActive = null, roleID = null) => {
    let query = 'select * from users where deleted = 0 and email = $1';
    if(verified !== null) query += ` and verified = ${verified}`;
    if(isActive !== null) query += ` and is_active = ${isActive}`;
    if(roleID !== null) query += ` and role_id >= ${roleID}`;

    return query;
};

const GET_USER_EMAIL_BY_ID = 'select email from users where deleted = 0 and id = $1'; 

const GET_USER_BY_USERNAME_OR_EMAIL = 'select * from users where deleted = 0 and role_id = $2 and email = $1 or username = $1';
const GET_WRITER_DETAILS = 'select * from get_account_details_writer($1)';

const UPDATE_USER_EMAIL = 'update users set email = $1, updated_at = current_timestamp where deleted = 0 and verified = true and is_active = true and id = $2';
const UPDATE_USER_PASSWORD = 'update users set password = $1, updated_at = current_timestamp where deleted= 0 and verified = true and is_active = true and id = $2';
const UPDATE_ACCOUNT = 'call update_account($1, $2, $3, $4, $5, $6, $7, $8, $9)';

const VERIFY_USER = 'update users set verified = true where deleted = 0 and verified = false and is_active = true and id = $1';

const VERIFY_AND_UPDATE_EMAIL = 'call verify_and_update_email($1, $2)';
const VERIFY_AND_UPDATE_ACCOUNT = 'call verify_and_update_account($1, $2)';
const VERIFY_AND_UPDATE_PASSWORD = 'call verify_and_update_password($1, $2, $3)';

const DELETE_USER = 'call delete_user($1)';

module.exports = {
    getUserByEmail,
    GET_USER_BY_USERNAME_OR_EMAIL,
    GET_WRITER_DETAILS,
    GET_USER_EMAIL_BY_ID,
    GET_USERS,
    GET_OWNERS,

    CREATE_USER,

    UPDATE_USER_EMAIL,
    UPDATE_USER_PASSWORD,
    UPDATE_ACCOUNT,

    VERIFY_USER,

    CLEAR_UNVERIFIED_USERS,

    getUserByID,

    VERIFY_AND_UPDATE_EMAIL,
    VERIFY_AND_UPDATE_ACCOUNT,
    VERIFY_AND_UPDATE_PASSWORD,

    DELETE_USER
};