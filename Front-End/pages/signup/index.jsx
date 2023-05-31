import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import tw, { styled, css } from "twin.macro"
import Link from "next/link"
import MarketingContainer from "../../layouts/MarketingContainer"
import { Img, Input, Button, LoadingCircle, StyledLink } from "../../components"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import api from "../../api"

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

async function signup(data) {
  try {
    const response = await api.post("/signup", data);
    // 회원가입 성공
    console.log(response.data);
    return response;  
  } catch (error) {
    // 회원가입 실패
    console.error(error.response.data);
    // 에러 처리 (예: 오류 메시지 표시)
  }
}

const schema = yup.object().shape({
  qualification: yup.string().required("자격을 선택해주세요."),
  name: yup.string().required("이름을 입력해주세요."),
  studentID: yup.string().required("학번 또는 ID를 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
  email: yup.string().email("올바른 이메일 형식이 아닙니다.").required("이메일을 입력해주세요."),
  phoneNumber: yup.string().required("전화번호를 입력해주세요."),
});



export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    console.log(data);

    signup(data)
    .then((response) => {
      console.log(response);
      setIsLoading(false);
      // 서버측에서 json형태로 보내주는 경우 {"success": true} 
      // if (response.data.success) {
      //  if(confirm("회원가입이 완료되었습니다. 로그인 페이지로 이동하시겠습니까?")) {
      //    router.push("/");
      //  }else {
      //    router.push("/");
      // }else {
      //  alert("회원가입에 실패하였습니다.");
      // }
      //서버측에서 리다이렉션을 해주는 경우에는 이대로 두면 됨
    })
    .catch((error) => {
      console.error(error);
      setIsLoading(false);  
    })
  };

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
          onSubmit={handleSubmit(onSubmit)}
        >
           <div>
            <p>자격</p>
            <select tw="w-full rounded-lg border-neutral-3" {...register("qualification")} aria-label="qualification" required>
              <option value="">자격</option>
              <option value="student">학생</option>
              <option value="manager">관리자</option>
            </select>
          </div>
          <div>
            <p>이름</p>
            <Input
              type="text"
              aria-label="name"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="name"
              name="name"
              {...register("name")}
              noLabel
              required
            />
          </div>
          <div>
            <p>학번/ID</p>
            <Input
              type="number"
              aria-label="studentID"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              id="studentID"
             name="studentID"
             {...register("studentID")}
              noLabel
              required
            />
          </div>
          <div>
            <p>비밀번호</p>
            <Input
              type="text"
              aria-label="password"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="Password"
              name="Password"
              {...register("password")}
              noLabel
              required
            />
          </div>
         
          <div>
            <p>이메일</p>
            <Input
              type="email"
              aria-label="email"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="email"
              name="email"
              {...register("email")}
              noLabel
              required
            />
          </div>
          <div>
            <p>전화번호</p>
            <Input
              type="text"
              aria-label="phoneNumber"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="10"
              id="phoneNumber"
              name="phoneNumber"
              {...register("phoneNumber")}
              noLabel
              required
            />
          </div>
          <Button
            type="submit"
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


