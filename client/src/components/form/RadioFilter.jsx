import { Form, Radio } from 'antd';

const RadioFilter = ({ label, error, setError, validationFunction, value, setValue, options }) => {
  
    const handleChange = async (selectedValue) => {
        setError('');

        const newValue = selectedValue === value ? '' : selectedValue;

        if (validationFunction) {
            const result = await validationFunction(newValue);
            if (!result.success) {
            setError(result.error);
            return;
            }
        }

        setValue(newValue);
    };

  return (
    <Form.Item
        label={label}
        validateStatus={error ? 'error' : ''}
        help={error || ''}
      >
        <Radio.Group value={value} style={{ display: 'flex', flexDirection: 'column', maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }} >
            {options.map(option => {
                return <Radio key={option.value} value={option.value} onClick={async () => await handleChange(option.value)}>{option.label}</Radio>
            })};
        </Radio.Group>
    </Form.Item>
  )
}

export default RadioFilter;