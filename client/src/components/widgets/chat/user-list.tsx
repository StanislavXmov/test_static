import React from "react";
import { useSocket } from "../socket/socket-context";

export const UserList: React.FC = () => {
  const { currentRoom, typingUsers } = useSocket();

  const users = currentRoom?.users || [];

  return (
    <div className="user-list">
      <h3>Users in {currentRoom ? "room" : "chat"}</h3>
      <div className="users">
        {users.map((user) => (
          <div key={user.userId} className="user-item">
            <span className="user-status online">●</span>
            <span className="username">{user.username}</span>
            {typingUsers.some((t) => t.userId === user.userId) && (
              <span className="typing">typing...</span>
            )}
          </div>
        ))}
        {users.length === 0 && <div className="no-users">No users online</div>}
      </div>
    </div>
  );
};
