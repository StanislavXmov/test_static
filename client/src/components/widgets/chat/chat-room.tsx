import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../socket/socket-context";

interface ChatRoomProps {
  username: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ username }) => {
  const {
    messages,
    typingUsers,
    sendMessage,
    setTyping,
    status,
    currentRoom,
    leaveRoom,
  } = useSocket();

  const [inputMessage, setInputMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = useCallback(
    (value: string) => {
      setInputMessage(value);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (value.length > 0) {
        setTyping(true, currentRoom?.roomId);

        const timeout = setTimeout(() => {
          setTyping(false, currentRoom?.roomId);
        }, 1000);

        setTypingTimeout(timeout);
      } else {
        setTyping(false, currentRoom?.roomId);
      }
    },
    [setTyping, typingTimeout, currentRoom],
  );

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage(inputMessage, currentRoom?.roomId);
        setInputMessage("");
        setTyping(false, currentRoom?.roomId);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        inputRef.current?.focus();
      }
    },
    [inputMessage, sendMessage, setTyping, typingTimeout, currentRoom],
  );

  const typingText = typingUsers
    .filter((u) => u.userId !== "current")
    .map((u) => u.username)
    .join(", ");

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>
          {currentRoom ? `Room: ${currentRoom.roomName}` : "General Chat"}
        </h2>
        <div className="header-controls">
          <span
            className={`connection-status ${status.connected ? "connected" : "disconnected"}`}
          >
            {status.connected ? "● Online" : "○ Offline"}
          </span>
          {currentRoom && (
            <button onClick={leaveRoom} className="leave-room-btn">
              Leave Room
            </button>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.userId === "current" ? "own" : "other"}`}
          >
            <div className="message-header">
              <span className="username">{message.username}</span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingText && (
        <div className="typing-indicator">
          {typingText} {typingUsers.length > 1 ? "are" : "is"} typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          disabled={!status.connected}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!status.connected || !inputMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};
