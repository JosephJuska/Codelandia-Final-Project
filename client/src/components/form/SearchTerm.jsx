import { useEffect, useState } from 'react';
import { Form, Input } from 'antd';

const SearchTerm = ({ searchError, setSearchError, setSearchTerm, validationFunction, placeholder }) => {
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    useEffect(() => {
        const validationHandler = async (value) => {
            setSearchError('');
            const result = await validationFunction(value);
            if(!result.success) setSearchError(result.error);
            else setSearchTerm(value);
        };

        const handler = setTimeout(() => {
            validationHandler(tempSearchTerm);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [tempSearchTerm, setSearchError, setSearchTerm, validationFunction]);

    const handleSearch = (e) => {
        setTempSearchTerm(e.target.value);
    };

  return (
    <Form.Item 
    validateStatus={searchError ? 'error' : ''} 
    help={searchError || ''} 
    style={{ maxWidth: 300, width: 300 }}
    >
        <Input placeholder={placeholder} size="large" allowClear onChange={handleSearch} value={tempSearchTerm} />
    </Form.Item>
  )
}

export default SearchTerm;