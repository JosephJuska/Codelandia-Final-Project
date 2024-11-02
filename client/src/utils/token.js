function setCookie(name, value, minutes, httpOnly = false) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    let cookieString = `${name}=${value}; expires=${expires}; path=/;`;

    if (httpOnly) {
        cookieString += ' HttpOnly;';
    }

    document.cookie = cookieString;
};

function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function getAccessToken() {
    const match = document.cookie.match(new RegExp('(^| )' + 'accessToken' + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

export function getRefreshToken() {
    const match = document.cookie.match(new RegExp('(^| )' + 'refreshToken' + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

export function setAccessToken(accessToken) {
    setCookie('accessToken', accessToken, 15); // 15 minutes
};

export function setRefreshToken(refreshToken) {
    setCookie('refreshToken', refreshToken, 7 * 24 * 60); // 7 days
};

export function removeAccessToken() {
    removeCookie('accessToken');
};

export function removeRefreshToken() {
    removeCookie('refreshToken');
};

export function clearAllTokens() {
    removeAccessToken();
    removeRefreshToken();
};