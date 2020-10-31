import React from 'react'
import ChatBubble from './ChatBubble'

const rooms = ['room1', 'room2', 'room3']

export default function Dash(props) {
  const renderRooms = room => {
    const currentChat = {
      chatName: room,
      receiverId: '',
    }
    return (
      <button className="room-btn" onClick={() => props.toggleChat(currentChat)}>
        {room}
      </button>
    )
  }

  let body
  if (props.connectedRooms.includes(props.currentChat.chatName)) {
    body = (
      <>
        {props.messages.map((message, idx) => (
          <ChatBubble key={idx} message={message} />
        ))}
      </>
    )
  } else {
    body = (
      <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
        Join {props.currentChat.chatName}
      </button>
    )
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') props.sendMessage()
  }

  return (
    <div className="dash">
      <h2>Chat Dashboard</h2>
      {rooms.map(renderRooms)}
      <h3>{props.currentChat.chatName}</h3>
      <div className="container">{body}</div>
      <textarea
        className="textarea"
        value={props.message}
        onChange={props.handleMessageChange}
        onKeyPress={handleKeyPress}
        placeholder="Send a message..."
      />
    </div>
  )
}
