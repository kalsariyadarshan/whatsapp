/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
/* eslint-disable import/no-extraneous-dependencies */
import {
  ArrowLeft,
  Camera,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface Message {
  text: string;
  sender: 'me' | 'other';
  time: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12;
    const formattedMinute = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  useEffect(() => {
    if (name) {
      const savedMessages = localStorage.getItem(`chat_${name}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [name]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const currentTime = formatTime(new Date());
    const newMessages: Message[] = [
      ...messages,
      { text: input, sender: 'me', time: currentTime },
    ];
    setMessages(newMessages);
    if (name) {
      localStorage.setItem(`chat_${name}`, JSON.stringify(newMessages));
    }

    setInput('');

    setTimeout(() => {
      const responseMessage: Message = {
        text: "I'm doing great, thanks!",
        sender: 'other',
        time: formatTime(new Date()),
      };
      const updatedMessages = [...newMessages, responseMessage];
      setMessages(updatedMessages);
      if (name) {
        localStorage.setItem(`chat_${name}`, JSON.stringify(updatedMessages));
      }
    }, 1000);
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col bg-[#111b21]">
      <div className="flex items-center justify-between bg-[#202c33] p-2">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={
                'https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.jpg?s=612x612&w=0&k=20&c=buXwOYjA_tjt2O3-kcSKqkTp2lxKWJJ_Ttx2PhYe3VM='
              }
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="ml-2 text-lg font-semibold text-white first-letter:uppercase">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-[#aebac1]">
          <Video className="h-5 w-5" />
          <Phone className="h-5 w-5" />
          <MoreVertical className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0b141a] p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.sender === 'me' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 text-sm text-white ${
                msg.sender === 'me' ? 'bg-[#005c4b]' : 'bg-[#202c33]'
              }`}
            >
              {msg.text}
              <div className="mt-1 text-right text-xs text-[#8696a0]">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full">
        <div className="m-2 flex w-full items-center gap-2 rounded-3xl bg-[#2a3942] p-2 px-3">
          <button className="text-[#aebac1]">
            <Smile className="h-6 w-6" />
          </button>

          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                sendMessage();
              }
            }}
            className="w-full rounded-3xl bg-[#2a3942] p-1 text-white placeholder-[#8696a0] focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <button className="text-[#aebac1]">
              <Paperclip className="h-6 w-6" />
            </button>
            <button className="text-[#aebac1]">
              <Camera className="h-6 w-6" />
            </button>
          </div>
        </div>

        <button
          onClick={sendMessage}
          className="my-2 mr-2 flex items-center justify-center rounded-full bg-[#005c4b] px-3 text-white"
        >
          {input.trim() ? (
            <Send className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
