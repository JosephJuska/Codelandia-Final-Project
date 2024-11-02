import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography, Layout, Modal, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateReviewSearchTerm from '../../validations/review-get/review-search-term';
import validateReviewSort from '../../validations/review-get/review-sort-by';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import SelectorFilter from '../../components/form/SelectorFilter';
import validateID from '../../validations/id';
import getReviews from '../../requests/review/get-reviews';
import getProductsList from '../../requests/product/get-products-list';
import deleteReview from '../../requests/review/delete-review';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';
import ReviewCard from '../../components/cards/ReviewCard';

const { Paragraph } = Typography;
const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'ratingASC', label: 'Rating [Ascending]' },
  { value: 'ratingDESC', label: 'Rating [Descending]' },
];

const ReviewPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermError, setSearchTermError] = useState('');
  
  const [productID, setProductID] = useState('');
  const [productIDError, setProductIDError] = useState('');
  const [productOptions, setProductOptions] = useState([]);
  
  const [data, setData] = useState([]);
  const [deletedID, setDeletedID] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getReviews(searchTerm, sortValue, productID, currentPage);
    requestHandler(response, navigate, '/admin/login', '/');

    if (!response.success) {
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if (response.error?.page) {
        setError('No Reviews Found');
        setPageCount(0);
        setData(null);
        return;
      };
      
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchTermError(response.error.searchTerm);
      if (response.error?.id) setProductIDError(response.error.id);
      setLoading(false);
      return;
    };
    
    setData(response.data?.reviews);
    setPageCount(response.data?.pageCount);

    setLoading(false);
    return;
  };

  const fetchProducts = async () => {
    const response = await getProductsList();
    requestHandler(response, navigate, '/admin/login', '/');
  
    if (!response.success) {
      if (typeof response.error === 'string') {
        setProductIDError(response.error);
      }
    } else {
      let options = response.data ? response.data.map(product => ({ label: `${product.name} ID:${product.id}`, value: product.id })) : [];
      setProductOptions(options);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [searchTerm, sortValue, productID]);

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

  const handleReviewDelete = async () => {
    setModalVisible(false);
    const result = await deleteReview(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Review deleted successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <SelectorFilter 
        label='Product'
        placeholder='Select product'
        error={productIDError}
        setError={setProductIDError}
        value={productID}
        setValue={setProductID}
        options={productOptions}
        validationFunction={async (id) => {return await validateID(id, false)}}
        multiple={false}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Review Page</title>
      </Helmet>
      <Content>
        <DataPageHeader title='Reviews' fetchData={fetchData} navigate={navigate} buttonLink={'/admin/review/create'} buttonText={'Create Review'} />

        <DataPageBanner 
          admin={true}

          searchError={searchTermError}
          setSearchError={setSearchTermError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={validateReviewSearchTerm}
          placeholder='Search by name or email'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateReviewSort}
        />

        <Layout style={{ background: 'none' }} >
          <Filters filters={filters} admin={true} />
          <DataTable            
            loading={loading}
            error={error}
            data={data}
            Card={ReviewCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Reviews Found'
          />
        </Layout>

        <Modal
          title="Confirm Delete"
          open={modalVisible}
          onOk={handleReviewDelete}
          onCancel={cancelDelete}
          okText="Yes"
          cancelText="No"
        >
          <Paragraph>Are you sure you want to delete this review?</Paragraph>
        </Modal>

        <ResultModal 
          modalData={modalData}
          modalVisible={modalVisibleDelete}
          setModalVisible={setModalVisibleDelete}
          navigate={navigate}
        />
      </Content>
    </Layout>
  );
};

export default ReviewPage;