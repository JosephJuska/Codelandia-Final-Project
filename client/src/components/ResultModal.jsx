import { Modal, Result, Button } from 'antd';

const ResultModal = ({ modalData, modalVisible, setModalVisible, navigate }) => {
    const handleModalClose = () => {
        setModalVisible(false);  
    };

    return (
        <Modal
        open={modalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        destroyOnClose
        >
            <Result
            status={modalData?.status}
            title={modalData?.title}
            subTitle={modalData?.subTitle}
            extra={
                (
                <>
                    <Button type='primary' danger onClick={handleModalClose}>
                    Close
                    </Button>
                    {modalData?.buttonLink && modalData?.buttonText && (
                    <Button type="primary" onClick={() => navigate(modalData.buttonLink)}>
                        {modalData.buttonText}
                    </Button>
                    )}
                </>
                ) 
            }
            />
      </Modal>
    );
};

export default ResultModal;