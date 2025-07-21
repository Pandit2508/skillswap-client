// src/components/UserCard.jsx
import { motion } from "framer-motion";

const UserCard = ({ user, onSendRequest }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#0f0f1a] text-white border border-gray-700 p-6 rounded-2xl w-full max-w-sm shadow-xl"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white"
        />
        <h3 className="font-bold text-lg">{user.name}</h3>
        <p className="text-sm text-gray-400">{user.title}</p>
        <p className="mt-4 text-gray-300">{user.bio}</p>
        <button
          onClick={() => onSendRequest(user.id)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg"
        >
          Send Request
        </button>
      </div>
    </motion.div>
  );
};

export default UserCard;
