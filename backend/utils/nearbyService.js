const axios = require("axios");

const GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places";

const formatDistance = (meters) => {
  if (!meters) return "Distance unavailable";
  return `${(meters / 1000).toFixed(1)} km`;
};

exports.getNearbyHospitals = async (lat, lng) => {
  try {
    if (!process.env.GEOAPIFY_API_KEY) {
      console.error("Missing GEOAPIFY_API_KEY");
      return [];
    }

    const response = await axios.get(GEOAPIFY_PLACES_URL, {
      params: {
        categories: "healthcare.hospital",
        filter: `circle:${lng},${lat},25000`,
        bias: `proximity:${lng},${lat}`,
        limit: 10,
        apiKey: process.env.GEOAPIFY_API_KEY
      },
      timeout: 10000
    });

    const hospitals = response.data?.features || [];

    return hospitals.map((item) => {
      const properties = item.properties || {};
      const coordinates = item.geometry?.coordinates || [];

      const hospitalLng = properties.lon || coordinates[0];
      const hospitalLat = properties.lat || coordinates[1];

      return {
        name: properties.name || properties.address_line1 || "Nearby Hospital",
        address: properties.formatted || "Address unavailable",
        lat: hospitalLat,
        lng: hospitalLng,
        distance: formatDistance(properties.distance),
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${hospitalLat},${hospitalLng}`
      };
    });
  } catch (error) {
    console.error(
      "Geoapify hospital lookup failed:",
      error.response?.data || error.message
    );

    return [];
  }
};
