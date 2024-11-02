import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography, Layout, Modal, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateCommentSearchTerm from '../../validations/comment-get/comment-search-term';
import validateCommentSort from '../../validations/comment-get/comment-sort-by';
import CommentCard from '../../components/cards/CommentCard';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import SelectorFilter from '../../components/form/SelectorFilter';
import getCommentsByID from '../../requests/comment/get-comments-by-blog-id';
import deleteComment from '../../requests/comment/delete-comment';
import getBlogsList from '../../requests/blog/get-blogs-list';
import validateID from '../../validations/id';
import ResultModal from '../../components/ResultModal';
import errorMessages from '../../utils/constants/error-messages';
import showModal from '../../utils/show-result-modal';

const { Paragraph } = Typography;
const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'nameASC', label: 'Name [A-Z]' },
  { value: 'nameDESC', label: 'Name [Z-A]' },
];

const CommentPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermError, setSearchTermError] = useState('');

  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [blogID, setBlogID] = useState('');
  const [blogIDError, setBlogIDError] = useState('');
  const [blogOptions, setBlogOptions] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [deletedID, setDeletedID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getCommentsByID(blogID, searchTerm, sortValue, currentPage);
    requestHandler(response, navigate, '/admin/login', '/');

    if (!response.success) {
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if (response.error?.page) {
        setError('No Comments Found');
        setPageCount(0);
        setData(null);
        return;
      };
      
      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchTermError(response.error.searchTerm);
      if (response.error?.id) setBlogIDError(response.error.id);
      setLoading(false);
      return;
    };
    
    setData(response.data?.comments);
    setPageCount(response.data?.pageCount);

    setLoading(false);
    return;
  };

  const fetchBlogs = async () => {
    const response = await getBlogsList();
    requestHandler(response, navigate, '/admin/login', '/');
  
    if (!response.success) {
      if (typeof response.error === 'string') {
        setError(response?.error || errorMessages.UNEXPECTED_ERROR);
      }

      setBlogIDError(response.error?.blogID);
    } else {
      let options = response.data ? response.data.map(blog => ({ label: `${blog.title}`, value: blog.id })) : [];
      setBlogOptions(options);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [])

  useEffect(() => {
    setCurrentPage(1);
    setTrigger(true);
  }, [searchTerm, sortValue, blogID]);

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

  const handleCommentDelete = async () => {
    setModalVisible(false);
    const result = await deleteComment(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result?.error || errorMessages.UNEXPECTED_ERROR);
      return;
    };

    showModal(setModalData, setModalVisibleDelete, 'success', 'Comment deleted successfully');
    fetchData();
  };

  const filters = (
    <Form layout="vertical">
      <SelectorFilter 
        label='Blog'
        placeholder='Select blog'
        error={blogIDError}
        setError={setBlogIDError}
        value={blogID}
        setValue={setBlogID}
        options={blogOptions}
        validationFunction={async (id) => {return await validateID(id, false)}}
        multiple={false}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Comment Page</title>
      </Helmet>
      <Content>
        <DataPageHeader title='Comments' fetchData={fetchData} navigate={navigate} buttonText='Create Comment' buttonLink='/admin/comment/create' />

        <DataPageBanner 
          admin={true}

          searchError={searchTermError}
          setSearchError={setSearchTermError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={validateCommentSearchTerm}
          placeholder='Search by name or email'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateCommentSort}
        />

        <Layout style={{ background: 'none' }} >
          <Filters filters={filters} admin={true} />
          <DataTable            
            loading={loading}
            error={error}
            data={data}
            Card={CommentCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Comments Found'
          />
        </Layout>

        <Modal
          title="Confirm Delete"
          open={modalVisible}
          onOk={handleCommentDelete}
          onCancel={cancelDelete}
          okText="Yes"
          cancelText="No"
        >
          <Paragraph>Are you sure you want to delete this comment?</Paragraph>
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

export default CommentPage;