// Button.js
import React from "react";

function Button({ label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 text-xl rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 ${className}`}
    >
      {label}
    </button>
  );
}

export default Button;
