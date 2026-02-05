import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

function PublicNavbar() {
  return (
    <nav className="flex flex-row items-center justify-between px-16 py-6 text-black border-b border-gray-500/30">
      {/* BRAND LOGO */}
      <div className="text-primary-button flex flex-row items-center gap-2">
        <GraduationCap size={40} />
        <h1 className="text-2xl text-black font-bold">Gradia</h1>
      </div>

      {/* CENTRAL NAVIGATION */}
      <div className="flex flex-row items-center gap-8 text-gray-600">
        <Link href="/solutions" className="hover:cursor-pointer">
          Solutions
        </Link>
        <Link href="/platform" className="hover:cursor-pointer">
          Platform
        </Link>
        <Link href="/customers" className="hover:cursor-pointer">
          Customers
        </Link>
        <Link href="/pricing" className="hover:cursor-pointer">
          Pricing
        </Link>
      </div>

      {/* LOGIN & GET STARTED BUTTONS */}
      <div className="flex flex-row items-center gap-4 font-semibold">
        <Link href="/auth/sign-in" className="">
          Log In
        </Link>
        <Link
          href="/auth/sign-up"
          className="px-4 py-2 bg-primary-button rounded-md text-white"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default PublicNavbar;
