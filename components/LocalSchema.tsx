export default function LocalSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SolarEnergyContractor",
          name: "Vasudhaiv Enterprises",
          url: "https://www.vasudhaiventerprises.in",
          serviceType: "Solar Panel Installation",
          areaServed: {
            "@type": "State",
            "name": "Uttar Pradesh"
          },
          geo: {
            "@type": "GeoCoordinates",
            "latitude": 25.4358,
            "longitude": 81.8463
          }
        }),
      }}
    />
  );
}
