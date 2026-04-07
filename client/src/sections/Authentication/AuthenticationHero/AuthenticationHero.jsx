import PropTypes from 'prop-types';
import HeroSection from '../../../sections/HomeSection/HeroSection/HeroSection';
import authenticationHeroImage from '../../../assets/images/AuthenticationHero.jpeg';

const AuthenticationHero = ({ onGetStartedClick = () => {} }) => {
  const handleGetStarted = () => {
    if (typeof onGetStartedClick === 'function') onGetStartedClick();
  };
  return (
    <div>
      <HeroSection
        backgroundImage={authenticationHeroImage}
        bannerText="Need It Fast? 60-Minute Expedited Service Available Now"
        bannerBoldFragment="60-Minute Expedited Service Available Now"
        largeHeading="Authentication"
        description="Setting the new standard in luxury authentication"
        primaryButtonText="Get started"
        primaryButtonOnClick={handleGetStarted}
        // secondaryButtonText="Learn More"
        secondaryButtonOnClick={handleGetStarted}
        overlayClassName="justify-center !pr-0 md:!justify-center"
        heroCardProps={{
          className: "rounded-[16px] sm:rounded-[20px] md:rounded-[24px] bg-secondary/70 backdrop-blur-sm",
          headingClassName: "text-center" ,
          largeHeadingClassName: "font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center",
          descriptionClassName: "text-center text-xs sm:text-sm md:text-base",
          buttonsContainerClassName: "justify-center"
        }}
      />
    </div>
  );
};

AuthenticationHero.propTypes = {
  onGetStartedClick: PropTypes.func,
};

export default AuthenticationHero;
