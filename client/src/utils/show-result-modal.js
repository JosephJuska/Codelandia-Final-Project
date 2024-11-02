const showModal = (setModalData, setModalVisible,status, subTitle, buttonText = null, buttonLink = null) => {
    setModalData({ status, title: status === 'success' ? 'Success' : 'Error', subTitle, buttonText, buttonLink });
    setModalVisible(true);
};

export default showModal;