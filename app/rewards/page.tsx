"use client";

import { useState } from "react";
import { PiCoinsDuotone, PiCoinsFill } from "react-icons/pi";

export default function Rewards() {
  const [points, setPoints] = useState(1200); // Example points, replace with actual data
  const [vouchers, setVouchers] = useState([
    { id: 1, brand: "Amazon", offer: "10% off", pointsRequired: 500, bgClass: "bg-img-secondary", redeemed: false },
    { id: 2, brand: "Starbucks", offer: "Free Coffee", pointsRequired: 300, bgClass: "bg-img-teritary", redeemed: false },
    { id: 3, brand: "Nike", offer: "$20 Gift Card", pointsRequired: 800, bgClass: "bg-img-secondary", redeemed: false },
    { id: 4, brand: "Uber", offer: "50% off Ride", pointsRequired: 600, bgClass: "bg-img-teritary", redeemed: false },
  ]);

  const handleRedeem = (id: number, pointsRequired: number) => {
    if (points >= pointsRequired) {
      setVouchers(vouchers.map(voucher => 
        voucher.id === id ? { ...voucher, redeemed: true } : voucher
      ));
      setPoints(points - pointsRequired);
      alert("Voucher redeemed successfully!");
    } else {
      alert("Not enough points to redeem this voucher.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Rewards</h1>
      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-8 flex flex-col items-center justify-center">
        <p className="text-md font-semibold ">Total Earnings</p>
        <h2 className="text-4xl flex items-center justify-center">{points} <PiCoinsFill className="ml-2 text-primary" /></h2>
        <span className="">coins</span> 
      </div>
      <div className="rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Redeem Your Points</h2>
        <ul className="space-y-4">
          {vouchers.map((voucher) => (
            <li key={voucher.id} className={`p-4 rounded-lg shadow-md flex justify-between items-center ${voucher.bgClass} bg-cover bg-center`}>
              <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                <h3 className="text-xl font-bold">{voucher.brand}</h3>
                <p>{voucher.offer}</p>
              </div>
              <div className="text-white flex items-center justify-center gap-2 p-4 rounded-lg">
                <p className="text-lg font-semibold">{voucher.pointsRequired} Points</p>
                {voucher.redeemed ? (
                  <span className="px-4 py-2 bg-green-500 text-white rounded-full">Redeemed</span>
                ) : (
                  <button 
                    onClick={() => handleRedeem(voucher.id, voucher.pointsRequired)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    Redeem
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}