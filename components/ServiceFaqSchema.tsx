export default function ServiceFaqSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which solar system size is best for homes in Prayagraj?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most homes install 1kW to 3kW solar systems depending on electricity consumption.",
        },
      },
      {
        "@type": "Question",
        name: "How long do solar panels last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Solar panels typically last 25 years with minimal maintenance.",
        },
      },
      {
        "@type": "Question",
        name: "Is rooftop solar safe for buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Professional rooftop solar installation is completely safe and engineered for structural stability.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}
