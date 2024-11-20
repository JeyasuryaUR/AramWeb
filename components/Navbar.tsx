"use client";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLocationDot, FaPowerOff } from "react-icons/fa6";
import { MdSos } from "react-icons/md";

export default function Navbar() {
  const [user] = useAuthState(auth);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  return (
    <nav className="shadow-md px-2 md:px-6 py-2">
      <div className="container mx-auto px-2 md:px-4 py-2 flex justify-between items-center">
        <div className="flex flex-col items-center justify-center md:flex-row gap-0 md:gap-4">
          <Link
            href="/"
            className="text-2xl md:text-4xl h-full font-bold font-primary "
          >
            Aram
          </Link>
          <div className="relative w-full flex">
            <div className="flex items-center text-xs md:text-lg justify-center border border-yellow-300 px-2 rounded-md">
              <FaLocationDot />
              <select
                defaultValue={""}
                className="px-2 py-2 border-none outline-none bg-transparent"
              >
                <option value="" disabled>
                  Select Location
                </option>
                <option value="adyar">Adyar</option>
                <option value="anna-nagar">Anna Nagar</option>
                <option value="besant-nagar">Besant Nagar</option>
                <option value="chromepet">Chromepet</option>
                <option value="kodambakkam">Kodambakkam</option>
                <option value="mylapore">Mylapore</option>
                <option value="nungambakkam">Nungambakkam</option>
                <option value="t-nagar">T. Nagar</option>
                <option value="velachery">Velachery</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Link href="/sos">
            <div className="bg-gradient-to-b from-red-400 to-red-600 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded-md shadow-md hover:shadow-sm transition-all duration-300 ease-in-out">
              <MdSos className="h-8 w-8 md:h-10 md:w-10" />
            </div>
          </Link>
          <div className="space-x-4">
            {user ? (
              <div className="flex items-center bg-white w-full md:p-3 p-2 rounded-xl shadow-sm md:shadow-md">
                <div className="userDetails ml-3">
                  <Link
                    href="/profile"
                    className="name text-base text-gray-700 font-bold hover:text-primary hover:cursor-pointer"
                  >
                    <span className="hidden sm:inline">
                      {user.displayName || "User"}
                    </span>
                    <span className="inline sm:hidden">
                      {getInitials(user.displayName || "User")}
                    </span>
                  </Link>
                  <div className="hidden md:flex username text-xs text-gray-600">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-4 md:p-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FaPowerOff />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
