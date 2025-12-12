import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Default Marker Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Bangladesh-wide Locations
const locations = [
  { id: 1, name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { id: 2, name: "Chittagong", lat: 22.3569, lng: 91.7832 },
  { id: 3, name: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { id: 4, name: "Rajshahi", lat: 24.3636, lng: 88.6241 },
  { id: 5, name: "Khulna", lat: 22.8456, lng: 89.5403 },
  { id: 6, name: "Barishal", lat: 22.701, lng: 90.3535 },
  { id: 7, name: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { id: 8, name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { id: 9, name: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
  { id: 10, name: "Cumilla", lat: 23.4607, lng: 91.1809 },
];

// 🔥 This component handles zoom + fly animation when search matches
const MapZoomHandler = ({ filtered }) => {
  const map = useMap();

  // If exactly one location is found → Zoom into it
  if (filtered.length === 1) {
    const loc = filtered[0];
    map.flyTo([loc.lat, loc.lng], 10, { duration: 2 });
  }

  // If no search → Reset zoom
  if (filtered.length === locations.length) {
    map.flyTo([23.685, 90.3563], 7, { duration: 2 });
  }

  return null;
};

const ServiceCoverage = () => {
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-6 sm:p-10"
    >
      <div className="w-full max-w-5xl mx-auto bg-white/5 backdrop-blur-lg border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl text-center text-blue-400 font-extrabold drop-shadow-lg">
          Coverage Area
        </h1>
        

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full sm:w-2/3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search locations... (e.g., Sylhet, Khulna)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-blue-400/20 px-10 py-3 rounded-xl text-gray-200
                         focus:outline-none focus:border-blue-400 focus:shadow-[0_0_15px_rgba(37,99,235,0.4)]
                         transition"
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-10 w-full h-[500px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-blue-500/20">
          <MapContainer
            center={[23.685, 90.3563]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Zoom Controller */}
            <MapZoomHandler filtered={filteredLocations} />

            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={new L.Icon.Default()}
              >
                <Popup>
                  <div className="font-semibold text-gray-900">{loc.name}</div>
                  <p className="text-sm text-gray-600">Service Available</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List Section */}
        <div className="mt-10">
          <h2 className="text-2xl text-blue-300 font-semibold mb-3">
            📍 Covered Districts
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-300">
            {filteredLocations.map((loc) => (
              <motion.div
                key={loc.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 rounded-xl border border-blue-400/20 p-4 text-center shadow-md"
              >
                {loc.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCoverage;
