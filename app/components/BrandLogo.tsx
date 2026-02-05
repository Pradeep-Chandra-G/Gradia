import { BrainCircuit } from "lucide-react";
import React from "react";

function BrandLogo() {
  return (
    <div className="flex items-center rounded-md text-white p-6 space-x-2">
      <BrainCircuit size={32} />

      <div className="flex flex-col">
        <h1 className="text-xl font-bold">Gradia AI</h1>
        <p className="text-xs text-gray-500">Next Generation AI Platform</p>
      </div>
    </div>
  );
}

export default BrandLogo;
