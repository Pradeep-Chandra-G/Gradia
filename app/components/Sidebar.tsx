"use client";

import {
  ChartNoAxesColumn,
  Database,
  FileText,
  LayoutDashboard,
  Loader,
  Settings,
  Users,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import Link from "next/link";
import {
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";

function Sidebar() {
  const user = useUser();
  const firstName = user.user?.firstName;
  const lastName = user.user?.lastName;
  const email = user.user?.primaryEmailAddress?.emailAddress;
  const signedIn = user.isSignedIn;

  useEffect(() => {}, [signedIn]);

  return (
    <div className="flex flex-col w-1/6 h-screen bg-background border-r border-white/10 justify-between">
      <div>
        {/* MAIN LOGO */}
        <BrandLogo />

        {/* SIDEBAR ITEMS */}
        <div className="flex flex-col px-4 md:block sm:scale-90 lg:scale-100">
          <ul className="space-y-2 select-none ">
            <li>
              <Link
                href={"/dashboard"}
                className="flex flex-row items-center gap-2 bg-primary-button rounded-md p-2 text-md font-bold active:bg-primary-button/90"
              >
                <LayoutDashboard size={24} /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                href={"/quiz"}
                className="flex flex-row items-center gap-2 p-2 text-md font-semibold active:bg-white/5 rounded-md"
              >
                <FileText size={24} /> Quiz
              </Link>
            </li>

            <li>
              <Link
                href={"/notes"}
                className="flex flex-row items-center gap-2 p-2 text-md font-semibold active:bg-white/5 rounded-md"
              >
                <Database size={22} /> Notes
              </Link>
            </li>
            <li>
              <Link
                href={"/results"}
                className="flex flex-row items-center gap-2 p-2 text-md font-semibold active:bg-white/5 rounded-md"
              >
                <ChartNoAxesColumn size={22} /> Results
              </Link>
            </li>
            <li>
              <Link
                href={"/users"}
                className="flex flex-row items-center gap-2 p-2 text-md font-semibold active:bg-white/5 rounded-md"
              >
                <Users size={22} /> Users
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* USER SETTINGS */}
        <div>
          <Link
            href={"/settings"}
            className="flex flex-row items-center p-2 gap-2 mb-2 hover:bg-foreground active:bg-foreground/80 rounded-md text-xl font-semibold"
          >
            <Settings />
            Settings
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="w-[90%] bg-white/10 p-px"></div>

        {/* AVATAR */}
        <div className="flex flex-row gap-4 p-4 items-center select-none">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <ClerkLoading>
            <div className="text-gray-500 p-2 flex flex-row items-center gap-2">
              <Loader className="animate-spin" /> Fetching user info
            </div>
          </ClerkLoading>

          <div className="flex flex-col">
            <h1 className="text-md font-semibold">
              {firstName} {lastName}
            </h1>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
