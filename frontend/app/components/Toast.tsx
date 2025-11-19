import React from "react";
interface ToastProps{
    color:String,
    content:String,
}
const Toast = ({color,content}:ToastProps) => {
  return (
    <div className={`fixed bottom-5 right-5 flex items-center gap-4 rounded-lg ${color} p-4 text-white shadow-lg backdrop-blur-sm`}>
      <span className="material-symbols-outlined">check_circle</span>
      <p className="text-sm font-medium">${content}</p>
    </div>
  );
};

export default Toast;
