import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserItems from "./UserItems";
import { allUsers } from "../../features/user/userSlice";

const Listusers = ({ onlineUsers }) => {
  const { users, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length === 0) {
      dispatch(allUsers());
    }
  }, [dispatch, users]);
  if (isLoading) {
    return (
      <ul className="mt-3 bg-[#0F0F0F] p-1 h-screen flex justify-center items-center ">
        <div class="leap-frog relative flex items-center justify-between w-56 h-40 ">
          <div class="leap-frog__dot w-10 h-10 rounded-full bg-purple-500"></div>
          <div class="leap-frog__dot w-10 h-10 rounded-full bg-purple-500 "></div>
          <div class="leap-frog__dot w-10 h-10 rounded-full  bg-purple-500"></div>
        </div>
      </ul>
    );
  }
  return (
    <ul className="mt-3 bg-[#0F0F0F] p-1 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#212121] scrollbar-track-black ">
      {users.map((userData) => (
        <UserItems
          key={userData._id}
          userData={userData}
          onlineUsers={onlineUsers}
        />
      ))}
    </ul>
  );
};

export default Listusers;