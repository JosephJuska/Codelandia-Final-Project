import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import validateUserSearchTerm from '../../validations/user-get/user-search-term';
import validateUserRoles from '../../validations/user-get/user-roles';
import validateUserSort from '../../validations/user-get/user-sort-by';
import DataPageHeader from '../../components/DataPageHeader';
import DataPageBanner from '../../components/DataPageBanner';
import Filters from '../../components/Filters';
import DataTable from '../../components/DataTable';
import RadioFilter from '../../components/form/RadioFilter';
import CheckboxFilter from '../../components/form/CheckboxFilter';
import getUsers from '../../requests/user/get-users';
import UserCard from '../../components/cards/UserCard';

const { Content } = Layout;

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'firstNameASC', label: 'First Name [A-Z]' },
  { value: 'firstNameDESC', label: 'First Name [Z-A]' },
  { value: 'lastNameASC', label: 'Last Name [A-Z]' },
  { value: 'lastNameDESC', label: 'Last Name [Z-A]' },
  { value: 'usernameASC', label: 'Username [A-Z]' },
  { value: 'usernameDESC', label: 'Username [Z-A]' },
];

const UserPage = () => {
  const [sortValue, setSortValue] = useState('newest');
  const [sortError, setSortError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  
  const [isActive, setIsActive] = useState('');
  const [isActiveError, setIsActiveError] = useState('');
  
  const [isVerified, setIsVerified] = useState('');
  const [isVerifiedError, setIsVerifiedError] = useState('');
  
  const [roles, setRoles] = useState([]);
  const [rolesError, setRolesError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const response = await getUsers(isActive, isVerified, roles, searchTerm, sortValue, currentPage);
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');
      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      };

      if (response.error?.page) {
        setError('No Users Found');
        setPageCount(0);
        setData(null);
        return;
      };

      if (response.error?.sortBy) setSortError(response.error.sortBy);
      if (response.error?.searchTerm) setSearchError(response.error.searchTerm);
      if (response.error?.isActive) setIsActiveError(response.error.isActive);
      if (response.error?.isVerified) setIsVerifiedError(response.error.isVerified);
      if (response.error?.roles) setRolesError(response.error.roles);
      setLoading(false);
      return;
    };

    setData(response.data?.users);
    setPageCount(response.data?.pageCount);
    setLoading(false);
  };

  useEffect(() => {
    console.log(roles);
    setCurrentPage(1);
    setTrigger(true);
  }, [sortValue, searchTerm, isActive, isVerified, JSON.stringify(roles)]);

  useEffect(() => {
    setTrigger(false);
    fetchData();
  }, [currentPage, trigger]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filters = (
    <Form layout="vertical">
      <RadioFilter
        label='Activity Status'
        error={isActiveError}
        setError={setIsActiveError}
        value={isActive}
        setValue={setIsActive}
        options={[
          {value:'true', label:'Active'},
          {value:'false', label:'Inactive'}
        ]}
      />
      <RadioFilter
        label='Verification Status'
        error={isVerifiedError}
        setError={setIsVerifiedError}
        value={isVerified}
        setValue={setIsVerified}
        options={[
          {value:'true', label:'Verified'},
          {value:'false', label:'Unverified'}
        ]}
      />
      <CheckboxFilter
        label='Roles'
        error={rolesError}
        setError={setRolesError}
        validationFunction={validateUserRoles}
        value={roles}
        setValue={setRoles}
        options={[
          {value:1, label:'Customer'},
          {value:2, label:'Writer'},
          {value:3, label:'Admin'}
        ]}
      />
    </Form>
  );

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>User Page</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Users' 
          buttonText='Create User' 
          buttonLink='/admin/user/create' 
          navigate={navigate}
          fetchData={fetchData} 
        />

        <DataPageBanner 
          admin={true}

          searchError={searchError}
          setSearchError={setSearchError}
          setSearchTerm={setSearchTerm}
          searchValidationFunction={validateUserSearchTerm}
          placeholder='Search by first name, last name, username or email'

          sortError={sortError}
          setSortError={setSortError}
          sortValue={sortValue}
          setSortValue={setSortValue}
          options={options}
          sortValidationFunction={validateUserSort}
        />

        <Layout style={{ background: 'none' }}>
          <Filters filters={filters} admin={true} />
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={UserCard}
            navigate={navigate}
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
            notFoundDescription='No Users Found'
          />
        </Layout>
      </Content>
    </Layout>
  );
};

export default UserPage;