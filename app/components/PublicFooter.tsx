import { GitBranchPlus, Github, GraduationCap, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

function PublicFooter() {
  return (
    <div className="flex flex-col bg-black text-white h-[40vh] p-16">
      {/* FOOTER LINKS */}
      <div className=" flex flex-row justify-between pb-16">
        <div className="w-2/5 flex flex-col">
          {/* BRANDING */}
          <div className="text-white flex flex-row items-center gap-3">
            <GraduationCap size={48} />
            <h1 className="text-3xl font-bold">Gradia</h1>
          </div>

          {/* SUBHEADING */}
          <div className="text-white/72 mt-6">
            <p>
              The leading platform for secure, scalable, and intelligent
              assessments.
            </p>
            <p>Trusted by educators worldwide.</p>
          </div>
        </div>

        {/* PAGE LINKS */}
        <div className="flex flex-row justify-between text-white gap-x-48 mr-40">
          {/* PRODUCT LINKS */}
          <div className="flex flex-col justify-left gap-6">
            <h1 className="tracking-wider font-semibold">PRODUCT</h1>
            {/* Links */}
            <div className="flex flex-col gap-2 text-white/60 ">
              <Link href="/features" className="hover:text-white/80">
                Features
              </Link>
              <Link href="/integrations" className="hover:text-white/80">
                Integrations
              </Link>
              <Link href="/security" className="hover:text-white/80">
                Security
              </Link>
              <Link href="/pricing" className="hover:text-white/80">
                Pricing
              </Link>
            </div>
          </div>

          {/* RESOURCES LINKS */}
          <div className="flex flex-col justify-left gap-6">
            <h1 className="tracking-wider font-semibold">RESOURCES</h1>
            {/* Links */}
            <div className="flex flex-col gap-2 text-white/60 ">
              <Link href="/documentation" className="hover:text-white/80">
                Documentation
              </Link>
              <Link href="/api-reference" className="hover:text-white/80">
                API Reference
              </Link>
              <Link href="/case-studies" className="hover:text-white/80">
                Case Studies
              </Link>
              <Link href="/blog" className="hover:text-white/80">
                Blog
              </Link>
            </div>
          </div>

          {/* COMPANY LINKS */}
          <div className="flex flex-col justify-left gap-6">
            <h1 className="tracking-wider font-semibold">COMPANY</h1>
            {/* Links */}
            <div className="flex flex-col gap-2 text-white/60 ">
              <Link href="/about-us" className="hover:text-white/80">
                About Us
              </Link>
              <Link href="/careers" className="hover:text-white/80">
                Careers
              </Link>
              <Link href="/legal" className="hover:text-white/80">
                Legal
              </Link>
              <Link href="/contact" className="hover:text-white/80">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHTS & SOURCE CODE */}
      <div className="flex flex-row justify-between items-center border-t border-white/50 py-8">
      {/* COPYRIGHT */}
            <div className="text-gray-400 ">
                &copy; 2026 Gradia Inc. All rights reserved.
            </div>

            {/* SOURCE CODE */}
            <div className="text-white flex flex-row items-center gap-8">
                <Link href="/source-code"><Github /></Link>
                <Link href="/socials"><Twitter /></Link>
            </div>
      </div>
    </div>
  );
}

export default PublicFooter;
