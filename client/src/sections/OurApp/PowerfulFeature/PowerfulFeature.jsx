import PropTypes from 'prop-types';
import SectionHeader from '../../../components/client/SectionHeader/SectionHeader';
import p1Image from '../../../assets/images/p1.png';
import p2Image from '../../../assets/images/p2.png';
import p3Image from '../../../assets/images/p3.png';
import p4Image from '../../../assets/images/p4.png';
import p5Image from '../../../assets/images/p5.png';
import p6Image from '../../../assets/images/p6.png';

const PowerfulFeature = ({
  heading = "Powerful Features",
  subHeading = "Everything you need to authenticate and trade luxury items",
  features = [],
  className = "",
}) => {
  // Default features data
  const defaultFeatures = [
    {
      id: 1,
      image: p1Image,
      heading: "Certificate Management",
      description: "View and manage all your certificates with our user-friendly system",
    },
    {
      id: 2,
      image: p2Image,
      heading: "Over 100 Brands",
      description: "Choose from over 100 brands with specialty teams for each",
    },
    {
      id: 3,
      image: p3Image,
      heading: "Easy Viewing",
      description: "Save, print, and share your certificates straight from the app",
    },
    {
      id: 4,
      image: p4Image,
      heading: "Business Profiles",
      description: "Create your profile, connect with users, and collect reviews",
    },
    {
      id: 5,
      image: p5Image,
      heading: "Dynamic Forums",
      description: "Connect with fashion fanatics in our vibrant community",
    },
    {
      id: 6,
      image: p6Image,
      heading: "Marketplace",
      description: "Buy and sell luxury items with zero commission fees",
    },
  ];

  const featuresToDisplay = features.length > 0 ? features : defaultFeatures;

  return (
    <div className={`w-full py-8 sm:py-12 md:py-16 lg:py-20 bg-[#F5F5F0] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <SectionHeader
            heading={heading}
            subHeading={subHeading}
            headingColor="primary"
            subHeadingColor="primary"
            className="text-center"
            headingClassName="text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-[60px] tracking-[0.26px]"
            subHeadingClassName="text-center"
          />
        </div>

        {/* Features Grid - 2 columns, 3 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {featuresToDisplay.map((feature) => (
            <div
              key={feature.id}
              className="flex justify-center"
            >
              {/* White Box with Image, Title and Description */}
              <div className="bg-secondary p-3 sm:p-4 md:p-5 w-full flex flex-col items-start rounded-[24px]">
                {/* Feature Image */}
                <div className="w-full mb-4 sm:mb-5 md:mb-6 p-2">
                  <img
                    src={feature.image}
                    alt={feature.heading || feature.imageAlt || "Feature image"}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Feature Heading */}
                {feature.heading && (
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-2 sm:mb-3 text-left w-full pl-[5px]">
                    {feature.heading}
                  </h3>
                )}

                {/* Feature Description */}
                {feature.description && (
                  <p className="text-xs sm:text-sm md:text-base text-primary/80 leading-relaxed text-left w-full pl-[5px]">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PowerfulFeature.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      image: PropTypes.string.isRequired,
      imageAlt: PropTypes.string,
      heading: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

export default PowerfulFeature;
