import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Helmet } from "react-helmet";
import { Chat } from "./Chat";
const OneBot = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Helmet>
        <title>Onebot</title>
        <link rel="icon" href="/favicon-onebot.ico" />
      </Helmet>
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
          <div className="flex space-x-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center p-4">
          <div className="w-full flex justify-end mb-4">
            <SignOutButton redirectUrl="/onebot">
              <button className="px-4 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Sign Out
              </button>
            </SignOutButton>
          </div>
          <div className="w-full">
            <Chat />
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default OneBot;
