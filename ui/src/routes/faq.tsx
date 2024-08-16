import {useState} from 'react';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  heading: string;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  {
    heading: 'Searching for your stay',
    faqs: [
      {
        question: 'How do I search for a vacation rental on StayEase?',
        answer:
          'Simply enter your destination and travel dates in the search bar on our homepage. Click "Search" to view available properties.',
      },
      {
        question: 'Can I filter search results based on specific amenities?',
        answer:
          'Yes, you can use our filter options to narrow down results based on amenities like Wi-Fi, kitchen, parking, air conditioning, and more.',
      },
      {
        question:
          'Is it possible to search for properties within a certain price range?',
        answer:
          'Absolutely. Use the price slider in our filter options to set your minimum and maximum budget per night.',
      },
    ],
  },
  {
    heading: 'Booking and Payments',
    faqs: [
      {
        question: 'How do I book a property on StayEase?',
        answer:
          '1. Search for your desired location and dates. \n 2. Select a property you like. \n 3. Click "Reserve". \n 4. Review the details and total price. \n 5. Enter your payment information. \n 6. Confirm your booking.',
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards, debit cards and PayPal.',
      },
      {
        question: 'Can I cancel my booking?',
        answer:
          'Yes, you can cancel your booking subject to the cancellation policy of the property.',
      },
    ],
  },
  {
    heading: 'Check-in and Check-out',
    faqs: [
      {
        question: 'What time can I check in?',
        answer:
          'The standard check-in time is typically between 3 PM and 4 PM, but always refer to your booking confirmation for the exact time.',
      },
      {
        question: 'Is early check-in possible?',
        answer:
          "Early check-in may be possible depending on the property's availability. Contact your host directly to request early check-in.",
      },
      {
        question: "What's the typical check-out time?",
        answer:
          'Check-out times vary, but are usually between 10 AM and 11 AM. Always refer to your booking details for the specific check-out time.',
      },
    ],
  },
];

export const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<{
    category: number;
    index: number;
  } | null>(null);

  const toggleFaq = (category: number, index: number) => {
    if (activeIndex?.category === category && activeIndex.index === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex({category, index});
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-4xl text-center font-bold mb-6 text-primary">
        Frequently Asked Questions
      </h2>
      {faqCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-6">
          <h3 className="text-2xl font-bold mb-4">{category.heading}</h3>
          <div className="space-y-4">
            {category.faqs.map((faq, faqIndex) => (
              <div key={faqIndex} className="border-b">
                <button
                  className="w-full text-left flex justify-between items-center py-2"
                  onClick={() => toggleFaq(catIndex, faqIndex)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span>
                    {activeIndex?.category === catIndex &&
                    activeIndex.index === faqIndex ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                </button>
                {activeIndex?.category === catIndex &&
                  activeIndex.index === faqIndex && (
                    <p className="mt-2 text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
