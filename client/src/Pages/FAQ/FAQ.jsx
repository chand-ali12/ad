import React from 'react';
import { Link } from 'react-router-dom';

const faqItems = [
  {
    question: 'What is authentication?',
    answer: [
      'Authentication is the process of verifying whether an item is genuine or counterfeit. At Authentic Detective, our experts examine brand-specific details such as materials, construction, serial numbers, fonts, stitching, and manufacturing techniques to determine authenticity.',
    ],
  },
  {
    question: 'Do you use AI to authenticate items?',
    answer: [
      'No. Authentic Detective uses only trained human experts to authenticate items.',
      'While some companies rely on artificial intelligence, we believe luxury authentication requires experienced specialists who understand the subtle details that machines often miss. Every item is reviewed by an experienced authenticator.',
    ],
  },
  {
    question: 'What brands do you authenticate?',
    answer: [
      'Authentic Detective authenticates more than 120 luxury brands including handbags, jewelry, apparel, sneakers, and accessories from top designers.',
      <>
        For full details, please visit our{' '}
        <Link to="/brands" className="text-blue-600 hover:underline font-medium">
          Supported Brands Page
        </Link>
        .
      </>,
    ],
  },
  {
    question: 'What items can be authenticated?',
    answer: ['We authenticate a wide range of luxury goods including:'],
    list: [
      'Handbags',
      'Wallets & small leather goods',
      'Jewelry',
      'Apparel',
      'Sneakers',
      'Accessories',
    ],
  },
  {
    question: 'How long does authentication take?',
    answer: [
      'Our standard turnaround time is 12-24 hours, although many authentications are completed within one hour depending on the item and submission quality.',
    ],
  },
  {
    question: 'How much does authentication cost?',
    answer: [
      'Pricing starts at $12 and varies depending on the brand, item type, and service speed.',
      <>
        For full details, please visit our{' '}
        <Link to="/prices" className="text-blue-600 hover:underline font-medium">
          Prices Page
        </Link>
        .
      </>,
    ],
  },
  {
    question: 'What do I receive after authentication?',
    answer: [
      'Every order includes a digital Certificate of Authenticity (COA) that can be downloaded and shared with buyers, marketplaces, or insurance providers.',
    ],
  },
  {
    question: 'What photos do I need to submit?',
    answer: [
      'Our system will guide you through the exact photos required for your item.',
      'In most cases, you will need to submit clear photos of:',
      'Providing clear photos helps ensure faster and more accurate authentication.',
    ],
    list: [
      'Front and back of the item',
      'Interior',
      'Brand stamps or logos',
      'Serial numbers or date codes',
      'Hardware and stitching details',
    ],
  },
  {
    question: 'What if my item is counterfeit?',
    answer: [
      'If an item is determined to be counterfeit, the report will clearly state that the item is not authentic.',
    ],
  },
  {
    question: 'Can I authenticate multiple items at once?',
    answer: ['Yes. We offer bulk authentication services for resellers, stores, and high-volume clients.'],
  },
  {
    question: 'Are your authentications accepted by marketplaces?',
    answer: ['Yes. Our authentications are recognized by major resale marketplaces and platforms.'],
  },
  {
    question: 'Do you provide market valuations?',
    answer: ['Yes. Authentic Detective can provide market valuation estimates for authenticated items when requested.'],
  },
  {
    question: 'Why choose Authentic Detective?',
    answer: [
      'Authentic Detective offers a boutique authentication experience with fast turnaround times, expert analysts, and personalized service trusted by resellers and collectors.',
    ],
  },
  {
    question: 'Do you authenticate both vintage and new items?',
    answer: [
      'Yes. We authenticate items from pre-serial-number vintage pieces all the way to the newest NFC-chipped releases.',
      'Our authenticators are trained to evaluate products from multiple manufacturing eras, including early vintage production, serial number systems, microchip integrations, and modern security features used in current collections.',
    ],
  },
];

const FAQ = () => {
  return (
    <div className="bg-[#F5F1E9] min-h-screen py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-[min(1200px,96vw)] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-primary">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="text-[clamp(1.1rem,6vw,2.25rem)] font-bold whitespace-nowrap leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-primary/80 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about authentication, turnaround times, pricing, and what to expect from Authentic Detective.
          </p>
        </header>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {faqItems.map((item) => (
            <section
              key={item.question}
              className="bg-white rounded-xl border border-[#e8dfcf] p-4 sm:p-5 md:p-6 shadow-sm"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold leading-snug">{item.question}</h2>

              <div className="mt-3 sm:mt-4 space-y-3">
                {item.answer.map((paragraph, index) => (
                  <p key={`${item.question}-${index}`} className="text-sm sm:text-base leading-relaxed text-primary/90">
                    {paragraph}
                  </p>
                ))}

                {item.list && (
                  <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base leading-relaxed text-primary/90 space-y-1">
                    {item.list.map((listItem) => (
                      <li key={listItem}>{listItem}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
