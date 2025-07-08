import React, { useEffect, useRef } from 'react';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import  {Avatar, Tooltip} from '@chakra-ui/react'
import { ChatState } from '../Contexts/ChatProvider';

const ScrollableChat = ({ messages }) => {
    console.log("messages from scrollable chat: ", messages);
  const bottomRef = useRef(null);

  const {user} = ChatState();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages?.map((m, i) => {
        const showAvatar = isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id);

        return (
          <div
            key={m._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              justifyContent: m.sender._id === user._id ? 'flex-end' : 'flex-start'
            }}
          >
            {!showAvatar && m.sender._id !== user._id && (
              <div style={{ width: 40 }} /> // Keeps spacing when avatar isn't shown
            )}

            {showAvatar && m.sender._id !== user._id && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.photo}
                  style={{ marginRight: 8 }}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        );
      })}



      {/* Scroll target */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ScrollableChat;
