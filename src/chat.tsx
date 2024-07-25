import { SignOutButton, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuery, useQueryClient } from "react-query";
import { endBot, fetchBot, fetchChatStream } from "./api";
import { download } from "./download";
import { Message } from "./types";

export const Chat = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    isLoading: isLoadingBot,
    error: errorBot,
    data: dataBot,
  } = useQuery(
    "bot",
    async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return fetchBot(token);
    },
    {
      enabled: !!getToken,
      onSuccess: (dataBot) => {
        setMessages((dataBot?.context?.messages as Message[])?.slice(1) ?? []);
        setChatResult(null);
      },
    }
  );

  const handleEndBot = async () => {
    setChatLoading(true);
    setChatError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      await endBot(token);
      setChatResult(null);
    } catch (err) {
      setChatError((err as Error).message);
    } finally {
      setChatLoading(false);
      setShowEndBotModal(false);
      queryClient.invalidateQueries("bot");
    }
  };

  const isLoading = isLoadingBot;
  const error = errorBot;
  const [showEndBotModal, setShowEndBotModal] = useState(false);
  const [chatResult, setChatResult] = useState<Message | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleFetchChat = async () => {
    setChatLoading(true);
    setChatError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      setChatResult({
        role: "assistant",
        content: "",
        id: "unknown",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: inputMessage, id: "unknown" },
      ]);
      setInputMessage("");
      await fetchChatStream(token, inputMessage, (chunk) => {
        setChatResult((prev) => {
          return {
            ...prev,
            id: "unknown",
            content: (prev?.content ?? "") + chunk,
            role: "assistant",
          };
        });
      });
      queryClient.invalidateQueries("bot");
    } catch (err) {
      setChatError((err as Error).message);
    } finally {
      setChatLoading(false);
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (isLoadingBot) {
      setChatResult(null);
    }
  }, [isLoadingBot]);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500">
        An error occurred: {(error as Error).message}
      </div>
    );

  return (
    <div className="flex justify-center py-8 bg-gray-900 text-white">
      <div className="max-w-4xl w-full">
        {showEndBotModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-medium text-white">
                Confirm Ending {dataBot?.name}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Are you sure you want to end the bot? This action cannot be
                undone.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowEndBotModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndBot}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Yes, I want a new bot.
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 sticky top-0 z-10 bg-gray-900">
          <div className="bg-gray-800 shadow-md rounded-lg p-4 relative">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-md font-medium text-gray-300">
                  You're chatting with{" "}
                  <span className="font-bold">{dataBot?.name}</span>
                </p>
                <p>They have about 100,000 tokens left...</p>
              </div>
              <div className="space-x-2">
                <SignOutButton redirectUrl="/onebot">
                  <button className="px-2 py-1 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                    Sign Out
                  </button>
                </SignOutButton>
                <button
                  onClick={() => setShowEndBotModal(true)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  End {dataBot?.name}'s Life 💀
                </button>
                <button
                  onClick={() =>
                    download({
                      bot: dataBot,
                      messages: messages,
                    })
                  }
                  className="px-2 py-1 bg-green-500 text-white rounded-lg"
                >
                  Download Keepsakes 📸
                </button>
              </div>
            </div>
          </div>
        </div>

        {chatError && (
          <div className="mt-2 text-red-500">
            An error occurred: {chatError}
          </div>
        )}

        <div className="overflow-y-auto max-h-[80vh] scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 mt-12">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`mt-2 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`bg-gray-800 shadow-md rounded-lg p-4 max-w-md ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div className="mt-1 text-sm text-gray-400">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <br />
                <div className="mt-1 text-xs text-gray-400">
                  <strong>ID:</strong> {message.id}
                </div>
              </div>
            </div>
          ))}

          {chatResult && !!chatResult?.content && (
            <div className="mt-2 flex justify-start">
              <div className="bg-gray-800 shadow-md rounded-lg p-4 max-w-md text-left">
                <div className="mt-1 text-sm text-gray-400">
                  <ReactMarkdown>{chatResult.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          <div
            ref={(el) => el && el.scrollIntoView({ behavior: "auto" })}
          ></div>
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow px-4 py-2 text-sm border rounded-l-lg bg-gray-700 text-white"
            placeholder="Type your message..."
          />
          <button
            onClick={handleFetchChat}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
            disabled={chatLoading}
          >
            {chatLoading ? (
              "Loading..."
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 12l1.41 1.41L11 5.83V20h2V5.83l7.59 7.58L22 12l-10-10L2 12z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
