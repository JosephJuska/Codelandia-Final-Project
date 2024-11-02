const CREATE_VERIFICATION = 'insert into verifications (user_id, verification_token, account, password, email, deletion, new_email) values ($1, $2, $3, $4, $5, $6, $7)';

const getVerification = (isAccount = null, isPassword = null, isEmail = null, isExpired = null, isConfirmed = null) => {
    let query = 'select * from verifications where user_id = $1';
    if(isAccount !== null) query += ` and account = ${isAccount}`;
    if(isPassword !== null) query += ` and password = ${isPassword}`;
    if(isEmail !== null) query += ` and email = ${isEmail}`;
    if(isExpired !== null) query += ` and expires_at ${isExpired ? '< current_timestamp' : '> current_timestamp'}`;
    if(isConfirmed !== null) query += ` and confirmed = ${isConfirmed}`;
    query += ' and verification_token = $2';

    return query;
};

const confirmVerificationByID = (isAccount = null, isPassword = null, isEmail = null) => {
    let query = 'update verifications set confirmed = true where';
    if(isAccount !== null) query += ` account = ${isAccount}`;
    else if(isPassword !== null) query += ` password = ${isPassword}`;
    else if(isEmail !== null) query += ` email = ${isEmail}`;
    query += ` and id = $1`;

    return query;
};

const getVerificationCount = (isAccount = null, isPassword = null, isEmail = null, isDeleted = null) => {
    let query = 'select count(*) as count from verifications where';
    if(isAccount !== null) query += ` account = ${isAccount}`;
    else if(isPassword !== null) query += ` password = ${isPassword}`;
    else if(isEmail !== null) query += ` email = ${isEmail}`;
    else if(isDeleted !== null) query += ` deleted = ${isDeleted}`;
    query += ' and confirmed = false';
    query += ' and created_at::DATE = CURRENT_DATE'

    return query;
};

module.exports = {
    CREATE_VERIFICATION,

    getVerification,

    confirmVerificationByID,

    getVerificationCount
};