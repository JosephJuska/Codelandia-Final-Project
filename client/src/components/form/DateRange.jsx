import { Form, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const DateRange = ({ label, dateError, handleDateChange, format='YYYY-MM-DD' }) => {
  
  return (
    <Form.Item 
        validateStatus={dateError ? 'error' : ''} 
        help={dateError || ''} 
        style={{ marginBottom: 16 }}
        label={label}
        >
        <RangePicker format={format} onChange={handleDateChange} style={{ maxWidth: 250 }} />
    </Form.Item>
  )
}

export default DateRange;