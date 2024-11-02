import { useState } from 'react';
import { Button, Drawer, Layout, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import useWindowSize from '../hooks/useWindowSize';

const { Sider } = Layout;

const Filters = ({ filters, admin=false }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isSmallWindow = useWindowSize(868);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    filters && (
        <>
          {isSmallWindow ? (
            <>
              <Button icon={<MenuOutlined />} onClick={openDrawer} style={{ marginBottom: '16px' }} >Filters</Button>
              <Drawer title="Filters" placement="left" onClose={closeDrawer} open={drawerVisible}>
                <Typography.Title level={2}>Filters</Typography.Title>
                {filters}
              </Drawer>
            </>
          ) : (
            <Sider width={250} style={{ background: admin ? '#f5f5f5' : '#fff', marginRight: '16px', padding: '16px' }}>
              <Typography.Title level={2}>Filters</Typography.Title>
              {filters}
            </Sider>
          )}
        </>
    )
  )
}

export default Filters;