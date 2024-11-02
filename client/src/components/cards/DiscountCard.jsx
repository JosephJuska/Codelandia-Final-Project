import { Card, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import getDateInString from '../../utils/get-date-in-string';
import { Link } from 'react-router-dom';

const { Paragraph } = Typography;

const DiscountCard = ({ item, confirmDelete, navigate }) => {
  return (
    <Card
    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    hoverable
    actions={[
        <EyeOutlined key="details" style={{ fontSize: '20px' }} onClick={() => navigate('/admin/discount/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key="delete" onClick={() => confirmDelete(item.id)} />
    ]}
    >
    <Card.Meta
        title={item.discountPercentage + '%'}
        description={<>
          <Paragraph>Is Active: {item.isActive ? 'Yes' : 'No'}</Paragraph>
          <Paragraph>Start Date: {getDateInString(item.startDate, true)}</Paragraph>
          <Paragraph>End Date: {getDateInString(item.endDate, true)}</Paragraph>
          <Paragraph>Brand Name: <Link to={item?.brandID ? `/admin/brand/${item.brandID}` : ''}>{item?.brandName || 'No Brand'}</Link></Paragraph>
          <Paragraph>Category Name: <Link to={item?.categoryID ? `/admin/category/${item.categoryID}` : ''}>{item?.categoryName || 'No Category'}</Link></Paragraph>
          <Paragraph>Product Name: <Link to={item?.productID ? `/admin/product/${item.productID}` : ''}>{item?.productName || 'No Product'}</Link></Paragraph>
          <Paragraph>Product Type Name: <Link to={item?.productTypeID ? `/admin/brand/${item.productTypeID}` : ''}>{item?.productTypeName || 'No Product Type'}</Link></Paragraph>
          <Paragraph>Created At: {getDateInString(item?.createdAt)}</Paragraph>
          <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt) : 'Not Updated'}</Paragraph>
        </>
        }
    />
    
    </Card>
  )
};

export default DiscountCard;