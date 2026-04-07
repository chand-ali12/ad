import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import subscriptionImage from "../../../assets/images/subscription.png";

const SubscriptionsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-secondary">
      <div className="w-full max-w-full mx-auto px-0 py-4 sm:py-6 md:py-10 lg:py-14">
        {/* Figma-like single card: left maroon panel with clean center fade into image */}
        <div className="relative rounded-none lg:rounded-none overflow-hidden shadow-lg h-[360px] sm:h-[440px] md:h-[520px] lg:h-[560px] xl:h-[639px] bg-[#B8A080]">
          <img
            src={subscriptionImage}
            alt="Stack of luxury bags"
            className="absolute top-0 right-0 w-full h-full object-cover md:object-contain object-right brightness-100 xl:w-[898px] xl:h-[678px] xl:top-[-18px] z-[1]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 15%, black 50%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 4%, black 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(90deg, #4A1F16 0%, #4A1F16 31%, rgba(74,31,22,0.96) 38%, rgba(82,42,31,0.9) 45%, rgba(96,58,43,0.8) 51%, rgba(111,73,55,0.66) 58%, rgba(121,84,64,0.5) 66%, rgba(110,74,56,0.34) 75%, rgba(94,60,45,0.2) 86%, rgba(74,31,22,0.08) 94%, rgba(74,31,22,0) 100%)",
            }}
          />
          <div className="absolute inset-y-0 left-[33%] w-[34%] min-w-[180px] bg-[linear-gradient(90deg,rgba(186,145,114,0)_0%,rgba(186,145,114,0.05)_28%,rgba(214,177,147,0.1)_50%,rgba(186,145,114,0.05)_72%,rgba(186,145,114,0)_100%)] blur-[70px] z-[2]" />
          <div className="relative z-10 h-full w-full flex items-center">
            <div className="w-full sm:w-[80%] md:w-[72%] lg:w-[54%] px-5 sm:px-7 md:px-8 lg:px-12 xl:pl-[45px] xl:pr-0 py-6 sm:py-8 md:py-10 lg:py-12 text-white">
              <div className="w-full max-w-[435px]">
                <h2
                  className="text-[30px] sm:text-[38px] md:text-[46px] xl:text-[60px] font-bold tracking-[0.26px] xl:tracking-[0.34px] text-left leading-[1.02]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Subscriptions
                </h2>
                <p
                  className="mt-4 xl:mt-[18px] max-w-[430px] text-xs sm:text-sm md:text-base xl:text-[18px] font-medium text-left leading-5 sm:leading-6 xl:leading-[28px]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.21px",
                  }}
                >
                  Flexible Authentication Plans for Every Buyer
                </p>
              </div>
              <ul className="mt-7 sm:mt-8 md:mt-10 xl:mt-[52px] space-y-2.5 sm:space-y-3 xl:space-y-[15px] text-[11px] sm:text-xs md:text-sm xl:text-[16px] w-full max-w-[430px]">
                <li className="flex items-center gap-2 sm:gap-2.5 xl:gap-[15px] w-full max-w-[430px] xl:min-h-[25px]">
                  <Check
                    className="w-4 h-4 shrink-0 text-white"
                    strokeWidth={2.5}
                  />
                  <span>Save up to 15% on authentications</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 xl:gap-[15px] w-full max-w-[430px] xl:min-h-[25px]">
                  <Check
                    className="w-4 h-4 shrink-0 text-white"
                    strokeWidth={2.5}
                  />
                  <span>Flexible subscription plans</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 xl:gap-[15px] w-full max-w-[430px] xl:min-h-[25px]">
                  <Check
                    className="w-4 h-4 shrink-0 text-white"
                    strokeWidth={2.5}
                  />
                  <span>Certificate of Authenticity</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 xl:gap-[15px] w-full max-w-[430px] xl:min-h-[25px]">
                  <Check
                    className="w-4 h-4 shrink-0 text-white"
                    strokeWidth={2.5}
                  />
                  <span>Broad Coverage on bags, shoes, and accessories</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => navigate("/subscription")}
                className="mt-7 sm:mt-8 xl:mt-[42px] inline-flex items-center justify-center rounded-[14px] border border-[#D4AF37] bg-[#D4AF37] text-[#3C1A10] text-sm sm:text-base xl:text-[16px] font-semibold hover:bg-[#FACC15] transition-colors w-full max-w-[280px] xl:max-w-[272px] h-[52px] sm:h-[60px] xl:h-[60px] gap-[10px] text-left"
                style={{
                  paddingTop: "14px",
                  paddingRight: "24px",
                  paddingBottom: "14px",
                  paddingLeft: "24px",
                  borderWidth: "1.61px",
                }}
              >
                View Plans and save
                <span className="ml-2 text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsSection;
