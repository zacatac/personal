import { useAuth } from "@clerk/clerk-react";
import { CategoryBar } from "@tremor/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useQuery, useQueryClient } from "react-query";
import { endBot, fetchBot, fetchChatStream } from "./api";
import { download } from "./download";
import { Message } from "./types";

const MAX_TOKENS = 4096;

export const Chat = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [showEndBotModal, setShowEndBotModal] = useState(false);
  const [chatResult, setChatResult] = useState<Message | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

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

  const handleEndBot = useCallback(async () => {
    setChatLoading(true);
    setChatError(null);
    try {
      const name = dataBot?.name;
      const token = await getToken();
      if (!token) throw new Error("No token available");
      await endBot(token);
      toast.success(`${name} deleted.`, {
        icon: "💀",
      });
      setChatResult(null);
    } catch (err) {
      setChatError((err as Error).message);
    } finally {
      setChatLoading(false);
      setShowEndBotModal(false);
      queryClient.invalidateQueries("bot");
    }
  }, [dataBot, getToken, queryClient]);

  const handleFetchChat = useCallback(async () => {
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
  }, [getToken, inputMessage, queryClient]);

  useEffect(() => {
    if (isLoadingBot) {
      setChatResult(null);
    }
  }, [isLoadingBot]);

  useEffect(() => {
    if (errorBot) {
      toast.error(`An error occurred: ${(errorBot as Error).message}`);
    }
  }, [errorBot]);

  if (isLoadingBot)
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex justify-center py-8 bg-gray-900 text-white">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        {showEndBotModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
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

        <div className="mt-4 sticky top-2 z-10 bg-gray-900">
          <div className="bg-gray-800 shadow-md rounded-lg p-4 relative">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="space-y-1 w-full sm:w-1/3">
                <p className="text-md font-medium text-gray-300">
                  You're chatting with{" "}
                  <span className="font-bold">{dataBot?.name}</span>
                </p>
                <p className="text-sm font-medium text-gray-300">
                  Once his tokens are used up {dataBot?.name} will expire, so
                  cherish this time together.
                </p>
              </div>
              <div className="mt-2 w-full sm:w-1/2">
                <CategoryBar
                  values={[40, 30, 20, 10]}
                  colors={["emerald", "yellow", "orange", "rose"]}
                  markerValue={((dataBot?.tokens ?? 0) / MAX_TOKENS) * 100}
                  tooltip={`How many tokens ${dataBot?.name} has left: ${
                    MAX_TOKENS - (dataBot?.tokens ?? 0)
                  }. 😔`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {dataBot?.tokens} / {MAX_TOKENS} tokens used
                </p>
              </div>
            </div>
          </div>
        </div>

        {chatError && (
          <div className="mt-2 text-red-500">
            An error occurred: {chatError}
          </div>
        )}

        <div className="overflow-y-auto max-h-[80vh] scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 mt-12 rounded-lg">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`mt-2 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`bg-gray-800 shadow-md rounded-lg p-4 max-w-sm ${
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
              <div className="bg-gray-800 shadow-md rounded-lg p-4 max-w-sm text-left">
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
        <div className="space-y-2">
          <div className="mt-4 flex flex-col sm:flex-row">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFetchChat();
                  e.currentTarget.blur();
                }
              }}
              className="flex-grow px-4 py-2 text-sm border rounded-t-lg sm:rounded-l-lg sm:rounded-t-none bg-gray-700 text-white"
              placeholder="Type your message..."
              ref={(input) => input && input.focus()}
            />
            <button
              onClick={() => {
                handleFetchChat();
                /* @ts-ignore */
                document.querySelector('input[type="text"]').focus();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-b-lg sm:rounded-r-lg sm:rounded-b-none"
              disabled={chatLoading}
            >
              {chatLoading ? (
                "🤔..."
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
          {messages.length > 0 && (
            <div className="space-x-2">
              <button
                onClick={() => setShowEndBotModal(true)}
                className="px-2 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete {dataBot?.name} 💀
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
          )}
        </div>
      </div>
    </div>
  );
};
