import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-down">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">SkillSwap</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          A decentralized platform to barter skills, learn, and grow together — <br />
          <span className="italic">no money involved, just mutual growth.</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
