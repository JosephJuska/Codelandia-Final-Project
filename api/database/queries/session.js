const CREATE_SESSION = 'insert into sessions (user_id, session_token) values ($1, $2)';

const FINISH_SESSION = 'call finish_session($1, $2)';

const getSession = (expired) => {
    return `select * from sessions where deleted = 0 and expired = '${expired}' and user_id = $1 and session_token = $2`;
}

module.exports = {
    CREATE_SESSION,

    FINISH_SESSION,

    getSession
}