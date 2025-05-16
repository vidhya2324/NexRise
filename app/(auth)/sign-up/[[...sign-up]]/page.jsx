import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pt-16">
      <SignUp
        appearance={{
          elements: {
            card: "max-w-md w-full", // Make the card wider
            rootBox: "w-full max-w-2xl py-8", // Make the root container wider
          },
        }}
      />
    </div>
  );
};

export default Page;
