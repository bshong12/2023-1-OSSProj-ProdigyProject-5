import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import tw, { styled, css } from "twin.macro"
import Link from "next/link"
import MarketingContainer from "../layouts/MarketingContainer"
import { Img, Input, Button, LoadingCircle, StyledLink } from "../components"
import { set, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import api from "../utils/api"

const SmallDiv = styled.div(() => [ //가운데 가 비어있는 선 컴포넌트
  tw`relative w-full text-center text-neutral-5 after:(right-0) before:(left-0)`,
  css`
    &:before,
    &:after {
      ${tw`inline-block absolute 
      top-1/2 [content:""] 
      [border-bottom:1px_solid_rgba(var(--neutral-4))]
      [width:calc(50% - 6em)]
      `};
    }
    
    > small {
      ${tw`inline-block`}
    }
  `,
])

//로그인 요청을 백엔드로 보내는 비동기 함수
const login = async (data) => {
  try {
    const requestData = {
      id: data.studentID,
      password: data.password,
    };
    const response = await api.post("/login", requestData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

//로그인 할 때 받는 id와 비밀번호 스키마 정의
const schema = yup.object().shape({
  studentID: yup.string().required("학번 또는 ID를 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});

//웹을 실행하면 가장 먼저 로드되는 페이지
export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // const [token, setToken] = useState(null);

  //useForm 훅을 이용하여 form 조건 정의
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  })

  //폼을 제출했을 때의 동작 정의 
  const onSubmit = (data) => {
    setIsLoading(true)

    login(data)
    .then((response) => {
      if (response.status === 200) { //로그인에 성공하면 관리자냐 관리자가 아니냐에 따라 들어가지는 페이지가 다름
        if(response.data.type === "관리자"){
          router.push("/manage");
        } else{
          router.push("/buildings");
        }
      } else {
        setIsLoading(false);
        alert("로그인 실패");
      }
    })
    .catch((error) => {
      console.error(error);
    });

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  

  return (
    <MarketingContainer title="log in" footer noHeaderNav>
      <main
        tw="min-h-screen max-w-screen-sm w-full
          mx-auto px-4 pb-28 md:(px-8) flex
          flex-col items-center justify-center"
      >
        <h1 tw="text-3xl sm:(text-5xl)  text-center pt-10 pb-0">Log in</h1>
        <div tw="px-2 sm:px-16 space-y-5">
          <div tw="mt-8 w-full text-center">동국대학교 강의실 대관신청 시스템</div>

          <SmallDiv>
            <small> 유드림스 아이디와 비밀번호 입력</small>
          </SmallDiv>
        </div>

        <form
          tw="space-y-5 text-left
              px-2 sm:px-16
              pt-5 pb-16
              w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              type="text"
              placeholder="아이디 또는 학번을 입력해주세요"
              aria-label="studentID"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              {...register("studentID")}
              error={!!errors?.studentID}
              noLabel
              required
            />
            <small tw="text-red-700">{errors?.studentID?.message}</small>
          </div>
          <div>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              aria-label="password"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              {...register("password")}
              error={!!errors?.password}
              noLabel
              required
            />
            <small tw="text-red-700">{errors?.password?.message}</small>
          </div>
          <Button
            type="submit"
            // type="submit"
            tw="flex items-center justify-center"
            disabled={!!isLoading}
            isLarge
          >
            {isLoading ? <LoadingCircle /> : "로그인"}
          </Button>
        </form>
        <Link href="/signup">
          <StyledLink tw="text-left">회원가입</StyledLink>
        </Link>
      </main>
    </MarketingContainer>
  )
}

Home.theme = "light"
