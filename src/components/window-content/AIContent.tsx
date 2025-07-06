"use client";

import { useState, useEffect, useRef } from "react";
import { WelcomeScreen, ChatInterface, Message } from "./ai";

export default function AIContent() {
  const [input, setInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system",
      role: "system",
      content: "You are Gotchipus, an AI assistant.",
    },
  ]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasStartedChat]);

  useEffect(() => {
    if (hasStartedChat && inputRef.current && status === "idle") {
      inputRef.current.focus();
    }
  }, [hasStartedChat, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  const handleBackToInput = () => {
    setHasStartedChat(false);
    setInput("");
    setMessages([
      {
        id: "system",
        role: "system",
        content: "You are Gotchipus, an AI assistant.",
      },
    ]);
    setStatus("idle");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("streaming");
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        let assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const decoder = new TextDecoder();
        let accumulatedContent = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedContent += chunk;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errorData.error || "Network error! Please try again.",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Network error! Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setStatus("idle");
  };

  const handleSendMessage = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#c0c0c0] w-full h-full">
      {!hasStartedChat ? (
        <WelcomeScreen
          input={input}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSendMessage}
          inputRef={inputRef}
          isDisabled={status === "streaming"}
          onQuestionClick={sendMessage}
        />
      ) : (
        <ChatInterface
          messages={messages}
          input={input}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSendMessage={handleSendMessage}
          onBackClick={handleBackToInput}
          inputRef={inputRef}
          chatContainerRef={chatContainerRef}
          messagesEndRef={messagesEndRef}
          isDisabled={status === "streaming"}
          status={status}
        />
      )}
    </div>
  );
}