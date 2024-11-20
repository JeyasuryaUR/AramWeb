"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IoLocateOutline } from "react-icons/io5";

interface MapComponentProps {
  latitude: number;
  longitude: number;
}

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LocateButton: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const map = useMap();

  const handleLocate = () => {
    map.setView([latitude, longitude], 15); // Set the view to the pin's position with a zoom level of 15
  };

  return (
    <button
      onClick={handleLocate}
      className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 flex items-center justify-center"
      style={{ width: "40px", height: "40px" }}
    >
      <IoLocateOutline size={24} />
    </button>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        dragging={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon} />
        <LocateButton latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;