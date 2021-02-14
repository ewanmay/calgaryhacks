import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/context'
import { ClientMessage, ServerMessage } from '../context/types'
import './Chat.css'

const TIMESTAMP_OPTIONS = { hour: '2-digit', minute: '2-digit', hour12: false }

const EMOJIS = {
  ':)': '🙂 ',
  ';)': '😉 ',
  ':(': '🙁 ',
  ':o': '😲 ',
}

function emojify(text: string) {
  for (const [trigger, emoji] of Object.entries(EMOJIS)) {
    text = text.replace(trigger, emoji)
  }
  return text
}


interface MessageProps {
  m: ServerMessage
}

function Message({m}: MessageProps) {
  const [state, dispatch] = useContext(AppContext)
  const {username, messageContents, date} = m

  function renderTime(date: string) {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', TIMESTAMP_OPTIONS)
  }

  const isSelf = username === state.authState.username
  const msgStyle = {
    background: isSelf ? 'dodgerblue' : '#eee',
    color: isSelf ? 'white' : 'black',
  }

  return (
    <div
      className='msgContainer'
      style={{
        justifyContent: isSelf ? 'flex-end' : 'flex-start',
      }}
    >
      <li
        style={{
          alignItems: isSelf ? 'flex-end' : 'flex-start',
        }}
      >
        <div className='details'>
          <span className='timestamp'>{renderTime(date)}</span>
          <span className='username'>{username}</span>
        </div>
        <div className='msg' style={msgStyle}>
          {messageContents}
        </div>
      </li>
    </div>
  )
}

function Chat() {
  const [state, dispatch] = useContext(AppContext)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([] as ServerMessage[])

  function createMessage(msg: string): ClientMessage  {
    return {
      username: state.authState.username,
      messageContents: msg
    }
  }

  useEffect(() => {
    state.socket.on('message-log', function (msgs: ServerMessage[]) {
      console.log('got messages', msgs.length)
      setMessages(msgs)
    })
  }, [state.socket])


  useEffect(() => {
    // when msgs change, scroll to bottom
    const elem = document.getElementById('messages')
    if (elem) elem.scrollTop = elem.scrollHeight
  }, [messages])

  function handleSend(e: any) {
    e.preventDefault() // prevent refresh
    if (text.trim()) {
      state.socket.emit('add-chat-message', createMessage(text))
    }
    setText('')
  }

  return (
    <div id='chat'>
      <div id='messagesContainer'>
        <ul id='messages'>
          {messages.map((m: ServerMessage, i) => (
            <Message key={i} m={m} />
          ))}
        </ul>
      </div>
      <form id='chat-form' onSubmit={handleSend}>
        <input
          id='chat-input'
          value={text}
          onChange={e => setText(emojify(e.target.value))}
          autoComplete='off'
        />
        <button>Send</button>
      </form>
    </div>
  )
}

export default Chat
