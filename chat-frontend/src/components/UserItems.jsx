import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChat, receiverUser } from "../../features/chat/chatSlice";

const UserItems = ({ userData,onlineUsers }) => {
  const {user, users} = useSelector(state=>state.user)
  const [Online, setOnline] = useState(false);

  // useEffect(() => {
  //   const checkOnlineStatus = ( userData) => {
  //     const chatMember = users.members.find((member) => member !== userData._id);
  //     const online = onlineUsers.find((user) => user.userId === chatMember);
  //     return online ? true : false;
  //   };

  //   const isOnline = checkOnlineStatus(users, userData);
  //   setOnline(isOnline);
  // }, [ users,userData, onlineUsers]);

  const dispatch = useDispatch()
  const startChat=(ID, userData)=>{
    const IDS = {
      senderID : user._id,
      receiverID : ID
    }
    dispatch(receiverUser(userData))
    dispatch(createChat(IDS))

  }

  return (
    <li
      key={userData._id}
      onClick={()=>startChat(userData._id, userData)}
      className="flex rounded-lg border-r-0 border-t-0 border-purple-500 border items-center p-1 bg-white/10 backdrop-blur-lg mt-3 hover:border-none cursor-pointer"
    >
      <div className="img w-10 h-10  border border-purple-500 rounded-full">
        <img
          className="w-full h-full object-contain rounded-full"
          src={userData.image}
          alt=""
        />
      </div>
      <span className="ml-2 text-white">
        <p>{userData.name}</p>
        <p
          className={`text-xs ${
            Online ? "text-purple-500" : "text-gray-500"
          }`}
        >
          {Online ? "Online" : "Offline"}
        </p>
      </span>
    </li>
  );
};

export default UserItems;
