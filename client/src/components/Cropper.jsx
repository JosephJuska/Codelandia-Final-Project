import ImgCrop from 'antd-img-crop';

const Cropper = ({ children, modalTitle, quality = 0.4, aspectRatio = 16 / 9, ...props }) => {
  return (
    <ImgCrop
      rotationSlider
      showReset
      aspect={aspectRatio}
      modalTitle={modalTitle}
      quality={quality}
      {...props}
    >
      {children}
    </ImgCrop>
  );
};

export default Cropper;