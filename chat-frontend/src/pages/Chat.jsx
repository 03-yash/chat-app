import React, { useEffect, useState } from "react";
import { FaSearch, FaUserMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutUser } from "../../features/user/userSlice";
import Listusers from "../components/Listusers";
import Conversation from "../components/Conversation";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:2221";

var socket;
const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,users, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.user
  );
  const { receiver } = useSelector((state) => state.chat);

  // for sockets
  

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMsg, setSendMsg] = useState(null);
  const [receiveMsg, setReceiveMsg] = useState(null);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (isError && message) {
      toast.error(message);
    }
  }, [user, isError, message]);

  // Use another useEffect to log users when it changes

  const handlelogout = async () => {
    dispatch(signoutUser());
    navigate("/login");
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("new-user-add", user._id);
    socket.on("get-active-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // sending message to socket
  useEffect(() => {
    if (sendMsg !== null) {
      socket.emit("send-message", sendMsg);
    }
  }, [sendMsg]);

  // receive message from socket
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setReceiveMsg(data);   
    }

    );
  },[]);



 
  if (isLoading) {
    return (
      <div class="w-full h-screen flex justify-center items-center bg-[#212121] ">
        <div class="leap-frog relative flex items-center justify-between w-72 h-40 ">
          <div class="leap-frog__dot w-10 h-10 rounded-full bg-purple-500"></div>
          <div class="leap-frog__dot w-10 h-10 rounded-full bg-purple-500 "></div>
          <div class="leap-frog__dot w-10 h-10 rounded-full  bg-purple-500"></div>
        </div>
      </div>
    );
  }
  if (user) {
    return (
      <div className="main bg-[#212121] w-full h-screen flex">
        <div className="sideUsers w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/4 h-screen bg-[#353638]">
          <div className="px-2 pt-2 flex flex-col h-screen">
            <nav className="flex items-center px-2  text-white  justify-between">
              <div className="img w-12 h-12  border-2 rounded-full border-purple-600">
                <img
                  className="w-full h-full object-contain rounded-full"
                  src={user.image}
                  alt=""
                />
              </div>
              <span className="text-center space-y-1">
                <h1 className="text-md">Chat App</h1>
                <h1 className="text-xs text-purple-500 ">{user.name}</h1>
              </span>
              <button
                className="text-2xl opacity-70 hover:scale-90 hover:opacity-100"
                onClick={handlelogout}
              >
                <FaUserMinus />
              </button>
            </nav>
          
            <Listusers />
          </div>
        </div>
        {receiver ? (
          <Conversation setSendMsg={setSendMsg} receiveMsg={receiveMsg} onlineUsers={onlineUsers} users={users}/>
        ) : (
          <></>
        )}
      </div>
    );
  }
};

export default Chat;
