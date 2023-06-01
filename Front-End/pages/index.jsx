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

const SmallDiv = styled.div(() => [
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

const schema = yup.object().shape({
  studentID: yup.string().required("학번 또는 ID를 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  // const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  const handleCheckboxChange = (event) => {
    setIsAdmin(event.target.checked);
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  })

  
  const onSubmit = (data) => {
    setIsLoading(true)
    console.log(data)

    login(data)
    .then((response) => {
      if (response.status === 200) {
        // setToken(response.data.token);
        // sessionStorage.setItem("token", response.data.token); // 토큰 저장
        if(isAdmin){
          router.push("/manage");
        } else {
          setIsLoading(false);
        }
       
        router.push("/buildings");
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
          <div tw="flex items-center">
            <input type="checkbox" id="identify" name="identify" value="manager" tw="border border-neutral-4" onChange={handleCheckboxChange}/>
            <label for="identify" tw="text-sm text-neutral-4 ml-3">관리자로 로그인하시겠습니까?</label>
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
          <StyledLink tw="text-center">회원가입</StyledLink>
        </Link>
      </main>
    </MarketingContainer>
  )
}

Home.theme = "light"
