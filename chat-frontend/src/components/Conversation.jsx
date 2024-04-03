import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaRegSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import {
  addMessage,
  getAlltexts,
} from "../../features/messages/messageService";

const Conversation = ({ setSendMsg, receiveMsg }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { receiver, chatID } = useSelector((state) => state.chat);
  const [msg, setMsg] = useState([]);
  const [textt, setText] = useState("");
  const handleEmoji = () => {
    showEmoji ? setShowEmoji(false) : setShowEmoji(true);
  };

  const onEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
  };
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await getAlltexts(chatID);
        setMsg(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [chatID]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (textt === "") {
    } else if (textt !== "") {
      const data = {
        chatId: chatID,
        senderId: user._id,
        text: textt,
      };

      const receiverId = receiver._id;

      setSendMsg({ ...msg, receiverId });
      try {
        const data1 = await addMessage(data);
        setMsg([...msg, data1]);
        setText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log("Message Arrived :", receiveMsg);

    if (receiveMsg !== null && receiveMsg.chatId === chatID) {
      console.log("ya")
      console.log(receiveMsg)
      setMsg([...msg, receiveMsg]);
    }
  });
  const scroll = useRef();


  return (
    <div className="sideChat w-0 flex-1 h-screen bg-[#0a0505] hidden sm:flex flex-col text-white relative  ">
      {/* Nav */}
      <nav className="flex items-center px-2 text-white justify-between w-full h-[10%] bg-[#353638] absolute top-0">
        <div className="relative">
          <div className="img w-12 h-12 border-2 rounded-full border-purple-600">
            <img
              className="w-full h-full object-contain rounded-full"
              src={receiver.image}
              alt=""
            />
          </div>
          <span className="w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-1"></span>
        </div>
        <h1>{receiver.name}</h1>
        <button className="text-2xl opacity-80 cursor-pointer">
          <FaSearch />
        </button>
      </nav>

      {/* Content */}
      <div className="msgs flex flex-col w-full h-[80%] absolute top-16 bg-[#0F0F0F] overflow-y-auto scrollbar-thin scrollbar-thumb-[#212121] scrollbar-track-black p-2 ">
        {msg.length !== 0 &&
        msg.some((message) => message.chatId === chatID) ? (
          msg.map((message, index) => (
            <div
              ref={scroll}
              key={index}
              className={`message-container w-full relative mb-12`}
            >
              <span
                className={`p-2 border absolute rounded-b-2xl bg-purple-900 ${
                  message.senderId !== user._id
                    ? "left-1    rounded-tr-2xl"
                    : "right-1   rounded-tl-2xl"
                } `}
              >
                {message.text}
              </span>
            </div>
          ))
        ) : (
          <p>No messages here. Start conversation...</p>
        )}
        {/* bg-[#252525] */}
      </div>

      {showEmoji ? (
        <EmojiPicker
          autoFocusSearch
          theme="dark"
          className=" absolute -bottom-72"
          sm:width={"35%"}
          height={350}
          onEmojiClick={onEmojiClick}
        />
      ) : (
        ""
      )}
      {/* Form */}
      <form
        className="flex items-center px-5 text-white justify-between w-full h-[10%] bg-[#353638] absolute bottom-0"
        onSubmit={handleSubmit}
      >
        <div
          onClick={handleEmoji}
          className="p-2 hover:bg-[#2B2B2B] rounded-md"
        >
          <FaRegSmile className="text-2xl  cursor-pointer " />
        </div>
        <input
          className="bg-transparent ml-3 w-4/5 border-b border-purple-500 outline-none"
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={textt}
          placeholder="Type you messaage here..."
        />

        <button class="svg-wrapper">
          <svg
            className="w-6 h-6 rotate-45 text-purple-500 "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  );
};
export default Conversation;
