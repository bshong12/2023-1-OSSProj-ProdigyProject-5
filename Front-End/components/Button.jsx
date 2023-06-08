import tw, { styled } from "twin.macro"

const Button = styled.button(({ variant, isSmall, isLarge, isBold }) => [
  // variant에 따라 버튼의 색상 등이 달라짐. isSmall, isLarge, isBold는 글씨 크기 또는 굵기 지정
  tw`   p-3 rounded-brand w-full
        text-white font-medium tracking-tight
        transform duration-200 ease-in-out
        bg-dguMain
        text-center
        outline-none
        ring-0
        hocus:(bg-dguLight ring-0 outline-none appearance-none)
        disabled:(
          cursor-not-allowed opacity-60 
          appearance-none ring-0 outline-none
          text-neutral-8 bg-base border-2 border-neutral-3)
        `,

  variant === "primary" &&
    tw` bg-dguMain text-neutral-1 hocus:(bg-neutral-8)
        disabled:hocus:(bg-base text-neutral-8)
      `,

  variant === "secondary" &&
    tw`hocus:( bg-neutral-9 text-brand)
         disabled:hocus:(bg-base text-neutral-8)`,

  variant === "outline" &&
    tw`border border-neutral-9 bg-transparent text-neutral-8
      hocus:(bg-neutral-1) disabled:hocus:(bg-base text-neutral-8)`,

  variant === "inverted" &&
    tw`border border-neutral-9 bg-transparent text-neutral-8
      hocus:(bg-neutral-9 text-neutral-1) disabled:hocus:(bg-base text-neutral-8)`,

  variant === "gray" &&
    tw`bg-neutral-2 text-neutral-9 hocus:(bg-neutral-3)
        disabled:hocus:(bg-base text-neutral-8)
      `,
  variant === "trans" &&
    tw` border border-dguMain hocus:(bg-neutral-2)
         disabled:hocus:(bg-base text-neutral-8)
         rounded-brand bg-white text-dguMain font-bold border-2
        `,

  isSmall && tw`text-sm`,
  isLarge && tw`text-lg`,
  isBold && tw`font-semibold`,
])

export default Button
