import React from "react";

const MapView: React.FC = () => {
  return (
    <section className="text-center">
      <h1 className="text-3xl font-semibold mb-4">Temperature Map</h1>
      <p className="text-gray-600">
        This section will display a heat map centered on the chosen city.
      </p>
    </section>
  );
};

export default MapView;
