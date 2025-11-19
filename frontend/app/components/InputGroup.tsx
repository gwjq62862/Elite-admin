// app/components/InputGroup.tsx

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";


type BaseProps = {
    label: string;
    id: string;
    placeholder?: string;

};


type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & {
    type?: 'text' | 'url' | 'password' | 'email';
};


type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
    isTextArea: true;
};


type FieldProps = InputProps | TextAreaProps;



const InputGroup: React.FC<FieldProps> = (props) => {
    
  
    const { label, id, placeholder, isTextArea, ...restProps } = props as (
        InputProps & { isTextArea?: boolean }
    );

  
    const inputClasses = "form-input w-full resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-[#2C2C2E] placeholder:text-gray-500 dark:placeholder:text-gray-400 p-4 text-base font-normal leading-normal";

    return (
        <div className="flex flex-col gap-2">
            <label 
                className="text-gray-900 dark:text-white text-base font-medium leading-normal" 
                htmlFor={id}
            >
                {label}
            </label>
            
            {isTextArea ? (
                // TextArea
                <textarea
                    id={id}
                    className={`${inputClasses} min-h-36`}
                    placeholder={placeholder}
             
                    {...restProps as TextareaHTMLAttributes<HTMLTextAreaElement>} 
                />
            ) : (
                // Input Field
                <input
                    id={id}
                 
                    type={props.type || 'text'} 
                    className={`${inputClasses} h-14`}
                    placeholder={placeholder}
                    // isTextArea မပါဝင်တော့သော restProps ကို ဖြန့်လိုက်ပါသည်
                    {...restProps as InputHTMLAttributes<HTMLInputElement>} 
                />
            )}
        </div>
    );
};

export default InputGroup;