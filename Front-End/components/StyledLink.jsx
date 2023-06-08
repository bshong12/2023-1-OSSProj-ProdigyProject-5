import tw, { styled } from "twin.macro"

//링크태그에는 직접 스타일을 지정할 수 없기 때문에 링크 하위 요소로 포함 될 div태그 
const StyledLink = styled.div(({ arrow, variant, underline }) => [
  tw`appearance-none no-underline `,
  underline && tw`hocus:(underline)`,
  variant === "blue" && tw`text-blue-600`,
  variant === "brand" && tw`text-brand`,
  variant === "primary" && tw`text-brand hocus:(text-neutral-9)`,
  variant === "secondary" && tw`hocus:(text-brand)`,
  arrow && tw`after:([content:"↗"])`,
])

export default StyledLink
