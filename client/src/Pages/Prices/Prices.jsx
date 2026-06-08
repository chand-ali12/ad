import { useState } from 'react';
import pricingImage from '../../assets/images/pricing.png';

const leftColumnBrands = [
  {
    brandName: 'Louis Vuitton',
    items: [
      { name: 'Regular Bags and Accessories', price: '$12' },
      { name: 'Jewelry and Watches', price: '$20' },
      { name: 'Microchipped Bags and Accessories', price: '$20' },
      { name: 'Takashi Murakami Edition', price: '$20' },
      { name: 'Trunks', price: '$35' },
      { name: 'Exotic Leather Bags and Accessories', price: '$35' },
    ],
  },
  {
    brandName: 'Hermès',
    items: [
      { name: 'Small Leather Goods and Accessories', price: '$35' },
      { name: 'Shoes', price: '$35' },
      { name: 'Regular Bags', price: '$60' },
      { name: 'Exotic Leather Bags', price: '$90' },
      { name: 'Jewelry', price: '$35' },
    ],
  },
];

const rightColumnBrands = [
  {
    brandName: 'Chanel',
    items: [
      { name: 'Small Leather Goods and Accessories', price: '$20' },
      { name: 'Shoes', price: '$20' },
      { name: 'Regular Bags', price: '$35' },
      { name: 'Exotic Leather Bags', price: '$50' },
      { name: 'Jewelry', price: '$20' },
    ],
  },
  {
    brandName: 'Tiffany & Co.',
    items: [
      { name: 'Bags and Accessories', price: '$12' },
      { name: 'Jewelry', price: '$20' },
    ],
  },
  {
    brandName: 'All Other',
    items: [
      { name: 'Jewelry', price: '$20' },
    ],
  },
];

function getExpeditedPrice(standardPrice) {
  const num = parseInt(standardPrice.replace('$', ''), 10);
  if (num === 12) return '$25';
  return `$${num + 15}`;
}

function BrandBlock({ brand, activeTab }) {
  return (
    <div
      style={{
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          color: '#3C1F1B',
          borderBottom: '1.5px solid #D4AF37',
          paddingBottom: '4px',
          marginBottom: '6px',
        }}
      >
        {brand.brandName}
      </h2>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {brand.items.map((item, i) => {
          const displayPrice =
            activeTab === 'expedited'
              ? getExpeditedPrice(item.price)
              : item.price;
          return (
            <li
              key={i}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#3C1F1B',
                lineHeight: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginTop: '8px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#D4AF37',
                  flexShrink: 0,
                }}
              />
              <span>{item.name}: {displayPrice}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const Prices = () => {
  const [activeTab, setActiveTab] = useState('standard');

  return (
    <>
      {/* Inject responsive styles */}
      <style>{`
        .prices-body {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px 40px;
          align-items: start;
          border: none;
        }
        .prices-rows {
          display: grid;
          grid-template-rows: auto auto;
          grid-template-columns: 1fr 1fr;
          gap: 24px 24px;
          align-items: start;
        }
        .prices-rows .prices-cell {
          min-width: 0;
        }

        .prices-card {
          padding: 28px 36px 36px 36px;
        }

        .prices-title {
          font-size: 38px;
        }

        .prices-image-col {
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(0,0,0,0.12);
          border: none;
          background: #fff;
          padding: 15px;
          box-sizing: border-box;
        }

        .tab-btn {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 700;
          padding: 8px 28px;
          border-radius: 25px;
          border: 2px solid #D4AF37;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          letter-spacing: 0.5px;
        }
        .tab-btn.active {
          background: #D4AF37;
          color: #3C1F1B;
        }
        .tab-btn.inactive {
          background: transparent;
          color: #3C1F1B;
        }
        .tab-btn.inactive:hover {
          background: rgba(212,175,55,0.15);
        }

        /* Tablet — stack image on top, then 2-row grid below */
        @media (max-width: 1024px) {
          .prices-body {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .prices-rows {
            grid-template-columns: 1fr 1fr;
          }
          .prices-image-col {
            max-width: 380px;
            margin: 0 auto;
          }
          .prices-card {
            padding: 28px 32px 36px 32px;
          }
          .prices-title {
            font-size: 32px;
          }
        }

        /* Mobile — single column, everything stacked */
        @media (max-width: 640px) {
          .prices-body {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .prices-rows {
            grid-template-columns: 1fr;
          }
          .prices-image-col {
            max-width: 100%;
          }
          .prices-card {
            padding: 24px 20px 32px 20px;
          }
          .prices-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: '#3C1F1B',
        }}
      >
        {/* Outer wrapper */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '100px',
            paddingBottom: '60px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {/* CARD */}
          <div
            className="prices-card"
            style={{
              width: '100%',
              maxWidth: '1320px',
              borderRadius: '18px',
              backgroundColor: '#F8F6F2',
              boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
              boxSizing: 'border-box',
              border: 'none',
              outline: 'none',
            }}
          >
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1
                className="prices-title"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 800,
                  color: '#3C1F1B',
                  margin: '0 0 16px',
                }}
              >
                Prices
              </h1>

              {/* Tab Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                <button
                  className={`tab-btn ${activeTab === 'standard' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('standard')}
                >
                  Standard
                </button>
                <button
                  className={`tab-btn ${activeTab === 'expedited' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('expedited')}
                >
                  Expedited
                </button>
              </div>

              <p
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3C1F1B',
                  margin: '0 0 2px',
                }}
              >
                $12 Including a Certificate
              </p>
              <p
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#3C1F1B',
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                *exclusions apply below
              </p>
            </div>

            {/* BODY */}
            <div className="prices-body">

              {/* Col 1 — Certificate image with 15px white border on all sides */}
              <div className="prices-image-col">
                <img
                  src={pricingImage}
                  alt="Certificate of Authenticity"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              {/* Row 1: Louis Vuitton | Chanel — Row 2: Hermès | Tiffany & Co. + All Other — lines align in parallel */}
              <div className="prices-rows">
                <div className="prices-cell">
                  <BrandBlock brand={leftColumnBrands[0]} activeTab={activeTab} />
                </div>
                <div className="prices-cell">
                  <BrandBlock brand={rightColumnBrands[0]} activeTab={activeTab} />
                </div>
                <div className="prices-cell">
                  <BrandBlock brand={leftColumnBrands[1]} activeTab={activeTab} />
                </div>
                <div className="prices-cell">
                  <BrandBlock brand={rightColumnBrands[1]} activeTab={activeTab} />
                  <BrandBlock brand={rightColumnBrands[2]} activeTab={activeTab} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prices;
