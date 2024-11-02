import { Form, Select } from 'antd';

const SelectorFilter = ({ label, placeholder, error, setError, validationFunction, value, setValue, options, maxCount = 1, multiple = true }) => {
  const handleChangeMultiple = async (values) => {
    setError('');
    const newValues = Object.values(values);
    if(validationFunction) {
        const result = await validationFunction(newValues);
        if(!result.success) {
            setError(result.error);
            return;
        }
    };

    setValue(values);
  };

  const handleChange = async (value) => {
    setError('');
    value = value || '';
    if(validationFunction) {
        const result = await validationFunction(value);
        if(!result.success) {
            setError(result.error);
            return;
        }
    };

    setValue(value);
  };

  return (
    <>
    {multiple &&
      <Form.Item
          label={label}
          validateStatus={error ? 'error' : ''}
          help={error || ''}
      >
          <Select placeholder={placeholder} options={options} mode='tags' value={value} onChange={handleChangeMultiple} showSearch optionFilterProp='label' allowClear maxTagCount={maxCount} maxCount={maxCount} />
      </Form.Item>
    }

    {!multiple && 
      <Form.Item
        label={label}
        validateStatus={error ? 'error' : ''}
        help={error || ''}
      >
        <Select placeholder={placeholder} options={options} value={value} onChange={handleChange} showSearch optionFilterProp='label' allowClear />
      </Form.Item>
    }
    </>
  )
};

export default SelectorFilter;