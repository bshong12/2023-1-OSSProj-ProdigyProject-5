import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import tw, { styled, css } from "twin.macro"
import Link from "next/link"
import MarketingContainer from "../../layouts/MarketingContainer"
import { Img, Input, Button, LoadingCircle, StyledLink } from "../../components"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const SmallDiv = styled.div(() => [
  tw`relative w-full text-center text-neutral-5 after:(right-0) before:(left-0)`,
  css`
    &:before,
    &:after {
      ${tw`inline-block absolute 
      top-1/2 [content:""] 
      [border-bottom:1px_solid_rgba(var(--neutral-4))]
      [width:calc(50% - 5em)]
      `};
    }
    
    > small {
      ${tw`inline-block`}
    }
  `,
])


export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   mode: "onBlur",
  //   resolver: yupResolver(studentIDSchema),
  //   resolver: yupResolver(passwordSchema),
  // })
  const onSubmit = (data) => {
    setIsLoading(true)
    console.log(data)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <MarketingContainer title="회원가입" footer noHeaderNav>
      <main
        tw="min-h-screen max-w-screen-sm w-full
          mx-auto px-4 pb-28 md:(px-8) flex
          flex-col items-center justify-center mt-10"
      >
        <h1 tw="text-3xl sm:(text-4xl)  text-center pt-10 pb-0">회원가입</h1>
        

        <form
          tw="space-y-5 text-left
              px-2 sm:px-16
              pt-5 pb-16
              w-full"
          onSubmit={onSubmit}
        >
           <div>
            <p>자격</p>
            <select tw="w-full rounded-lg border-neutral-3">
              <option value="student">학생</option>
              <option value="manager">관리자</option>
            </select>
          </div>
          <div>
            <p>이름</p>
            <Input
              type="text"
              aria-label="Name"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="name"
              name="name"
              noLabel
              required
            />
          </div>
          <div>
            <p>학번/ID</p>
            <Input
              type="number"
              aria-label="Student ID"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              id="studentID"
             name="studentID"
              noLabel
              required
            />
          </div>
          <div>
            <p>비밀번호</p>
            <Input
              type="text"
              aria-label="Password"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="Password"
              name="Password"
              noLabel
              required
            />
          </div>
         
          <div>
            <p>이메일</p>
            <Input
              type="email"
              aria-label="Email"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="email"
              name="email"
              noLabel
              required
            />
          </div>
          <div>
            <p>전화번호</p>
            <Input
              type="text"
              aria-label="Phone Number"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="phoneNumber"
              name="phoneNumber"
              noLabel
              required
            />
          </div>
          <Button
            type="button"
            onClick={() => router.push("../pages")}
            // type="submit"
            tw="flex items-center justify-center"
            disabled={!!isLoading}
            isLarge
          >
            {isLoading ? <LoadingCircle /> : "회원가입"}
          </Button>
        </form>
      </main>
    </MarketingContainer>
  )
}


