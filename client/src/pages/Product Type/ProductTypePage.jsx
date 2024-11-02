import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateProductTypeName from '../../validations/product-type-name';
import validateProductTypeSort from '../../validations/product-type-get/product-type-sort-by';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import DataTable from '../../components/DataTable';
import getProductTypes from '../../requests/product-type/get-product-types';
import deleteProductType from '../../requests/product-type/delete-product-type';
import ProductTypeCreation from '../../components/ProductTypeCreation';
import ProductTypeCard from '../../components/cards/ProductTypeCard';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const options = [
  { value: 'nameASC', label: 'Name [A-Z]' },
  { value: 'nameDESC', label: 'Name [Z-A]' },
  { value: 'productCountASC', label: 'Product Count [Ascending]' },
  { value: 'productCountDESC', label: 'Product Count [Descending]' }
];

const ProductTypePage = () => {
  const [sortValue, setSortValue] = useState('nameASC');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [creationModalVisible, setCreationModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await getProductTypes(searchTerm, sortValue);
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      }
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchError(response.error.searchTerm);
      setLoading(false);
      return;
    }
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, sortValue]);

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleProductTypeDelete = async () => {
    setModalVisible(false);
    const result = await deleteProductType(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');
    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error);
      return;
    }

    showModal(setModalData, setModalVisibleDelete, 'success', 'Product Type deleted successfully');
    fetchData();
  };

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Product Type Page</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Product Types' 
          buttonText='Create Product Type' 
          buttonFunction={() => setCreationModalVisible(true)}
          navigate={navigate}
          fetchData={fetchData} 
        />

        <DataPageBanner 
          admin={true}

          searchError={searchError}
          setSearchError={setSearchError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={async (value) => {return await validateProductTypeName(value, false)}}
          placeholder='Search by name'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateProductTypeSort}
        />

        <Layout style={{ background: 'none' }}>
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={ProductTypeCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            page={false}
            notFoundDescription='No Product Types Found'
          />
        </Layout>
      </Content>

      <Modal
        title="Confirm Deletion"
        open={modalVisible}
        onOk={handleProductTypeDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this product type?</p>
      </Modal>

      <ProductTypeCreation 
        isVisible={creationModalVisible}
        setIsVisible={setCreationModalVisible}
        navigate={navigate}
        fetchData={fetchData}
        setModalData={setModalData}
        setModalVisible={setModalVisibleDelete}
      />

      <ResultModal 
        modalData={modalData}
        setModalVisible={setModalVisibleDelete}
        modalVisible={modalVisibleDelete}
        navigate={navigate}
      />
    </Layout>
  );
};

export default ProductTypePage;