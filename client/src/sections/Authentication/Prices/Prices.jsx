import PropTypes from 'prop-types';
import certificateImage from '../../../assets/images/Image (Certificate of Authenticity).png';

const Prices = ({
  heading = "Prices",
  subHeading = "$12 Including a Certificate",
  note = "*exclusions apply below",
  columns = [],
  className = "",
}) => {
  // Default columns if none provided
  const defaultColumns = [
    {
      brandName: "Louis Vuitton",
      items: [
        { name: "Regular Bags and Accessories", price: "$12" },
        { name: "Jewelry and Watches", price: "$20" },
        { name: "Microchipped Bags and Accessories", price: "$20" },
        { name: "Takashi Murakami Edition", price: "$20" },
        { name: "Trunks", price: "$35" },
        { name: "Exotic Leather Bags and Accessories", price: "$35" },
      ],
    },
    {
      brandName: "Tiffany & Co.",
      items: [
        // { name: "Small Leather Goods and Accessories", price: "$35" },
        // { name: "Shoes", price: "$35" },
        // { name: "Regular Bags", price: "$60" },
        // { name: "Exotic Leather Bags", price: "$90" },
        // { name: "Jewelry", price: "$35" },
        {name : "Bags and Accessories", price: "$12"},
        {name : "Jewelry", price: "$20"},
      ],
    },
    {
      brandName: "Hermès",
      items: [
        { name: "Small Leather Goods and Accessories", price: "$35" },
        { name: "Shoes", price: "$35" },
        { name: "Regular Bags", price: "$60" },
        { name: "Exotic Leather Bags", price: "$90" },
        { name: "Jewelry", price: "$35" },
      ],
    },
    {
      brandName: "Chanel",
      items: [
        { name: "Small Leather Goods and Accessories", price: "$35" },
        { name: "Shoes", price: "$20" },
        { name: "Regular Bags", price: "$35" },
        { name: "Exotic Leather Bags", price: "$50" },
        { name: "Jewelry", price: "$20" },
      ],
    },
  ];

  const columnsToRender = columns.length > 0 ? columns : defaultColumns;

  return (
    <div id="authentication-prices" className={`bg-primary py-8 sm:py-12 md:py-16 ${className}`}>
      <div className="w-full px-4 sm:px-6 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {heading && (
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-secondary mb-3 sm:mb-4">
              {heading}
            </h2>
          )}
          {subHeading && (
            <p className="text-base sm:text-lg md:text-xl font-bold text-secondary mb-2">
              {subHeading}
            </p>
          )}
          {note && (
            <p className="text-xs sm:text-sm md:text-base text-secondary/80 italic font-bold">
              {note}
            </p>
          )}
        </div>

        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-8 sm:mb-10 md:mb-12">
          {columnsToRender.map((column, index) => (
            <div key={index} className="text-secondary">
              {/* Brand Name */}
              {column.brandName && (
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b" style={{ borderColor: '#D4AF37' }}>
                  {column.brandName}
                </h3>
              )}

              {/* Items List */}
              {column.items && column.items.length > 0 && (
                <ul className="space-y-3">
                  {column.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-xs sm:text-sm md:text-base">
                      <span className="mt-1 flex-shrink-0" style={{ color: '#D4AF37' }}>•</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-secondary">{item.name}: </span>
                        <span className="text-secondary font-semibold">{item.price}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Certificate of Authenticity Image */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="bg-secondary p-2 sm:p-3 md:p-4 rounded-lg shadow-lg">
            <img 
              src={certificateImage} 
              alt="Certificate of Authenticity" 
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Prices.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  note: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      brandName: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          price: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  className: PropTypes.string,
};

export default Prices;
