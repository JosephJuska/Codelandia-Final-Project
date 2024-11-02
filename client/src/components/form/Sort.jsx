import { Form, Select } from 'antd';

const Sort = ({ sortError, setSortError, sortValue, setSortValue, options, validationFunction }) => {
    
  const handleSortChange = async (value) => {
    setSortError('');
    const result = await validationFunction(value);
    if(!result.success) setSortError(result.error);
    else setSortValue(result.data);
  };

  return (
    <Form.Item
    validateStatus={sortError ? 'error' : ''}
    help={sortError || ''}
    label='Sort By:'
    >
    <Select
        value={sortValue}
        placeholder="Sort By"
        style={{ width: 150, marginRight: '16px' }}
        onChange={handleSortChange}
    >
        {options.map(option => {
            return <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option> 
        })}
    </Select>
    </Form.Item>
  )
}

export default Sort;