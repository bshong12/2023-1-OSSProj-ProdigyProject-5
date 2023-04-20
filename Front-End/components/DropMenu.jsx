import tw from "twin.macro";
import {useState} from 'react';

export default function DropMenu ({ buttonText, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div tw="relative">
      <button
        tw="bg-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        css={{ position: 'relative' }} // 버튼에 position: relative 추가
      >
        <span>{buttonText}</span>
        <svg
          tw="fill-current h-4 w-4 ml-2"
          xmlns="/static/drop_icon.svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2zm0 8a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div
          tw="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10"
          css={{ top: '-2px' }} // 드롭다운 메뉴의 top 위치 조정
        >
          {children}
        </div>
      )}
    </div>
  );
};
