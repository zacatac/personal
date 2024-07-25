import {
  SignIn,
  SignOutButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { OpenAPI, userMeGet } from "./client";
import { BACKEND_URL } from "./config";

const applyInterceptors = (token: string) => {
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
};

const fetchMe = async (token: string) => {
  applyInterceptors(token);
  const me = await userMeGet();
  return me;
};

const fetchChatStream = async (
  token: string,
  message: string,
  onData: (data: string) => void
) => {
  const response = await fetch(
    `${BACKEND_URL}/chat?message=${encodeURIComponent(message)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      onData(chunk);
    }
  }
};

const OneBotChat = () => {
  const { getToken } = useAuth();
  const { isLoading, error, data } = useQuery(
    "me",
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

  const [chatResult, setChatResult] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleFetchChat = async () => {
    setChatLoading(true);
    setChatError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      setChatResult("");
      await fetchChatStream(
        token,
        "Hello, OneBot! Can you print the constitution?",
        (chunk) => setChatResult((prev) => (prev ?? "") + chunk)
      );
    } catch (err) {
      setChatError((err as Error).message);
    } finally {
      setChatLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Profile</h2>
      <dl className="bg-white shadow-md rounded-lg p-4">
        <dt className="text-lg font-medium text-gray-700">User ID</dt>
        <dd className="mt-1 text-sm text-gray-900">{data?.clerk_id}</dd>
      </dl>
      <button
        onClick={handleFetchChat}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        disabled={chatLoading}
      >
        {chatLoading ? "Loading..." : "Fetch Chat"}
      </button>
      {chatError && (
        <div className="mt-2 text-red-500">An error occurred: {chatError}</div>
      )}
      {chatResult && (
        <dl className="mt-2 bg-white shadow-md rounded-lg p-4">
          <dt className="text-lg font-medium text-gray-700">Chat Result</dt>
          <dd className="mt-1 text-sm text-gray-900">
            <ReactMarkdown>{chatResult}</ReactMarkdown>
          </dd>
        </dl>
      )}
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
