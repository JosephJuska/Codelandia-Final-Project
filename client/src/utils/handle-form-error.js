import errorMessages from "./constants/error-messages";
import showModal from "./show-result-modal";

const handleFormError = (form, result, setModalData, setModalVisible, errorMap = null, index = null) => {
    if(typeof result.error === 'string') showModal(setModalData, setModalVisible, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
    else {
        const fieldErrors = Object.keys(result.error).map(key => {
            const matchedKey = errorMap && Object.keys(errorMap).find(mapKey => errorMap[mapKey].includes(key));
            const name = `${matchedKey || key}${index !== null ? index : ''}`
            return {
                name: name,
                errors: [result.error[key]]
            };
        });

        form.setFields(fieldErrors);

        if (fieldErrors.length > 0) {
            form.scrollToField(fieldErrors[0].name, {
            behavior: 'smooth',
            block: 'center',
            });
        };
    };
};

export default handleFormError;