"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { WelcomeScreen, ChatInterface, Message } from "./ai";
import { ChatResponse } from "./ai/types";
import useChat from "@/hooks/useChat";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { observer } from "mobx-react-lite";
import { useStores } from "@stores/context";
import { CustomConnectButton } from "../footer/CustomConnectButton";
import useResponsive from "@/src/hooks/useResponsive";

const AIContent = observer(() => {
  const { walletStore } = useStores();
  const { openConnectModal } = useConnectModal();
  const isMobile = useResponsive();

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
          content: (chatResponse.is_call_tools && chatResponse.agent_index !== 1 && chatResponse.agent_index !== 0) ? chatResponse.message : "",
          createdAt: new Date(),
          isCallTools: chatResponse.is_call_tools,
          agentIndex: chatResponse.agent_index,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (!chatResponse.is_call_tools || (chatResponse.is_call_tools && chatResponse.agent_index === 1)) {
          try {
            await sendChatEvent(
              {
                query: message,
                is_call_tools: chatResponse.is_call_tools,
                agent_index: chatResponse.agent_index || 0,
                message: chatResponse.message,
              },
              {
                onText: (chunk) => {
                  setMessages(prev =>
                    prev.map(msg => {
                      if (msg.id !== assistantMessage.id) return msg;
                      const prevContent = msg.content || '';
                      
                      let contentToAdd = chunk;
                      try {
                        const jsonChunk = JSON.parse(chunk);
                        if (jsonChunk.content) {
                          contentToAdd = jsonChunk.content;
                        }
                      } catch (e) {
                        contentToAdd = chunk;
                      }
                      
                      let formattedChunk = contentToAdd;
                      if (prevContent && contentToAdd) {
                        if (
                          prevContent.trim() &&
                          /^#+\s/.test(contentToAdd) &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n\n' + contentToAdd;
                        }
                        else if (
                          /\*\*[^*]+:\*\*$/.test(prevContent) &&
                          !contentToAdd.startsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          /^\w+[^:]*:\s*/.test(contentToAdd) &&
                          prevContent.trim() &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          /^\*\s/.test(contentToAdd) &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          !prevContent.endsWith(' ') &&
                          !prevContent.endsWith('\n') &&
                          !contentToAdd.startsWith(' ') &&
                          !contentToAdd.startsWith('\n') &&
                          !/^[.,;:!?*\-#]/.test(contentToAdd) &&
                          !/[#*\-:]$/.test(prevContent)
                        ) {
                          formattedChunk = ' ' + contentToAdd;
                        }
                      }
                      
                      return {
                        ...msg,
                        content: prevContent + formattedChunk,
                        isCallTools: chatResponse.agent_index === 1 ? true : false,
                        agentIndex: chatResponse.agent_index === 1 ? 1 : undefined
                      };
                    })
                  );
                },
                onError: (error) => {
                  setMessages(prev =>
                    prev.map(msg => {
                      if (msg.id !== assistantMessage.id) return msg;
                      return {
                        ...msg,
                        content: chatResponse.message,
                        isCallTools: chatResponse.agent_index === 1 ? true : false,
                        agentIndex: chatResponse.agent_index === 1 ? 1 : undefined
                      };
                    })
                  );
                },
              }
            );
          } catch (textError) {
            setMessages(prev =>
              prev.map(msg => {
                if (msg.id !== assistantMessage.id) return msg;
                return {
                  ...msg,
                  content: chatResponse.message,
                  isCallTools: chatResponse.agent_index === 1 ? true : false,
                  agentIndex: chatResponse.agent_index === 1 ? 1 : undefined
                };
              })
            );
          }
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 2) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { pet: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 3) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { mint: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 4) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { summon: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 5) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { wearable: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 6) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { call: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 7) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { swap: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 8) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { addLiquidity: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools && chatResponse.agent_index === 9) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, data: { removeLiquidity: true } }
                : msg
            )
          );
        } else if (chatResponse.is_call_tools) {
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
                      
                      let contentToAdd = chunk;
                      try {
                        const jsonChunk = JSON.parse(chunk);
                        if (jsonChunk.content) {
                          contentToAdd = jsonChunk.content;
                        }
                      } catch (e) {
                        contentToAdd = chunk;
                      }
                      
                      let formattedChunk = contentToAdd;
                      if (prevContent && contentToAdd) {  
                        if (
                          prevContent.trim() &&
                          /^#+\s/.test(contentToAdd) &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n\n' + contentToAdd;
                        }
                        else if (
                          /\*\*[^*]+:\*\*$/.test(prevContent) &&
                          !contentToAdd.startsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          /^\w+[^:]*:\s*/.test(contentToAdd) &&
                          prevContent.trim() &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          /^\*\s/.test(contentToAdd) &&
                          !prevContent.endsWith('\n')
                        ) {
                          formattedChunk = '\n' + contentToAdd;
                        }
                        else if (
                          !prevContent.endsWith(' ') &&
                          !prevContent.endsWith('\n') &&
                          !contentToAdd.startsWith(' ') &&
                          !contentToAdd.startsWith('\n') &&
                          !/^[.,;:!?*\-#]/.test(contentToAdd) &&
                          !/[#*\-:]$/.test(prevContent)
                        ) {
                          formattedChunk = ' ' + contentToAdd;
                        }
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

  if (!walletStore.isConnected) {
    return (
      <div className={`h-full flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center flex flex-col items-center">
          <div className={`mb-4 ${isMobile ? 'mb-2' : ''}`}>
            <Image src="/not-any.png" alt="No NFTs" width={isMobile ? 80 : 120} height={isMobile ? 80 : 120} />
          </div>
          <h3 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>No Wallet Connected</h3>
          <p className={`text-[#000080] mb-4 ${isMobile ? 'text-sm' : ''}`}>Please connect your wallet to continue.</p>
          <div
            className={`text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner ${isMobile ? 'h-8' : 'h-10'}`}
          >
            <CustomConnectButton />
          </div>
        </div>
      </div>
    );
  }

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
});

export default AIContent;