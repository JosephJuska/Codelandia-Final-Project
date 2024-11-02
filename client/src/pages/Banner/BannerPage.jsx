import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Layout, Modal } from 'antd';
import getBanners from '../../requests/banner/get-banners';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateBannerSort from '../../validations/banner-get/banner-sort-by';
import deleteBanner from '../../requests/banner/delete-banner';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import Filters from '../../components/Filters';
import RadioFilter from '../../components/form/RadioFilter';
import DataTable from '../../components/DataTable';
import BannerCard from '../../components/cards/BannerCard';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const options = [
  { value: 'headerASC', label: 'Header [A-Z]' },
  { value: 'headerDESC', label: 'Header [Z-A]' },
  { value: 'activeTillASC', label: 'Active Till [Earliest]' },
  { value: 'activeTillDESC', label: 'Active Till [Latest]' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' }
];

const BannerPage = () => {
  const [sortValue, setSortValue] = useState('headerASC');
  const [sortError, setSortError] = useState('');

  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [isActiveError, setIsActiveError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [modalVisibleDelete, setModalVisibleDelete] = useState(null);
  const [modalData, setModalData] = useState(null);
  
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

    const response = await getBanners(isActiveFilter, sortValue, currentPage);
    if(!response.success){
      requestHandler(response, navigate, '/admin/login', '/');

      if(typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if(response.error?.page) {
        setError('No Banners Found');
        setPageCount(0);
        setData(null);
        return;
      };

      if(response.error?.isActive) setIsActiveError(response.error.isActive);
      if(response.error?.sortBy) setSortError(response.error.sortBy);
      setLoading(false);
      return;
    };

    setData(response.data?.banners);
    setPageCount(response.data?.pageCount);
    setLoading(false);
    return;
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, isActiveFilter]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBannerClick = (id) => {
    navigate('/admin/banner/' + id);
  };

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleBannerDelete = async () => {
    setModalVisible(false);
    const result = await deleteBanner(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if(!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Banner Deleted Successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <RadioFilter
        label='Activity Status'
        error={isActiveError}
        setError={setIsActiveError}
        value={isActiveFilter}
        setValue={setIsActiveFilter}
        options={[
          {value:'true', label:'Active'},
          {value:'false', label:'Inactive'}
        ]}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Banner Management</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Banners' 
          buttonText='Create Banner' 
          buttonLink='/admin/banner/create' 
          fetchData={fetchData} 
          navigate={navigate} 
        />

        <DataPageBanner 
          admin={true}
          search={false}

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateBannerSort}
        />

        <Layout style={{ background: 'none' }}>
          <Filters filters={filters} admin={true} />
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={BannerCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            handleClick={handleBannerClick}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Banners Found'
          />
        </Layout>

        <Modal
          title="Confirm Deletion"
          open={modalVisible}
          onOk={handleBannerDelete}
          onCancel={cancelDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
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

export default BannerPage;