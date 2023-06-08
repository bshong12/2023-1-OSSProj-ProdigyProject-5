import { Fragment, useEffect, useRef, useState } from "react"
import tw, { css } from "twin.macro"
import Link from "next/link"
import SEO from "../next-seo.config"
import { NextSeo } from "next-seo"
import { Transition } from "../primitives"
import { Popover } from "@headlessui/react"
import Router, { useRouter } from "next/router"
import { Header, Img, Button, ThemeChanger, Footer, Logo } from "../components"
import { HiLightningBolt, HiCog, HiUser, HiLogout } from "react-icons/hi"
import api from "../utils/api"

const dropDownOptions = [ //유저 아이콘 메뉴
  {
    name: "마이페이지",
    href: "/mypage",
    icon: HiUser,
  },
  {
    name: "로그아웃",
    icon: HiLogout,
  }
]

export const UserUIContainer = ({
  children,
  headerBorder,
  footer,
  footerNav,
  title,
  logoName,
}) => {
  const router = useRouter()
  const [openTaskModal, setOpenTaskModal] = useState(false)
  const url = `${SEO.canonical}${router.route}`

  return (
    <Fragment>
      <NextSeo
        title={title}
        canonical={url}
        robotsProps={{
          nosnippet: true,
          notranslate: true,
          noimageindex: true,
          noarchive: true,
          maxSnippet: -1,
          maxImagePreview: "none",
          maxVideoPreview: -1,
        }}
        openGraph={{
          url,
          title,
        }}
      />
      <Header headerBorder={headerBorder}>
        <Logo showName name={logoName}/>
        <div tw="inline-flex items-center justify-end">
          <UserDropDown />
        </div>
      </Header>
      {children}
      {footer && <Footer nav={footerNav} />}
    </Fragment>
  )
}

const logout = async () => { //로그아웃 요청
  try {
    const response = await api.post("/logout");
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const UserDropDown = () => { //유저 메뉴 
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => { //로그아웃이 성공하면 로그인 페이지로 돌아감
    logout()
    .then(response => {
      if(response.status === 200) {
        router.push("/");
      }
    })
    .catch(error => {
      console.error(error);
    })
    
  }
  return (
    <Popover tw="relative [min-width:40px]">
      {({ open }) => (
        <Fragment>
          <Popover.Button
            tw="inline-flex justify-center ml-2 my-2 
              rounded-full ease-in-out
              hover:(ring-8 ring-white ring-opacity-10)
              hocus:(outline-none)"
          >
            <HiUser tw="w-7 h-6" />
          </Popover.Button>
          <Transition as={Fragment}>
            <Popover.Panel tw="absolute z-10 w-28 transform [translate-x-:-65%]">
              <div
                tw="relative bg-neutral-1 px-1 py-2 text-xs text-neutral-8
                    overflow-hidden rounded-brand shadow-2xl border ring-neutral-3 ring-opacity-5
                    sm:(text-sm py-3 font-medium tracking-wide)"
              >
                  {dropDownOptions.map((option) => (
                  <div key={option.name}>
                    {option.href ? ( //dropDownOptions에 href가 포함되어 있는 지 아닌 지에 따라 Link를 넣거나 버튼을 넣거나 함
                      <Link href={option.href} passHref>
                        <div
                          tw="inline-flex items-center w-full p-2 transition duration-150
                            ease-in-out rounded-brand 
                            hocus:(bg-neutral-8 text-neutral-1 outline-none)"
                        >
                          <span tw="mr-2">
                            <option.icon width={18} />
                          </span>
                          {option.name}
                        </div>
                      </Link>
                    ) : ( //버튼은 로그아웃을 수행하는 버튼
                      <button
                        onClick={handleLogout}
                        tw="inline-flex items-center w-full p-2 transition duration-150
                          ease-in-out rounded-brand 
                          hocus:(bg-neutral-8 text-neutral-1 outline-none)"
                      >
                        <span tw="mr-2">
                          <option.icon width={18} />
                        </span>
                        {option.name}
                      </button>
                    )}
                    <hr tw="opacity-80 my-1" />
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </Fragment>
      )}
    </Popover>
  )
}
