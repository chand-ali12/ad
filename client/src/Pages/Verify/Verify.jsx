import ADCertification from '../../sections/VerifySection/ADCertification/ADCertification';
import HowToVerify from '../../sections/VerifySection/Howtoverify/HowToVerify';
import VerifyCertification from '../../sections/VerifySection/VerifyCertification/VerifyCertification';
import WhyNeedCertificate from '../../sections/VerifySection/WhyNeedCertificate/WhyNeedCertificate';

const Verify = () => {
    const handleVerifyClick = () => {
        const el = document.getElementById('verify-certificate-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <ADCertification onVerifyClick={handleVerifyClick} />
                <HowToVerify />


                <div id="verify-certificate-section">
                    <VerifyCertification />
                </div>
                <WhyNeedCertificate />
            </main>
        </div>
    );
};

export default Verify;
