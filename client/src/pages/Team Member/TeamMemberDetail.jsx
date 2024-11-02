import { useEffect, useState } from 'react';
import { Form, Input, Upload, Button, Image, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import getTeamMemberByID from '../../requests/team-member/get-team-member-by-id';
import updateTeamMember from '../../requests/team-member/update-team-member';
import requestHandler from '../../utils/request-handler';
import validateFullName from '../../validations/team-member/team-member-full-name';
import validateJobPosition from '../../validations/team-member/team-member-job-position';
import imageValidator from '../../validations/team-member/team-member-image';
import validateDescription from '../../validations/team-member/team-member-short-description';
import sanitizeFormDataValue from '../../utils/sanitize-form-data-value';
import Spinner from '../../components/Spinner';
import NotFound from '../../components/NotFound';
import Cropper from '../../components/Cropper';
import handleFormError from '../../utils/handle-form-error';
import ResultModal from '../../components/ResultModal';
import showModal from '../../utils/show-result-modal';
import handlePreview from '../../utils/handle-preview';
import PreviewImage from '../../components/PreviewImage';
import UndoFieldsButton from '../../components/form/UndoFieldsButton';
import DataDateFields from '../../components/form/DataDateFields';
import getDateInString from '../../utils/get-date-in-string';

const { Paragraph } = Typography;

const TeamMemberDetail = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [teamMember, setTeamMember] = useState(null);
  
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamMember = async () => {
      setLoading(true);
      const result = await getTeamMemberByID(id);
      requestHandler(result, navigate, '/admin/login', '/');

      if (!result.success) {
        setNotFound(true);
        setLoading(false);
        return;
      };

      const memberData = result.data;
      setImagePath(memberData?.imagePath || null);
      form.setFieldsValue({
        fullName: memberData.fullName,
        jobPosition: memberData.jobPosition,
        shortDescription: memberData.shortDescription,
        facebookLink: memberData.facebookLink,
        twitterLink: memberData.twitterLink,
        youtubeLink: memberData.youtubeLink,
        pinterestLink: memberData.pinterestLink,
        instagramLink: memberData.instagramLink,
        created_at: getDateInString(memberData.createdAt),
        updated_at: memberData?.updatedAt ? getDateInString(memberData.updatedAt, true) : 'Not Updated'
      });
      setTeamMember(memberData);
      setLoading(false);
    };

    fetchTeamMember();
  }, [id, navigate, form]);

  const onReset = () => {
    form.setFieldsValue({
      fullName: teamMember.fullName,
      jobPosition: teamMember.jobPosition,
      shortDescription: teamMember.shortDescription,
      facebookLink: teamMember.facebookLink,
      twitterLink: teamMember.twitterLink,
      youtubeLink: teamMember.youtubeLink,
      pinterestLink: teamMember.pinterestLink,
      instagramLink: teamMember.instagramLink,
      created_at: getDateInString(teamMember.createdAt),
      updated_at: teamMember?.updatedAt ? getDateInString(teamMember.updatedAt, true) : 'Not Updated'
    });
  };

  const handleImageUpload = async (file) => {
    const result = await imageValidator.validateTeamMemberImage(file);
    if (!result.success) {
      form.setFields([{ name: 'image', errors: [result.error] }]);
      return Upload.LIST_IGNORE;
    }

    setImageFile(file);
    setShowImage(false);
    form.setFields([{ name: 'image', errors: [] }]);
    return false;
  };

  const handleImageRemove = () => {
    setShowImage(true);
    setImageFile(null);
  };

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    
    if (imageFile) {
      values.image = imageFile;
    };

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, sanitizeFormDataValue(value));
    });

    const result = await updateTeamMember(id, formData);
    requestHandler(result, navigate, '/admin/login', '/');
    
    if(!result.success){
      handleFormError(form, result, setModalData, setModalVisible);
      setLoadingUpdate(false);

      return;
    };

    const resultUpdate = await getTeamMemberByID(id);
    console.log(resultUpdate);
    requestHandler(result, navigate, '/admin/login', '/');
    if(resultUpdate.success){
      if(resultUpdate.data?.imagePath) setImagePath(resultUpdate.data.imagePath);
      setTeamMember(resultUpdate.data);
      form.setFieldsValue({
        updated_at: resultUpdate.data?.updatedAt ? getDateInString(resultUpdate.data.updatedAt, true) : 'Not Updated'
      });
    }
    showModal(setModalData, setModalVisible, 'success', 'Team Member Updated Successfully!');
    setShowImage(true);
    setLoadingUpdate(false);
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (notFound) {
    return <NotFound isData={false} />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <UndoFieldsButton onReset={onReset} />
      <Form.Item 
        label="Full Name" 
        name="fullName" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateFullName(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Job Position" 
        name="jobPosition" 
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateJobPosition(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
         }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Short Description" 
        name="shortDescription"
        rules={[{ 
            required: true,
            validator: async (_, value) => {
                const result = await validateDescription(value);
                if (!result.success) return Promise.reject(result.error);
                return Promise.resolve();
            }
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Facebook Link" 
        name="facebookLink"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Twitter Link" 
        name="twitterLink"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="YouTube Link" 
        name="youtubeLink"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Pinterest Link" 
        name="pinterestLink"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input />
      </Form.Item>

      <Form.Item 
        label="Instagram Link" 
        name="instagramLink"
        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
        <Input />
      </Form.Item>

      {showImage && imagePath && (
        <>
          <Paragraph>Previous Image</Paragraph>
          <Image
            src={imagePath}
            alt="Image"
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </>
      )}

      <Form.Item
        label="Image"
        name="image"
      >
        <Cropper
          aspectRatio={1}
          modalTitle="Profile Image"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={handleImageUpload}
            showUploadList={true}
            onRemove={handleImageRemove}
            onPreview={async () => {return await handlePreview(imageFile, setPreviewFile, setPreviewOpen)}}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Cropper>
      </Form.Item>

      <PreviewImage previewFile={previewFile} setPreviewFile={setPreviewFile} previewOpen={previewOpen} setPreviewOpen={setPreviewOpen} />

      <DataDateFields />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update Team Member</Button>
      </Form.Item>

      <ResultModal 
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalData={modalData}
        navigate={navigate}
      />
    </Form>
  );
};

export default TeamMemberDetail;