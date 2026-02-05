import {
  CircleCheck,
  Code,
  Droplet,
  Earth,
  Eye,
  FileText,
  Flame,
  LucideIcon,
  Tornado,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type TrustedSection = {
  icon: LucideIcon;
  firstWord: string;
  secondWord: string;
};

function Hero() {
  const trustedSection: TrustedSection[] = [
    {
      icon: Flame,
      firstWord: "Flame",
      secondWord: "University",
    },
    {
      icon: Droplet,
      firstWord: "Water",
      secondWord: "College",
    },
    {
      icon: Tornado,
      firstWord: "Tornado",
      secondWord: "Institute",
    },
    {
      icon: Earth,
      firstWord: "Earth",
      secondWord: "Academy",
    },
    {
      icon: Zap,
      firstWord: "Lightning",
      secondWord: "School",
    },
  ];
  return (
    <div className="text-black flex flex-col flex-1">
      {/* PAGE - 1 */}
      <div className="flex flex-row items-center justify-between px-24 py-36">
        {/* HERO SECTION */}
        <div className="flex flex-col select-none">
          {/* HERO TITLE */}
          <h1 className="text-6xl font-extrabold">Enterprise-Grade</h1>
          <h1 className="text-6xl font-extrabold">Assessments for</h1>
          <h1 className="text-6xl font-extrabold">Modern Education</h1>

          {/* HERO SUBTITLE */}
          <div className="py-4 text-gray-600/90">
            <h3>
              Secure, scalable, and intelligent testing solutions designed for
              high-
            </h3>
            <h3>stakes exams in schools, universities, and enterprises.</h3>
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-row items-center py-4 gap-4">
            <Link
              href="/get-started"
              className="px-6 py-3 bg-primary-button rounded-md text-white font-bold"
            >
              Book a Demo
            </Link>
            <Link
              href="/get-started"
              className="px-6 py-3 rounded-md border border-black/15 font-bold"
            >
              Try for Free
            </Link>
          </div>

          {/* SURETY BADGES */}
          <div className="py-2 flex flex-row items-center gap-6">
            <p className="flex flex-row items-center gap-2">
              <CircleCheck size={20} className="stroke-white fill-green-400" />
              No credit card required
            </p>
            <p className="flex flex-row items-center gap-2">
              <CircleCheck size={20} className="stroke-white fill-green-400" />
              14-day free trial
            </p>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="flex object-cover">
          <Image
            src="/image.png"
            alt="alt"
            width={728}
            height={10}
            className="rounded-xl"
            quality={100}
          />
        </div>
      </div>

      {/* TRUSTED BY SECTION */}
      <div className="bg-gray-50 py-16">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 tracking-wider">
            TRUSTED BY LEADING UNIVERSITIES AND TECH GIANTS
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-12 px-24">
          {trustedSection.map((obj, index) => {
            const Icon = obj.icon;

            return (
              <div
                key={index}
                className="w-24 h-24 bg-gray-300 rounded-lg flex flex-col items-center justify-center p-2 gap-1"
              >
                <Icon size={28} />

                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm">{obj.firstWord}</p>
                  <p className="text-sm">{obj.secondWord}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAGE - 2 - POWERING THE FUTURE */}
      <div className="px-24 py-32">
        <div className="flex flex-row items-center justify-between mb-16">
          <div>
            <h2 className="text-5xl font-bold mb-4">
              Powering the Future of Testing
            </h2>
            <p className="text-gray-600">
              Our platform provides the robust tools needed for secure and
              effective
            </p>
            <p className="text-gray-600">
              evaluations in a digital-first world.
            </p>
          </div>
          <Link
            href="/features"
            className="text-primary-button font-semibold hover:underline"
          >
            View all features →
          </Link>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">
              High-Reliability Exam Engine
            </h3>
            <p className="text-gray-600">
              Experience zero downtime with our fault-tolerant architecture
              designed for thousands of concurrent test-takers globally.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Code className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Coding Evaluations</h3>
            <p className="text-gray-600">
              Integrated IDE environment, supporting 40+ languages for accurate
              technical skills assessment with automated test cases.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Eye className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Proctoring</h3>
            <p className="text-gray-600">
              Advanced browser locking, webcam monitoring, and behavioral
              analysis to ensure integrity during remote exams.
            </p>
          </div>
        </div>
      </div>

      {/* PAGE - 3 - TAILORED SOLUTIONS */}
      <div className="bg-gray-50 px-24 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Tailored Solutions for Every Institution
          </h2>
          <p className="text-gray-600">
            Whether you&apos;re a small school or a global enterprise, Gradia
            scales with your needs.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-3 gap-8">
          {/* Schools & K-12 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-2">Schools & K-12</h3>
            <p className="text-gray-500 text-sm mb-6">
              For individual classrooms and schools.
            </p>

            <div className="mb-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-gray-500">/student</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Basic Quiz Engine</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Up to 100 students</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Standard Reporting</span>
              </li>
            </ul>

            <button className="w-full py-3 border border-primary-button text-primary-button rounded-md font-semibold hover:bg-blue-50 transition-colors hover:cursor-pointer">
              Get Started Free
            </button>
          </div>

          {/* Colleges & Universities - MOST POPULAR */}
          <div className="bg-white border-2 border-primary-button rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-button text-white px-4 py-1 rounded-full text-xs font-semibold">
              MOST POPULAR
            </div>

            <h3 className="text-xl font-bold mb-2">Colleges & Universities</h3>
            <p className="text-gray-500 text-sm mb-6">
              For higher education departments.
            </p>

            <div className="mb-6">
              <span className="text-5xl font-bold">$4</span>
              <span className="text-gray-500">/student</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Advanced Proctoring</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">
                  LMS Integration (Canvas, Blackboard)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Plagiarism Detection</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Unlimited Exams</span>
              </li>
            </ul>

            <button className="w-full py-3 bg-primary-button text-white rounded-md font-semibold hover:bg-blue-700 transition-colors hover:cursor-pointer">
              Start 14-Day Trial
            </button>
          </div>

          {/* Enterprise & Certification */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-2">
              Enterprise & Certification
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              For large-scale recruitment & certs.
            </p>

            <div className="mb-6">
              <span className="text-5xl font-bold">Custom</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">API Access & SSO</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">
                  Custom Branding (White-label)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">Dedicated Support Manager</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck
                  size={20}
                  className="stroke-white fill-green-400 mt-0.5"
                />
                <span className="text-gray-700">
                  On-premise Deployment Options
                </span>
              </li>
            </ul>

            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors hover:cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-primary-button mx-24 my-16 rounded-2xl px-16 py-24 text-center">
        <h2 className="text-5xl font-bold text-white mb-4">
          Ready to transform your assessment
        </h2>
        <h2 className="text-5xl font-bold text-white mb-6">process?</h2>
        <p className="text-blue-100 mb-8">
          Join over 500+ institutions delivering secure and reliable exams
          today.
        </p>
        <div className="flex flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 bg-white text-primary-button rounded-md font-semibold hover:bg-gray-100 transition-colors hover:cursor-pointer">
            Get Started Now
          </button>
          <button className="px-8 py-3 border border-white text-white rounded-md font-semibold hover:bg-blue-700 transition-colors hover:cursor-pointer">
            Talk to Sales
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
