import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SectionHeader, Stepper } from "../../../components";

const HowItWorks = ({
  heading = "How It Works  ",
  subHeading = "Simple, secure, and seamless authentication process",
  steps = [],
  className = "",
}) => {
  const navigate = useNavigate();
  // Default steps if none provided
  const defaultSteps = [
    {
      stepText: "01",
      heading: "Submit",
      subHeading: "Upload photos",
      showLine: true,
    },
    {
      stepText: "02",
      heading: "Analyze",
      subHeading: "Our experts conduct thorough inspection",
      showLine: true,
    },
    // {
    //   stepText: "03",
    //   heading: "Verify",
    //   subHeading: "Receive detailed authentication report",
    //   showLine: true,
    // },
    {
      stepText: "03",
      heading: "Certify",
      subHeading: "Get your digital certificate",
      showLine: false,
    },
  ];

  const stepsToRender = steps.length > 0 ? steps : defaultSteps;

  return (
    <div
      className={`min-h-[400px] flex flex-col justify-center p-3 pb-6 sm:p-6 sm:pb-8 md:p-8 max-w-[1200px] mx-auto ${className}`}
    >
      <SectionHeader
        heading={heading}
        subHeading={subHeading}
        headingColor="primary"
        subHeadingColor="primary"
        className="text-center mb-8 sm:mb-10 md:mb-12"
        headingClassName="text-center whitespace-nowrap"
        headingStyle={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontStyle: "normal",
          fontSize: "clamp(34px, 9vw, 60px)",
          lineHeight: "clamp(40px, 10vw, 60px)",
          letterSpacing: "0.26px",
          textAlign: "center",
        }}
        subHeadingClassName="text-center"
        subHeadingStyle={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "20px",
          lineHeight: "28px",
          letterSpacing: "-0.45px",
          textAlign: "center",
        }}
      />

      {/* Steps layout: 1 column on mobile, 3 equal columns centered on larger screens */}
      <div className="mt-10 sm:mt-12 md:mt-14 relative max-w-[960px] mx-auto overflow-visible">
        {/* Single horizontal connector line behind all three steps (desktop/tablet only),
            inset so it starts just outside step 1 and ends just outside step 3 */}
        <div
          className="hidden md:block absolute top-[34px] h-[2px] bg-line-color"
          style={{ left: "14%", right: "14%" }}
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 place-items-start md:place-items-start auto-rows-max overflow-visible">
          {stepsToRender.map((step, index) => (
            <Stepper
              key={index}
              stepText={step.stepText}
              heading={step.heading}
              subHeading={step.subHeading}
              // Per-step desktop lines are disabled; we draw one shared line above
              showLine={false}
              hideLineOnTablet={false}
              lineColor="primary"
              className="w-full h-full flex flex-col"
            />
          ))}
        </div>
      </div>

      {/* Call-to-action: Start Authentication */}
      <div className="mt-8 sm:mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/authentication")}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-secondary px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-semibold tracking-wide shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          Start Authentication
        </button>
      </div>
    </div>
  );
};

HowItWorks.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      stepText: PropTypes.string,
      heading: PropTypes.string,
      subHeading: PropTypes.string,
      showLine: PropTypes.bool,
    }),
  ),
  className: PropTypes.string,
};

export default HowItWorks;
