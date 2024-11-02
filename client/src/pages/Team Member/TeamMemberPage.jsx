import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Modal } from 'antd';
import getTeamMembers from '../../requests/team-member/get-team-members';
import { useNavigate } from 'react-router-dom';
import requestHandler from '../../utils/request-handler';
import deleteTeamMember from '../../requests/team-member/delete-team-member';
import DataPageHeader from '../../components/DataPageHeader';
import DataTable from '../../components/DataTable';
import TeamMemberCard from '../../components/cards/TeamMemberCard';
import errorMessages from '../../utils/constants/error-messages';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';

const { Content } = Layout;

const TeamMemberPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedID, setDeletedID] = useState(null);
  
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [modalData, setModalData] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const response = await getTeamMembers();
    if (!response.success) {
      requestHandler(response, navigate, '/admin/login', '/');

      if (typeof response.error === 'string') {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.error?.teamMembers) {
        setError('No Team Members Found');
        setData(null);
        return;
      }

      setLoading(false);
      return;
    }

    setData(response.data);
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

  const handleTeamMemberDelete = async () => {
    setModalVisible(false);
    const result = await deleteTeamMember(deletedID);
    setDeletedID(null);
    requestHandler(result, navigate, '/admin/login', '/');

    if (!result.success) {
      showModal(setModalData, setModalVisibleDelete, 'error', result.error || errorMessages.UNEXPECTED_ERROR);
      return;
    }

    showModal(setModalData, setModalVisibleDelete,'success', 'Team Member Deleted Successfully');
    fetchData();
  };

  return (
    <Layout style={{ background: 'none' }}>
      <Helmet>
        <title>Team Members</title>
      </Helmet>
      <Content>
        <DataPageHeader 
          title='Team Members' 
          buttonText='Create Team Member' 
          buttonLink='/admin/team-member/create' 
          fetchData={fetchData} 
          navigate={navigate}
        />

        <Layout style={{ background: 'none' }}>
          <DataTable 
            loading={loading}
            error={error}
            data={data}
            Card={TeamMemberCard}
            navigate={navigate}
            confirmDelete={confirmDelete}
            page={false}
            notFoundDescription='No Team Members Found'
          />
        </Layout>

        <Modal
          title="Confirm Deletion"
          open={modalVisible}
          onOk={handleTeamMemberDelete}
          onCancel={cancelDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this team member? This action cannot be undone.</p>
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

export default TeamMemberPage;