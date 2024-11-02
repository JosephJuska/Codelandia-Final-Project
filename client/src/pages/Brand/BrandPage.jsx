import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Modal } from 'antd';
import getBrands from '../../requests/brand/get-brands';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import searchValidator from '../../validations/brand-get/brand-search-term';
import sortValidator from '../../validations/brand-get/brand-sort-by';
import deleteBrand from '../../requests/brand/delete-brand';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import DataTable from '../../components/DataTable';
import BrandCard from '../../components/cards/BrandCard';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const options = [
  { value:'nameASC', label:'Name [A-Z]' },
  { value:'nameDESC', label:'Name [Z-A]' },
  { value:'codeASC', label:'Code [Ascending]' },
  { value:'codeDESC', label:'Code [Descending]' },
];

const BrandPage = () => {
  const [sortValue, setSortValue] = useState('nameASC');
  const [sortError, setSortError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');

  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getBrands(searchTerm, sortValue, currentPage);
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');

      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.error?.page) {
        setError('No Brands Found');
        setPageCount(0);
        setData(null);
        return;
      }

      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchError(response.error.searchTerm);
      setLoading(false);
      return;
    }

    setData(response.data?.brands);
    setPageCount(response.data?.pageCount);
    setLoading(false);
    return;
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, searchTerm]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleBrandDelete = async () => {
    setModalVisible(false);
    const result = await deleteBrand(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Brand Deleted Successfully');
    fetchData();
  };

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Brand Page</title>
      </Helmet>
      <Content>
        <DataPageHeader title='Brands' buttonText='Create Brand' buttonLink='/admin/brand/create' navigate={navigate} fetchData={fetchData} />

        <DataPageBanner 
          admin={true}
          searchError={searchError}
          setSearchError={setSearchError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={searchValidator.validateSearchTerm}
          placeholder='Search by name or code'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={sortValidator.validateBrandSort}
        />

        <Layout style={{ background: 'none' }}>
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={BrandCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Brands Found'
          />
        </Layout>

        <Modal
          title="Confirm Deletion"
          open={modalVisible}
          onOk={handleBrandDelete}
          onCancel={cancelDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this brand? This action cannot be undone.</p>
        </Modal>

        <ResultModal 
          modalVisible={modalVisibleDelete}
          setModalVisible={setModalVisibleDelete}
          modalData={modalData}
          navigate={navigate}
        />
      </Content>
    </Layout>
  );
};

export default BrandPage;