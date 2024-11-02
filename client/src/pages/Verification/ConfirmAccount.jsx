import VerificationMain from '../../components/VerificationMain';
import verifyAccount from '../../requests/verify/verify-account';

const ConfirmAccount = () => {
  return <VerificationMain 
    callBack={verifyAccount} 
    title='Account Verified Successfully' 
    body='Your account has been verified successfully. Now you can log in to your account.'
  />
};

export default ConfirmAccount;