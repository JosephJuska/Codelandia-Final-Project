import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography, Layout, Modal, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { clearAllTokens } from '../../utils/token';
import requestHandler from '../../utils/request-handler';
import titleValidator from '../../validations/blog/blog-title';
import validateSortBy from '../../validations/blog/blog-sort-by';
import deleteBlog from '../../requests/blog/delete-blog';
import BlogCard from '../../components/cards/BlogCard';
import Filters from '../../components/Filters';
import RadioFilter from '../../components/form/RadioFilter';
import DataTable from '../../components/DataTable';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import getBlogsWriter from '../../requests/blog/get-blogs-writer';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';

const { Paragraph } = Typography;
const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'titleASC', label: 'Title [A-Z]' },
  { value: 'titleDESC', label: 'Title [Z-A]' },
];

const WriterHome = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [publishedFilter, setPublishedFilter] = useState('');
  const [publishedError, setPublishedError] = useState('');
  
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const [modalData, setModalData] = useState(null);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  
  const [data, setData] = useState([]);
  
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [deletedID, setDeletedID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getBlogsWriter(publishedFilter, sortValue, currentPage, title);
    if (!response.success) {
      requestHandler(response, navigate, '/writer/login', '/');
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if (response.error?.page) {
        setError('No Blogs Found');
        setPageCount(0);
        setData(null);
        return;
      };

      if (response.error?.ownerID) {
        clearAllTokens();
        navigate('/writer/login');
        setLoading(false);
        return;
      };

      if (response.error?.published) setPublishedError(response.error.published);
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.title) setTitleError(response.error.title);
      setLoading(false);
      return;
    }

    setData(response.data?.blogs);
    setPageCount(response.data?.pageCount);
    setLoading(false);
    return;
  };

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, publishedFilter, title]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBlogClick = (id) => {
    navigate('/writer/blog/' + id);
  };

  const confirmDelete = (id) => {
    setDeletedID(id);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setDeletedID(null);
    setModalVisible(false);
  };

  const handleBlogDelete = async () => {
    setModalVisible(false);
    const result = await deleteBlog(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/writer/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete,'success', 'Blog Deleted Successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <RadioFilter
        label='Publication Status'
        error={publishedError}
        setError={setPublishedError}
        value={publishedFilter}
        setValue={setPublishedFilter}
        options={[
          {value:'true', label:'Published'},
          {value:'false', label:'Unpublished'}
        ]}
      />
    </Form>
  );

  return (
    <Layout>
      <Helmet>
        <title>Writer&apos;s Home Page</title>
      </Helmet>
      <Content>
        <DataPageHeader title='Blogs' buttonText='Create Blog' buttonLink='/writer/blog/create' fetchData={fetchData} navigate={navigate} />

        <DataPageBanner 
          searchError={titleError}
          setSearchError={setTitleError}
          setSearchTerm={setTitle}
          searchValidationFunction={titleValidator.validateTitleGet}
          placeholder='Search by title'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateSortBy}
        />

        <Layout>
          <Filters filters={filters} admin={true} />
          <DataTable
            loading={loading}
            error={error}
            data={data}
            Card={BlogCard}
            navigate={navigate}
            handleClick={handleBlogClick}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Blogs Found'
          />
        </Layout>

        <Modal
          title="Confirm Delete"
          open={modalVisible}
          onOk={handleBlogDelete}
          onCancel={cancelDelete}
          okText="Yes"
          cancelText="No"
        >
          <Paragraph>Are you sure you want to delete this blog?</Paragraph>
        </Modal>

        <ResultModal
          modalVisible={modalVisibleDelete}
          setModalVisible={setModalVisibleDelete}
          modalData={modalData}
          setModalData={setModalData}
        />
      </Content>
    </Layout>
  );
};

export default WriterHome;