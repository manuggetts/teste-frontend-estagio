"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  state?: "default" | "error";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClickIcon?: () => void;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  state = "default",
  disabled = false,
  className = "",
  icon,
  onClickIcon,
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  const stateClasses = {
    default:
      "border-gray-300 focus:border-primary-purple focus:ring-primary-purple/20",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses[state]} ${disabledClasses} ${className}`}
      />
      {icon && (
        <button
          type="button"
          onClick={onClickIcon}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-purple transition-colors"
          disabled={disabled}
        >
          {icon}
        </button>
      )}
    </div>
  );
};

export default Input;