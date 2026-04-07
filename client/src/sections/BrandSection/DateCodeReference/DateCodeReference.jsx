import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import Jack1Image from '../../../assets/images/jack1.png';
import Jack2Image from '../../../assets/images/jack2.png';

const DateCodeReference = ({
  heading = "BALENCIAGA Deals in",
  categories = [],
  title = "Date Code Reference",
  subtitle = "Complete BALENCIAGA date code and authentication details.",
  description = "Balenciaga handbags and small leather goods feature reference code stamps within the item, often on the back side of the interior brand logo or stamped on the inner panel of the leather lining or patch pocket. The letter found within the numerical codes can be used to reference the season and year of production.",
  lastUpdated = "Last updated March 26",
  dateCodes = [],
  className = "",
}) => {
  // Default categories
  const defaultCategories = [
    "Handbags",
    "Wallets",
    "Watches",
    "Jewelry",
    "Clothing",
    "Menswear",
    "Shoes",
    "Accessories"
  ];

  // Default date codes - arranged in rows (each row has 4 items, one from each column)
  const defaultDateCodes = [
    // Row 1
    ["N = F/W 2024", "J = S/S 2013", "F = S/S 2015", "B = S/S 2017"],
    // Row 2
    ["O = F/W 2023", "K = F/W 2012", "G = F/W 2014", "C = F/W 2016"],
    // Row 3
    ["P = S/S 2023", "L = S/S 2012", "H = S/S 2014", "D = S/S 2016"],
    // Row 4
    ["Q = F/W 2022", "M = F/W 2011", "W = F/W 2019", "E = F/W 2015"],
    // Row 5
    ["R = S/S 2022", "N = S/S 2011", "X = S/S 2019", "A = F/W 2017"],
    // Row 6
    ["S = F/W 2021", "O = F/W 2010", "Y = F/W 2018", "Z = S/S 2018"],
    // Row 7
    ["T = S/S 2021", "P = S/S 2010", "U = F/W 2020", "V = S/S 2020"]
  ];

  const categoriesToRender = categories.length > 0 ? categories : defaultCategories;
  const dateCodesToRender = dateCodes.length > 0 ? dateCodes : defaultDateCodes;

  return (
    <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-white ${className}`}>
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 max-w-[1200px] mx-auto">
        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-6 sm:mb-8 md:mb-10">
          {heading}
        </h2>

        {/* Categories List */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16 px-2">
          {categoriesToRender.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0" />
              <span className="text-sm sm:text-base md:text-lg text-primary whitespace-nowrap">{category}</span>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[38px] p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 shadow-lg border border-gray-300 max-w-4xl mx-auto">
          {/* Card Title */}
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-2 sm:mb-3">
            {title}
          </h3>

          {/* Card Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-primary text-center mb-4 sm:mb-5 md:mb-6">
            {subtitle}
          </p>

          {/* Descriptive Paragraph */}
          <p className="text-xs sm:text-sm md:text-base text-primary mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-4xl mx-auto text-center px-2">
            {description}
          </p>

          {/* Product Tag Images */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-4 sm:mb-5 md:mb-6">
            <img
              src={Jack1Image}
              alt="Balenciaga tag reference"
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:w-[400px] h-auto md:h-[300px] object-cover rounded-[19.02px]"
            />
            <img
              src={Jack2Image}
              alt="Balenciaga leather tag reference"
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:w-[400px] h-auto md:h-[300px] object-cover rounded-[19.02px]"
            />
          </div>

          {/* Last Updated */}
          <p className="text-xs sm:text-xs md:text-sm text-gray-500 text-center mb-4 sm:mb-6 md:mb-8">
            {lastUpdated}
          </p>

          {/* Date Code List - 4 columns, organized by rows */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {dateCodesToRender.map((row, rowIndex) => 
              row.map((code, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-600 break-words">{code}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

DateCodeReference.propTypes = {
  heading: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  lastUpdated: PropTypes.string,
  dateCodes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  className: PropTypes.string,
};

export default DateCodeReference;
