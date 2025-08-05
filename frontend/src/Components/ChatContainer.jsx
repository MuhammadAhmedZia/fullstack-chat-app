import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

import MessageSkeeton from './skeleton/MessageSkeeton';
import { useChatStore } from '../store/userChatStore';
import { formateMessageTime } from '../lib/utils';
import { useRef } from 'react';

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser, subcribeToMessages, unsubcribeFromMessages } = useChatStore();
  const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subcribeToMessages();
    return () => unsubcribeFromMessages();
  }, [selectedUser._id, getMessages, subcribeToMessages, unsubcribeFromMessages]);


 useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeeton />
        <MessageInput />
      </div>
    )
  }

   

  return(
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* message list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div key={msg._id}
             className={`chat ${msg.senderId === authUser._id ? "chat-end ": "chat-start"}`}
             ref={messageEndRef}
             >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
              <img 
                src=  { msg.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                 alt="profilePic" />    
              </div>
            </div>  
            <div className="chat-header mb-1">
              <time  className='text-xs opacity-50 ml-1 '>{formateMessageTime(msg.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img 
                  src={msg.image}
                  alt='Attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
      </div>
  )  

}

export default ChatContainer