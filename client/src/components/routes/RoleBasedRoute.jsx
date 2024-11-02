import React from 'react'
import isCorrectRole from '../../utils/isCorrectRole';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, loginPath, redirectPath, roleID }) => {
    const roleIsCorrect = isCorrectRole(roleID);
    if(!roleIsCorrect.success && roleIsCorrect.isAuthError) return <Navigate to={loginPath}/>
    if(!roleIsCorrect.success) return <Navigate to={redirectPath} />;

    return children;
};

export default RoleBasedRoute