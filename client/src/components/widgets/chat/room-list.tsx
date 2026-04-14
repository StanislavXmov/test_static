import React, { useState } from "react";
import { useSocket } from "../socket/socket-context";

interface RoomListProps {
  onJoinRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ onJoinRoom }) => {
  const { rooms, createRoom } = useSocket();
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      createRoom(newRoomName.trim());
      setNewRoomName("");
      setShowCreateForm(false);
    }
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h3>Chat Rooms</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-room-btn"
        >
          {showCreateForm ? "Cancel" : "+ Create Room"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
            maxLength={50}
            autoFocus
          />
          <button type="submit">Create</button>
        </form>
      )}

      <div className="rooms">
        <div className="room-item general" onClick={() => onJoinRoom("")}>
          <span className="room-name">💬 General Chat</span>
          <span className="room-status">public</span>
        </div>

        {rooms.map((room) => (
          <div
            key={room.roomId}
            className="room-item"
            onClick={() => onJoinRoom(room.roomId)}
          >
            <span className="room-name"># {room.roomName}</span>
            <span className="user-count">{room.users?.length || 0} users</span>
          </div>
        ))}
      </div>
    </div>
  );
};
