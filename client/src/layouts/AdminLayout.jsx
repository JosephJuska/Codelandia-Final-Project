import { Layout, Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { EditOutlined, ShopOutlined, TeamOutlined, PictureOutlined, SoundOutlined, DatabaseOutlined, TagsOutlined, CommentOutlined, PercentageOutlined, ProductOutlined, LikeOutlined, DollarOutlined } from '@ant-design/icons';
import ScrollProgress from '../components/ScrollProgress';
import AdminSider from '../components/AdminSider';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminMain from './AdminMain';
import { useEffect, useState } from 'react';

const AdminLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();

  const generateCRUDMenuItem = (key, icon, pageLink, createLink) => {
    const capitalizeString = (str, plural = false) => {
      let newStr = str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
  
      if (plural) {
          if (newStr[newStr.length - 1] === 'y') {
              newStr = newStr.slice(0, -1) + 'ies';
          } else {
              newStr += 's'
          }
      }
  
      return newStr;
    };
  
    return {
      key: key,
      icon: icon,
      label: capitalizeString(key),
      children: [
        {
          key: `${key}-page`,
          label: <NavLink to={pageLink} onClick={() => setDrawerVisible(false)} >All {capitalizeString(key, true)}</NavLink>
        },
        createLink && 
        {
          key: `${key}-create`,
          label: <NavLink to={createLink} onClick={() => setDrawerVisible(false)} >Create {capitalizeString(key)}</NavLink>
        }
      ]
    }
  };

  const menuItems = [
    generateCRUDMenuItem('blog', <EditOutlined />, '/admin/blog', '/admin/blog/create'),

    generateCRUDMenuItem('brand', <ShopOutlined />, '/admin/brand', '/admin/brand/create'),

    generateCRUDMenuItem('team member', <TeamOutlined />, '/admin/team-member', '/admin/team-member/create'),

    generateCRUDMenuItem('banner', <PictureOutlined />, '/admin/banner', '/admin/banner/create'),

    generateCRUDMenuItem('announcement', <SoundOutlined />, '/admin/announcement', '/admin/announcement/create'),

    generateCRUDMenuItem('product type', <DatabaseOutlined />, '/admin/product-type'),

    generateCRUDMenuItem('category', <TagsOutlined />, '/admin/category', '/admin/category/create'),

    generateCRUDMenuItem('user', <TeamOutlined />, '/admin/user', '/admin/user/create'),

    generateCRUDMenuItem('comment', <CommentOutlined />, '/admin/comment', '/admin/comment/create'),

    generateCRUDMenuItem('discount', <PercentageOutlined />, '/admin/discount', '/admin/discount/create'),

    generateCRUDMenuItem('product', <ProductOutlined />, '/admin/product', '/admin/product/create'),

    generateCRUDMenuItem('review', <LikeOutlined />, '/admin/review', '/admin/review/create'),

    generateCRUDMenuItem('currency', <DollarOutlined />, '/admin/currency')
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedKey = menuItems
      .flatMap(item => (item.children ? item.children : item)) 
      .find(item => item?.label?.props?.to === currentPath)?.key;
  
    setActiveItem(selectedKey); 
  }, [location.pathname]);

  const renderMenu = () => <Menu theme="dark" mode="inline" selectedKeys={activeItem} items={menuItems} />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <AdminSider renderCallback={renderMenu} />
      <Layout style={{ display: 'flex', flexDirection: 'column' }}>
        <AdminHeader renderCallback={renderMenu} drawerVisible={drawerVisible} setDrawerVisible={setDrawerVisible} />
        <AdminMain />
        <AdminFooter />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;