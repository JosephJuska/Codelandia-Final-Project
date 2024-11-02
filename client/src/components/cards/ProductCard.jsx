import { useState } from 'react';
import { Card, Image, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import Color from '../Color';
import getDateInString from '../../utils/get-date-in-string';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const ProductCard = ({ item, confirmDelete, navigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const initialImagePaths = item?.productItems?.[0]?.imagePaths || [];
  const [currentImagePaths, setCurrentImagePaths] = useState(initialImagePaths);

  const handleColorClick = (imagePaths) => {
    setCurrentImagePaths(imagePaths);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImagePaths.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + currentImagePaths.length) % currentImagePaths.length
    );
  };

  const getPriceDisplay = () => {
    if (item.discountPercentage) {
      const discountAmount = (item.basePrice * item.discountPercentage) / 100;
      const newPrice = (item.basePrice - discountAmount).toFixed(2);
      return (
        <div>
          <span style={{ color: 'red', fontWeight: 'bold' }}>${newPrice}</span>
          <span style={{ textDecoration: 'line-through', marginLeft: '8px' }}>${item.basePrice}</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>({item.discountPercentage}% off)</span>
          <Paragraph><Link to={`/admin/discount/${item.discountID}`}>View Discount</Link></Paragraph>
        </div>
      );
    }
    return <span>${item.basePrice}</span>;
  };

  const colorItems = item.productItems || [];
  return (
    <Card
      style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          {currentImagePaths.length > 0 ? (
            <Image
              alt={item.name}
              src={currentImagePaths[currentImageIndex]}
              style={{ width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1/1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
              }}
            >
              <span>No Image Available</span>
            </div>
          )}

          {currentImagePaths.length > 1 && (
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={prevImage} style={{ background: 'rgba(255, 255, 255, 0.7)', border: 'none', cursor: 'pointer', padding: '5px' }}>❮</button>
              <button onClick={nextImage} style={{ background: 'rgba(255, 255, 255, 0.7)', border: 'none', cursor: 'pointer', padding: '5px' }}>❯</button>
            </div>
          )}
        </div>
      }
      actions={[
        <EyeOutlined key='details' style={{ fontSize: '20px' }} onClick={() => navigate('/admin/product/' + item.id)} />,
        <DeleteOutlined style={{ fontSize: '20px' }} key='delete' onClick={() => confirmDelete(item.id)} />
      ]}
    >
      <Card.Meta
        title={<Title level={4} onClick={() => navigate('/admin/product/' + item.id)}>{item.name}</Title>}
        description={
          <>
            <Paragraph>{getPriceDisplay()}</Paragraph>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {colorItems.length > 0 ? (
                colorItems.map((productItem, index) => (
                  <Color 
                    key={index}
                    onClick={() => handleColorClick(productItem.imagePaths)}
                    color1={productItem.colour1}
                    color2={productItem.colour2}
                    color3={productItem.colour3}
                  />
                ))
              ) : (
                <span>No Colors Available</span>
              )}
            </div>
            <Paragraph>Brand: <Link to={`/admin/brand/${item.brandID}`} >{item.brandName}</Link></Paragraph>
            <Paragraph>Category: <Link to={`/admin/category/${item.categoryID}`} >{item.categoryName}</Link></Paragraph>
            <Paragraph>Rating: {item.rating !== 0 ? `${item.rating}/5` : 'Not Rated'}</Paragraph>
            <Paragraph>Is Active: {item.isActive ? 'yes' : 'no'}</Paragraph>
            <Paragraph>Created At: {getDateInString(item.createdAt)}</Paragraph>
            <Paragraph>Updated At: {item?.updatedAt ? getDateInString(item.updatedAt) : 'Not Updated'}</Paragraph>
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;