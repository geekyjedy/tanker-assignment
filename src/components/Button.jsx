import React from "react";

const Button = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-4 text-xl rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 flex justify-center items-cente ${label === '0' && "col-span-2"} ${label === '=' && "bg-sky-500 text-white"} ${label === 'MC' && 'mb-3 px-6'}`}
    >
      {label}
    </button>
  );
}

export default Button;
