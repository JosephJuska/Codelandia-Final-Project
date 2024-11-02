import { Image } from "antd";

const PreviewImage = ({ previewFile, setPreviewFile, previewOpen, setPreviewOpen }) => {
    return (
        <>
            {previewFile && (
                <Image
                wrapperStyle={{ display: 'none' }}
                style={{ width: '100%', height: 'auto' }}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewFile(''),
                }}
                src={previewFile}
                />
            )}
        </>
    );
};

export default PreviewImage;