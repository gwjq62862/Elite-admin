import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

// Input နှင့် Textarea နှစ်မျိုးလုံးအတွက် Props Interface
interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isTextArea?: boolean;
  // ဤနေရာတွင် value, onChange, disabled props များကိုလည်း လက်ခံနိုင်စေရန် ထည့်သွင်းထားသည်
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const baseClasses =
  "w-full p-3 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-surface-light dark:bg-[#282828] border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150";

export default function InputGroup({
  label,
  id,
  isTextArea = false,
  value,
  onChange,
  ...rest
}: InputGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal"
      >
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          rows={4}
          className={`${baseClasses} resize-none`}
          value={value}
          onChange={onChange as any} // Textarea အတွက် Type Casting
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={baseClasses}
          value={value}
          onChange={onChange as any}
          {...rest}
        />
      )}
    </div>
  );
}
