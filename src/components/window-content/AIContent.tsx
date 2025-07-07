"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WelcomeScreen, ChatInterface, Message } from "./ai";
import { ChatResponse } from "./ai/types";
import useChat from "@/hooks/useChat";

const AIContent = () => {
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
  const { send: sendChatEvent } = useChat();
  const isProcessingRef = useRef(false);

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
    isProcessingRef.current = false;
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const sendMessage = useCallback(async (message: string) => {
    if (message.trim() === "" || isProcessingRef.current) return;

    isProcessingRef.current = true;

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
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
          message: message,
        }),
      });

      if (response.ok) {
        const chatResponse: ChatResponse = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: chatResponse.message,
          createdAt: new Date(),
          isCallTools: chatResponse.is_call_tools,
          agentIndex: chatResponse.agent_index,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (chatResponse.is_call_tools) {
          try {
            await sendChatEvent(
              {
                query: message,
                is_call_tools: true,
                agent_index: chatResponse.agent_index,
                message: chatResponse.message,
              },
              {
                onData: (data) => {
                  const poolData = data.data || data;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, data: poolData }
                        : msg
                    )
                  );
                },
                onText: (chunk) => {
                  setMessages(prev =>
                    prev.map(msg => {
                      if (msg.id !== assistantMessage.id) return msg;
                      const prevContent = msg.content || '';
                      let formattedChunk = chunk;
                      if (
                        prevContent &&
                        !prevContent.endsWith(' ') &&
                        !prevContent.endsWith('\n') &&
                        !chunk.startsWith(' ') &&
                        !chunk.startsWith('\n') &&
                        !/^[.,;:!?*\-]/.test(chunk)
                      ) {
                        formattedChunk = ' ' + chunk;
                      }
                      return {
                        ...msg,
                        content: prevContent + formattedChunk,
                        ...(msg.agentIndex === 0 && !msg.data
                          ? { isCallTools: false, agentIndex: undefined }
                          : {})
                      };
                    })
                  );
                },
                onError: (error) => {
                  console.error("Tool call error:", error);
                },
              }
            );
          } catch (toolError) {
            console.error("Tool call failed:", toolError);
          }
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
    } finally {
      setStatus("idle");
      isProcessingRef.current = false;
    }
  }, [hasStartedChat, sendChatEvent]);

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
};

export default AIContent;