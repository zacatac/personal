import {
  SignIn,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { useQuery } from "react-query";
import { OpenAPI, userMeGet } from "./client";
import { BACKEND_URL } from "./config";
const fetchMe = async (token: string) => {
  // TODO: this should be applied globally
  OpenAPI.interceptors.request.use((config) => {
    config.baseURL = BACKEND_URL;
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  const me = userMeGet();
  return me;
};

const OneBotChat = () => {
  const { getToken } = useAuth();
  const { isLoading, error, data } = useQuery(
    "protectedData",
    async () => {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      return fetchMe(token);
    },
    {
      // The query will not execute until the token exists
      enabled: !!getToken,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Profile</h2>
      <dl className="bg-white shadow-md rounded-lg p-4">
        <dt className="text-lg font-medium text-gray-700">User ID</dt>
        <dd className="mt-1 text-sm text-gray-900">{data?.clerk_id}</dd>
      </dl>
    </div>
  );
};

const SignInPage = () => {
  return (
    <div>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <OneBotChat />
      </SignedIn>
    </div>
  );
};

export default SignInPage;
