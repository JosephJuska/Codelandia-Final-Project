import { Button, Typography } from 'antd';
import Refresh from './Refresh';

const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: '16px', 
    flexWrap: 'wrap', 
    marginBottom: '16px' 
}; 

const DataPageHeader = ({ title, buttonText, buttonLink, buttonFunction, navigate, fetchData }) => {
  return (
    <>
      <div style={headerStyle}>
        <Typography.Title level={1} style={{ margin: 0 }}>{title}</Typography.Title>
        {(buttonLink || buttonFunction) && 
          <Button type="primary" onClick={buttonLink ? () => navigate(buttonLink) : buttonFunction ? buttonFunction : null}>{buttonText}</Button>
        }
      </div>

      <Refresh fetchData={fetchData} />
    </>
  )
};

export default DataPageHeader;