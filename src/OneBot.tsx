import {
  SignIn,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import axios from "axios";
import { useQuery } from "react-query";

const LOCAL_API_URL = "http://localhost:8000/api/protected";

const fetchProtectedData = async (token: string) => {
  const response = await axios.get(LOCAL_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const OneBotChat = () => {
  const { getToken } = useAuth();
  const { isLoading, error, data } = useQuery(
    "protectedData",
    async () => {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      return fetchProtectedData(token);
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
      <h2>Protected Data</h2>
      <p>{data?.message}</p>
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
