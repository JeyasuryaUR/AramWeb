"use client";
import { FaHandsHelping, FaHeartbeat, FaPaw, FaUtensils } from "react-icons/fa";

export default function Helperhood() {
  return (
    <div className="mx-auto p-4 min-h-screen max-w-5xl">
      {/* Hero Section */}
      <section className="text-center rounded-md py-10 bg-img-secondary text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Helperhood</h1>
        <p className="text-xl mb-8">
          Join our community and make a difference by helping those in need.
        </p>
        <button className="bg-white text-blue-500 hover:bg-gray-200 px-6 py-3 rounded-full">
          Get Started
        </button>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className=" ">
          <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaHeartbeat className="text-red-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Blood Donation</h3>
              <p className="text-gray-600">
                Help save lives by donating blood to those in need.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaPaw className="text-yellow-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Animal Rescue</h3>
              <p className="text-gray-600">
                Assist in rescuing and caring for injured animals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaUtensils className="text-green-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Food Assistance</h3>
              <p className="text-gray-600">
                Provide food to those who are struggling to get meals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaHandsHelping className="text-blue-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">General Help</h3>
              <p className="text-gray-600">
                Offer your help in various ways to support the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-12 px-4 bg-img-secondary rounded-md text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8">
          Join Helperhood today and start helping those in need.
        </p>
        <button className="bg-white text-blue-500 hover:bg-gray-200 px-6 py-3 rounded-full">
          Join Now
        </button>
      </section>
    </div>
  );
}