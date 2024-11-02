import VerificationMain from '../../components/VerificationMain';
import deleteAccount from '../../requests/verify/delete-account';

const ConfirmDeleteAccount = () => {
  return <VerificationMain
    callBack={deleteAccount}
    title='Account deleted Successfully'
    description='Your account has been deleted successfully. We are sorry for your decision. Hope we meet your expectations next time.'
  />
};

export default ConfirmDeleteAccount;