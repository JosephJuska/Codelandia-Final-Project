import { jwtDecode } from 'jwt-decode';

export default function decodeJWT (token) {
    try{
        const data = jwtDecode(token);
        return data;
    }catch{
        return null;
    }
};