import { Form, Checkbox } from 'antd';

const CheckboxFilter = ({ label, error, setError, validationFunction, value, setValue, options }) => {
  
    const handleChange = async (selectedValues) => {
        setError(''); // Reset error initially

        // If there's a validation function, validate the new values
        if (validationFunction) {
            const result = await validationFunction(selectedValues);
            if (!result.success) {
                setError(result.error);
                return;
            }
        }

        // Update the selected values
        setValue(selectedValues);
    };

    return (
        <Form.Item
            label={label}
            validateStatus={error ? 'error' : ''}
            help={error || ''}
        >
            <Checkbox.Group 
                value={value} 
                style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }} 
                onChange={handleChange}
            >
                {options.map(option => {
                    return <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                })}
            </Checkbox.Group>
        </Form.Item>
    )
}

export default CheckboxFilter;