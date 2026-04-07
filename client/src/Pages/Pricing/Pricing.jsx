import { useNavigate } from 'react-router-dom';
import PricingHero from '../../sections/Pricing/PricingHero/PricingHero';
import SmartVerification from '../../sections/Pricing/SmartVerification/SmartVerification';
import TransparentPricing from '../../sections/Pricing/TransparentPricing/TransparentPricing';

const Pricing = () => {
  const navigate = useNavigate();

  const handleBuyNowClick = () => {
    navigate('/enter-detail');
  };

  return (
    <div>
      <PricingHero
        onBuyNowClick={handleBuyNowClick}
      />
      <SmartVerification />
      <TransparentPricing
        onBuyNowClick={handleBuyNowClick}
      />
    </div>
  );
};

export default Pricing;
