import { OpenAPI, botBotGet, deleteBotBotDelete } from "./client";
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

export const fetchBot = async (token: string) => {
  applyInterceptors(token);
  const bot = await botBotGet();
  return bot;
};

export const endBot = async (token: string) => {
  applyInterceptors(token);
  deleteBotBotDelete();
};

export const fetchChatStream = async (
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
