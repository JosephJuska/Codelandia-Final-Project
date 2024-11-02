// import { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Layout, Modal, Button, Alert, Collapse, Image } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import requestHandler from '../../utils/request-handler';
// import DataPageHeader from '../../components/DataPageHeader';
// import getCategories from '../../requests/category/get-categories';
// import deleteCategory from '../../requests/category/delete-category';
// import NotFound from '../../components/NotFound';
// import showModal from '../../utils/show-result-modal';
// import ResultModal from '../../components/ResultModal';
// import errorMessages from '../../utils/constants/error-messages';
// import Spinner from '../../components/Spinner';
// import Paragraph from 'antd/es/skeleton/Paragraph';
// import { Link } from 'react-router-dom';
// import getDateInString from '../../utils/get-date-in-string';

// const { Content } = Layout;
// const { Panel } = Collapse;

// const CategoryPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [modalVisible, setModalVisible] = useState(false);
//   const [deletedID, setDeletedID] = useState(null);

//   const [modalData, setModalData] = useState(null);
//   const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  
//   const navigate = useNavigate();

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     const response = await getCategories();
//     requestHandler(response, navigate, '/admin/login', '/');
//     if (!response.success) {
//         setError(response.error);
//         setLoading(false);
//         return;
//     };
    
//     setData(response?.data && response?.data?.length > 0 ? response.data : null);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, [])

//   const confirmDelete = (id) => {
//     setDeletedID(id);
//     setModalVisible(true);
//   };

//   const cancelDelete = () => {
//     setDeletedID(null);
//     setModalVisible(false);
//   };

//   const handleCategoryDelete = async () => {
//     setModalVisible(false);
//     const result = await deleteCategory(deletedID);
//     setDeletedID(null);
//     requestHandler(result, navigate, '/admin/login', '/');
//     if (!result.success) {
//       showModal(setModalData, setModalVisibleDelete, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
//       return;
//     };

//     showModal(setModalData, setModalVisibleDelete, 'success', 'Category deleted successfully');
//     fetchData();
//   };

//   const renderCollapsePanels = (categories) =>
//     categories.map(category => (
//       <Panel
//         collapsible='icon'
//         key={category.id}
//         header={
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div
//               style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
//             >
//               <Image
//                 src={category.imagePath}
//                 alt={category.name}
//                 style={{ maxWidth: 150, width: '100%' }}
//               />
//               <Paragraph>Product Type: <Link to={"/admin/product-type/" + category.productTypeID}>{category.productTypeName}</Link></Paragraph>
//               <Paragraph>Created At: {getDateInString(category.createdAt)}</Paragraph>
//               <Paragraph>Updated At: {category?.updatedAt ? getDateInString(category.updatedAt) : 'Not Updated'}</Paragraph>
//               <span onClick={() => navigate('/admin/category/' + category.id)} style={{ cursor: 'pointer' }} >{category.name}</span>
//             </div>
//             <Button
//               type="link"
//               danger
//               onClick={() => confirmDelete(category.id)}
//               style={{ marginLeft: '10px' }}
//             >
//               Delete
//             </Button>
//           </div>
//         }
//       >
//         {category.children.length > 0 && (
//           <Collapse>{renderCollapsePanels(category.children)}</Collapse>
//         )}
//       </Panel>
//     ));


//   return (
//     <Layout style={{ background: 'none' }}>
//       <Helmet>
//         <title>Category Page</title>
//       </Helmet>
//       <Content>
//         <DataPageHeader 
//           title='Categories' 
//           buttonText='Create Category' 
//           buttonLink='/admin/category/create' 
//           navigate={navigate}
//           fetchData={fetchData} 
//         />

//         <Layout style={{ background: 'none' }}>
//             {loading && <Spinner />}
//             {!data && <NotFound description={'No Categories Found'} />}
//             {data && 
//             <Collapse>
//                 {renderCollapsePanels(data)}
//             </Collapse>
//             }
//             {error && <Alert message="Error" description={error} type="error" showIcon />}
//         </Layout>
//       </Content>

//       <Modal
//         title="Confirm Deletion"
//         open={modalVisible}
//         onOk={handleCategoryDelete}
//         onCancel={cancelDelete}
//         okText="Delete"
//         cancelText="Cancel"
//       >
//         <p>Are you sure you want to delete this category?</p>
//       </Modal>

//       <ResultModal 
//         modalData={modalData}
//         modalVisible={modalVisibleDelete}
//         setModalVisible={setModalVisibleDelete}
//         navigate={navigate}
//       />
//     </Layout>
//   );
// };

// export default CategoryPage;

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Modal, Button, Alert, Collapse, Image, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import DataPageHeader from '../../components/DataPageHeader';
import getCategories from '../../requests/category/get-categories';
import deleteCategory from '../../requests/category/delete-category';
import NotFound from '../../components/NotFound';
import showModal from '../../utils/show-result-modal';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import getDateInString from '../../utils/get-date-in-string';

const { Content } = Layout;
const { Panel } = Collapse;
const { Paragraph } = Typography;

const CategoryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await getCategories();
    requestHandler(response, navigate, '/admin/login', '/');
    if (!response.success) {
        setError(response.error);
        setLoading(false);
        return;
    }
    
    setData(response?.data && response?.data?.length > 0 ? response.data : null);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleCategoryDelete = async () => {
    setModalVisible(false);
    const result = await deleteCategory(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      return;
    }

    showModal(setModalData, setModalVisibleDelete, 'success', 'Category deleted successfully');
    fetchData();
  };

  const renderCollapsePanels = (categories) =>
    categories.map(category => (
      <Panel
        key={category.id}
        header={
          <Card style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Image
                  src={category.imagePath}
                  alt={category.name}
                  style={{ maxWidth: 100, borderRadius: '8px' }}
                />
                <div>
                  <Paragraph strong><Link to={`/admin/category/${category.id}`}>{category.name}</Link></Paragraph>
                  <Paragraph>Product Type: <Link to={`/admin/product-type/${category.productTypeID}`}>{category.productTypeName}</Link></Paragraph>
                  <Paragraph>Created At: {getDateInString(category.createdAt)}</Paragraph>
                  <Paragraph>Updated At: {category?.updatedAt ? getDateInString(category.updatedAt) : 'Not Updated'}</Paragraph>
                </div>
              </div>
              <Button
                type="primary"
                danger
                onClick={() => confirmDelete(category.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        }
      >
        {category.children.length > 0 && (
          <Collapse>{renderCollapsePanels(category.children)}</Collapse>
        )}
      </Panel>
    ));

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Category Page</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Categories' 
          buttonText='Create Category' 
          buttonLink='/admin/category/create' 
          navigate={navigate}
          fetchData={fetchData} 
        />

        <Layout style={{ background: 'none', padding: '20px' }}>
            {loading && <Spinner />}
            {!data && <NotFound description={'No Categories Found'} />}
            {data && 
              <Collapse>
                {renderCollapsePanels(data)}
              </Collapse>
            }
            {error && <Alert message="Error" description={error} type="error" showIcon />}
        </Layout>
      </Content>

      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleCategoryDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      <ResultModal 
        modalData={modalData}
        modalVisible={modalVisibleDelete}
        setModalVisible={setModalVisibleDelete}
        navigate={navigate}
      />
    </Layout>
  );
};

export default CategoryPage;