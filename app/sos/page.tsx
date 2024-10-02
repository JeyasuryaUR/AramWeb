"use client";

import { useState } from "react";

export default function SosPage() {

  const handleYesClick = () => {
    // Handle the emergency call logic here
    alert("Emergency call initiated!");
  };

  return (
    <div className="mx-auto p-4 flex flex-col items-center justify-center max-w-4xl ">
      <h1 className="text-3xl font-bold mb-4">SOS</h1>
      <div className="bg-img-teritary p-4 rounded-lg shadow-md w-full text-center">
        <p className="text-lg mb-4">
          Are you sure you want to call an emergency to the local medical support and Aram Users?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleYesClick}
            className="px-4 py-2 bg-green-400 text-black rounded-full hover:bg-green-600"
          >
            Yes
          </button>
          <button
            
            className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
      <div className="mt-8 bg-blue-100 p-4 rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold mb-4">How SOS Works?</h2>
          <p className="mb-2">
            By clicking the SOS button, you register an emergency to yourself to the local police station and Aram Users.
          </p>
          <p className="mb-2">
            Before the arrival of cops, there might be an Aram user to help you out.
          </p>
          <p className="mb-2">
            This feature mainly addresses women and children safety.
          </p>
          <p className="mb-2">
            By clicking SOS once, your location, name, and Aadhar details are sent to the cops, whereas your location and pictures alone are sent to the Aram users.
          </p>
        </div>
    </div>
  );
}