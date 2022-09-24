import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chatting({
  socket,
  username,
  room
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messageRef = useRef()

  const chatHour = new Date(Date.now()).getHours()
  const chatMinute = new Date(Date.now()).getMinutes()

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          (chatHour < 10 ? `0${chatHour}` : chatHour) +
          ':' +
          (chatMinute < 10 ? `0${chatMinute}` : chatMinute)
      };
      await socket.emit('send_message', messageData);
      setMessageList(
        (list) => [...list, messageData]
      );
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      // console.log(data);
      setMessageList(
        (list) => [...list, data]
      );
    })
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div
                className='message'
                id={username === messageContent.author ? 'you' : 'other'}>
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='author'>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='Say Hi!'
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
              messageRef.current.value = '';
              setCurrentMessage('')
            };
          }}
          ref={messageRef}
        />
        <button
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chatting;