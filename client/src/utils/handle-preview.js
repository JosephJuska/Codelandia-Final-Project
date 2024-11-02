import getBase64 from "./get-file-in-base-64";

const handlePreview = async (file, setPreviewFile, setPreviewOpen) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    };

    setPreviewFile(file.url || (file.preview));
    setPreviewOpen(true);
};

export default handlePreview;