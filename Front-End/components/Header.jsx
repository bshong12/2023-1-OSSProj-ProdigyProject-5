import tw, { css } from "twin.macro"

 //헤더. 헤더 아래에 border를 넣을 지 말지 지정 가능. 헤더에 로고에 nav기능도 넣을지말지 지정 가능
export default function Header({ headerBorder, noHeaderNav, children }) {
  return (
    <header
      css={[
        tw`top-0 z-30 w-full 
                `,

        tw`fixed bg-neutral-yang
                [@supports (backdrop-filter: none)]:(backdrop-filter backdrop-blur-lg saturate-150 bg-[var(--background)])`,
        headerBorder && tw`border-b border-neutral-2`,
      ]}
    >
      <nav
        className="nav-link"
        css={[
          tw`flex items-center  w-full [max-height:64px] 
                    max-w-screen-lg py-2 px-3 mx-auto lg:(px-2)`,
          noHeaderNav ? tw`justify-center` : tw`justify-between`,
        ]}
      >
        {children}
      </nav>
    </header>
  )
}
