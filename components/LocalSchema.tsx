export default function LocalSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SolarEnergyContractor",
          name: "Vasudhaiv Enterprises",
          areaServed: "Prayagraj",
          url: "https://www.vasudhaiventerprises.in",
          serviceType: "Solar Panel Installation",
        }),
      }}
    />
  );
}
