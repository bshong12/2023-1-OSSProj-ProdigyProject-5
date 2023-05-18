import React, { useEffect, useState, useRef, Fragment } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { StyledLink, Button, Input} from "../../../../components"
import { buildings, nameToSlug, slugToName } from "../../../../utils/buildings"
import { format } from "date-fns"



//전 페이지에서 신청정보 모두 넘겨줘야 함

const user = {name:"name", studentID: "id", major: "major", phone: "phonenumber", email:"email@gmail.com"}

function Form({user}) {

  return (
    <div tw="w-full">
      <h3 tw="w-full text-left bg-neutral-2 h-10 flex items-center p-2">상세내역 입력</h3>
      <hr tw="w-full border-neutral-3"/>
      <form>
       <div tw="flex w-full items-center mt-5 border-t border-b border-neutral-3 "> 
        <p tw="w-3/12 mr-3">신청사유</p>  
        <Input
              type="text"
              placeholder="신청사유"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              noLabel
              required
              tw="h-7 m-2 w-9/12"
            />
        </div>
        <div tw="flex w-full items-center border-b border-neutral-3 "> 
        <p tw="w-3/12 mr-3">행사명</p>  
        <Input
              type="text"
              placeholder="행사명"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              noLabel
              required
              tw="h-7 m-2 w-9/12"
            />
        </div>
        <div tw="flex w-full items-center border-b border-neutral-3 justify-start"> 
        <p tw="w-3/12 mr-3">신청인원</p>
        <Input
              type="number"
              placeholder="신청사유"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              noLabel
              required
              tw="h-7 m-2 w-1/2"
            />
        </div>
        <div tw="flex w-full items-center border-b border-neutral-3 "> 
        <p tw="w-3/12 mr-3">단체(주최자)명</p>  
        <Input
              type="text"
              placeholder="단체명"
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              noLabel
              required
              tw="h-7 m-2 w-9/12"
            />
        </div>
        <div tw="flex w-full items-center border-b border-neutral-3 h-44"> 
        <p tw="w-3/12 mr-3">행사개요</p>  
        <textarea
              type="text"
              placeholder="행사개요를 구체적으로 작성하여 주세요."
              autoComplete="off"
              autoCapitalize="none"
              maxLength="30"
              tw="h-32 m-2 w-9/12 appearance-none bg-base
              px-3 py-4 
              text-neutral-7 text-sm sm:text-base 
              font-medium tracking-wide
              rounded-brand
              border border-neutral-3
              ring-neutral-3 ring-opacity-10
              placeholder-neutral-3
              focus:(outline-none ring-neutral-7 border-neutral-7)"
            />
        </div>
        <h3 tw="text-left mt-5">신청자 정보</h3>
           <hr tw="w-full border-neutral-3"/>
           <div tw="border border-neutral-4 mt-5"> 
            <div tw="flex w-full items-center border-neutral-4 bg-neutral-1 h-7">
              <p tw="border-neutral-3 w-1/12 text-neutral-5 text-sm">이름</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">학번</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">소속</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">전화번호</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">이메일</p>
            </div> 
            <div tw="flex w-full items-center border-t border-neutral-3 h-7">
              <p tw="border-neutral-3 w-1/12 text-neutral-5">{user.name}</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5">{user.studentID}</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5">{user.major}</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5">{user.phone}</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5">{user.email}</p>
            </div>
           </div>
      </form>

    </div>
  )
}


export default function ReserveForm() { //앞서 선택했던 예약 정보들 받아오기
  const { asPath } = useRouter();
  const router = useRouter();


  const onReserve = () => { //예약신청 버튼을 눌렀을 때
    const result = window.confirm("예약이 완료되었습니다. 예약내역을 확인하시겠습니까?");
    if(result) {
      router.push('../mypage');
    } else {
      router.push('../../buildings');
    }
  }
  
  const onCancle = () => { //취소 버튼을 눌렀을 때
    const result = window.confirm("예약을 취소하시겠습니까?");
    if(result) {
      router.push('../mypage');
    }
  }
  
  const ButtonArea = () => { // buttonArea.
    return (
    <div tw="w-full flex justify-center">
      <Button variant={"primary"} onClick={onReserve} tw="m-7 w-36">예약신청</Button>
      <Button variant={"trans"} onClick={onCancle} tw="m-7 w-36">닫기</Button>
    </div>
    )
}
  return (
    <Fragment>
      <main tw="h-full">
        <section tw="text-center my-28">
          <div tw="max-w-screen-lg mx-auto">
           <Form user={user}/>
           
           <h3 tw="text-left mt-5">신청 정보 확인</h3>
           <hr tw="w-full border-neutral-3"/>
           <div tw="border border-neutral-4 mt-5"> 
            <div tw="flex w-full items-center border-neutral-4 bg-neutral-1 h-7">
              <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">예약일자</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">시작시간</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">종료시간</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">신청건물</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">신청장소</p>
            </div> 
            <div tw="flex w-full items-center border-t border-neutral-3 h-7">
              <p tw="border-neutral-3 w-1/6 text-neutral-5">23.06.01</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5">13:00</p>
              <p tw="border-neutral-3 w-1/6 text-neutral-5">14:30</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5">학술/문화관</p>
              <p tw="border-neutral-3 w-1/3 text-neutral-5">K217</p>
            </div>
           </div>
           <ButtonArea/>
          </div>
        </section>
      </main>
    </Fragment>
  )
}

