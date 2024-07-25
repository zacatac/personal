import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Chat } from "./chat";

const OneBot = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <h1 className="text-4xl font-bold mb-8">Welcome to Onebot!</h1>
          <p className="text-center mb-4 max-w-xl">
            You can only talk with one Onebot at a time, your Onebot. Once your
            context window runs out your Onebot will say its goodbyes and be
            replaced by another Onebot. Your previous Onebots memory will be
            lost forever.
          </p>
          <p className="text-center mb-4 max-w-xl">
            Since the value comes from persistence, we need you to sign in /
            sign up.
          </p>
          <SignIn forceRedirectUrl={"/onebot"} />
        </div>
      </SignedOut>
      <SignedIn>
        <Chat />
      </SignedIn>
    </div>
  );
};

export default OneBot;
