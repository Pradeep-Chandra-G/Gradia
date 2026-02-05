import React from "react";
import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignUp signInUrl="/auth/sign-in" />
    </div>
  );
}

export default SignUpPage;
