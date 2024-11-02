import VerificationMain from '../../components/VerificationMain';
import updateEmail from '../../requests/verify/update-email';

const ConfirmEmailUpdate = () => {
  return <VerificationMain 
    callBack={updateEmail}
    title='Email Updated Successfully'
    body='Your email has been updated successfully. Now you can use your email to receive updated from us.'
  />
};

export default ConfirmEmailUpdate;