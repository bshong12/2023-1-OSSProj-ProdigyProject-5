import tw from "twin.macro";
import {useState, useRef} from 'react';

export default function DropMenu ({ buttonText, children, variant }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  
  return (
    <div tw="relative">
      <button
        tw="border border-gray-400 font-bold text-gray-700 py-2 px-4 rounded inline-flex items-center w-40 justify-between"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        css={{ position: 'relative' }} // 버튼에 position: relative 추가
        ref={buttonRef}
      >
        <span>{buttonText}</span>
        <img src="/static/drop_icon.png"></img>
        
      </button>
      {isMenuOpen && (
        <div
          tw="absolute border border-gray-300 right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10"
          css={{top: buttonRef.current ? buttonRef.current.offsetHeight + 2 : 0, // 버튼 아래에 위치시키기 위해 top 위치 계산
          left: buttonRef.current ? buttonRef.current.offsetLeft : 0,}} 
        >
          {children}
        </div>
      )}
    </div>
  );
};
