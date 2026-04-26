export default function FaqSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the cost of solar panel installation in Prayagraj?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Solar installation cost depends on system size such as 1kW, 2kW, 3kW or 5kW rooftop solar systems. Contact Vasudhaiv Enterprises for a free rooftop survey and accurate quotation.",
        },
      },
      {
        "@type": "Question",
        name: "Is solar subsidy available in Prayagraj?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Residential rooftop solar systems are eligible for central government subsidy in Uttar Pradesh. Vasudhaiv Enterprises provides complete subsidy assistance.",
        },
      },
      {
        "@type": "Question",
        name: "How much electricity bill can solar panels reduce?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Solar panels can reduce electricity bills by up to 80–90% depending on system capacity and energy usage.",
        },
      },
      {
        "@type": "Question",
        name: "How long does solar installation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most rooftop solar installations in Prayagraj are completed within 1–3 days after approvals.",
        },
      },
      {
        "@type": "Question",
        name: "Does Vasudhaiv Enterprises provide net metering support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We assist customers with documentation and approval process for net metering connection.",
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
