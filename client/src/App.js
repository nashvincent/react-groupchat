import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import immer from 'immer'
import Login from './components/Login'
import Dash from './components/Dash'
import './App.css'

const initialMessageState = {
  room1: [],
  room2: [],
  room3: [],
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [currentChat, setCurrentChat] = useState({ chatName: 'room1', receiverId: '' })
  const [connectedRooms, setConnectedRooms] = useState(['room1'])
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState(initialMessageState)
  const [message, setMessage] = useState('')
  const socketRef = useRef()

  useEffect(() => {
    setMessage('')
  }, [messages])

  const handleSetUsername = name => {
    setUsername(name)
    setLoggedIn(true)

    socketRef.current = io.connect('http://localhost:8000/')
    socketRef.current.emit('join server', username)
    socketRef.current.emit('join room', 'room1', messages =>
      roomJoinCallback(messages, 'room1')
    )
    socketRef.current.on('new user', allUsers => {
      setAllUsers(allUsers)
    })
    socketRef.current.on('new message', ({ content, sender, chatName }) => {
      setMessages(messages => {
        const newMessages = immer(messages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender })
          } else draft[chatName] = [{ content, sender }]
        })
        return newMessages
      })
    })
  }

  const handleMessageChange = e => setMessage(e.target.value)

  const sendMessage = () => {
    const payload = {
      content: message,
      to: currentChat.chatName,
      sender: username,
      chatName: currentChat.chatName,
    }

    socketRef.current.emit('send message', payload)
    const newMessages = immer(messages, draft => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      })
    })
    setMessages(newMessages)
  }

  const joinRoom = room => {
    const newConnectedRooms = immer(connectedRooms, draft => {
      draft.push(room)
    })

    socketRef.current.emit('join room', room, messages =>
      roomJoinCallback(messages, room)
    )
    setConnectedRooms(newConnectedRooms)
  }

  const roomJoinCallback = (incomingMessages, room) => {
    const newMessages = immer(messages, draft => {
      draft[room] = incomingMessages
    })
    setMessages(newMessages)
  }

  const toggleChat = currentChat => {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, draft => {
        draft[currentChat.chatName] = []
      })
      setMessages(newMessages)
    }
    setCurrentChat(currentChat)
  }

  if (!loggedIn) return <Login handleSetUsername={handleSetUsername} />
  else
    return (
      <Dash
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ''}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    )
}

export default App
