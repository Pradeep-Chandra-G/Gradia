import React from "react";
import { SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <SignIn signUpUrl={"/auth/sign-up"} forceRedirectUrl={'/dashboard'}/>
    </div>
  );
}

export default SignInPage;
