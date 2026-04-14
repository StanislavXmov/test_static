import React, { useState } from "react";
import { useSocket } from "../socket/socket-context";
import { RoomList } from "./room-list";
import { UserList } from "./user-list";
import { ChatRoom } from "./chat-room";

export const ChatWidget: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [showLogin, setShowLogin] = useState(true);
  const { joinChat, joinRoom, currentRoom } = useSocket();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("username") as string;

    if (name.trim()) {
      setUsername(name);
      joinChat(name.trim());
      setShowLogin(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    joinRoom(roomId);
  };

  if (showLogin) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h1>Welcome to Chat</h1>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            minLength={3}
            maxLength={20}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Socket.IO Chat</h1>
        <div className="user-info">
          <span>
            Logged in as: <strong>{username}</strong>
          </span>
        </div>
      </header>

      <div className="chat-layout">
        <aside className="sidebar">
          <RoomList onJoinRoom={handleJoinRoom} />
          <UserList />
        </aside>

        <main className="main-content">
          <ChatRoom username={username} />
        </main>
      </div>
    </div>
  );
};
