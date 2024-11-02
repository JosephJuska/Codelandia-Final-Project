export default function requestHandler(result, navigate, unauthorizedRedirect = null, forbiddenRedirect = null) {
    if(!result.success && result.unauthorized && unauthorizedRedirect){
        navigate(unauthorizedRedirect);
        return;
    }

    if(!result.success && result.forbidden && forbiddenRedirect){
        navigate(forbiddenRedirect);
        return;
    }
};