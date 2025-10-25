// Helper functions to generate JSON-LD structured data for SEO

export const generateVehicleStructuredData = (vehicle) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Car",
    "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    "brand": {
      "@type": "Brand",
      "name": vehicle.make
    },
    "model": vehicle.model,
    "productionDate": vehicle.year.toString(),
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "fuelType": vehicle.fuelType
    },
    "vehicleTransmission": vehicle.transmission,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": vehicle.mileage,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": vehicle.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": vehicle.dealer || "AutoMarket"
      }
    },
    "image": vehicle.image,
    "description": vehicle.description || `${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage} miles`
  };
};

export const generateDealerStructuredData = (dealer) => {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": dealer.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": dealer.address,
      "addressLocality": dealer.city,
      "addressRegion": dealer.state,
      "postalCode": dealer.zip
    },
    "telephone": dealer.phone,
    "aggregateRating": dealer.rating ? {
      "@type": "AggregateRating",
      "ratingValue": dealer.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": dealer.reviewCount || 1
    } : undefined,
    "image": dealer.logo,
    "url": `https://automarket.com/dealers/${dealer.id}`
  };
};

export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AutoMarket Professional",
    "url": "https://automarket.com",
    "logo": "https://automarket.com/logo.png",
    "description": "Professional Auto Marketplace - Buy, Sell, and Compare Vehicles",
    "sameAs": [
      "https://facebook.com/automarket",
      "https://twitter.com/automarket",
      "https://instagram.com/automarket"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-AUTO-MKT",
      "contactType": "customer service",
      "availableLanguage": ["English", "Romanian", "German"]
    }
  };
};

export const generateBreadcrumbStructuredData = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const injectStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
  return () => document.head.removeChild(script);
};
