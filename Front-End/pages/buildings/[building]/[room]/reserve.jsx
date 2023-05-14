import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../../components"
import { UserUIContainer } from "../../../../layouts/UserUIContainer"
import { buildings, nameToSlug, slugToName } from "../../../../utils/buildings"
import { format } from "date-fns"
import { HiOutlineClock } from "react-icons/hi"
import { Modal } from "../../../../primitives"





//예약 팝업 Form. 
//user는 사용자 정보로 현재 로그인 되어있는 사용자의 기본정보가 자동으로 입력될 수 있게 하기 위해 받는 것
//reservation은 예약 날짜, 시작시간, 종료시간, 신청 장소를 받기 위한 것임
const user = {name:"name", studentID: "id", major: "major", phone: "phonenumber", email:"email@gmail.com"}
//reservation: {building: "", room: "", startTime: "", endTime:""} 이라 가정
function Form(user) {
  const TRow = tw.tr`
    border-t
    border-b
    border-neutral-5
  `
  const THead = tw.th`
    border-r
    border-neutral-6
    bg-neutral-2
    w-3/12
    text-center
  `
  const TData = tw.td`
    flex
    justify-center
  `
  const TInput = tw.input`
    from-90%
  `
  return (
    <div tw="w-full">
      <h3 tw="w-full text-left ">상세내역 입력</h3>
      <form>
        <table tw="w-full collapse">
          <TRow>
            <THead>*신청사유</THead>
            <TData><TInput type="text" id="Reason" name="reason"/></TData>
          </TRow>
          <TRow>
            <THead>*행사명</THead>
            <TData><TInput type="text" id="ReservName" name="reserve_name"/></TData>
          </TRow>
          <TRow>
            <THead>*예상인원</THead>
            <TData><TInput type="number" id="Headcount" name="headcound"/></TData>
          </TRow>
          <TRow>
            <THead>*단체(주최자)명</THead>
            <TData><TInput type="text" id="OrganizerName" name="organizer_name"/></TData>
          </TRow>
          <TRow>
            <THead>*행사개요</THead>
            <TData><textarea tw="from-90%" rows={"4"} id="Outline" name="outline"/></TData>
          </TRow>
          <TRow>
            <THead>신청자</THead>
            <TData>
              <table tw="w-full collapse">
                <TRow>
                  <THead>신청자</THead>
                  <TData colSpan={3}>
                    <div tw="border-neutral-6 bg-neutral-3 w-1/2">{user.name}</div>
                    <div tw="border-neutral-6 bg-neutral-3 w-1/2">{user.studentID}</div>
                  </TData>
                </TRow>
                <TRow>
                  <THead>소속명</THead>
                  <TData><div tw="border-neutral-6 bg-neutral-3 w-1/2">{user.major}</div></TData>
                  <THead>신청일</THead>
                  <TData>{new Date().toISOString().slice(0, 10)}</TData>
                </TRow>
                <TRow>
                  <THead>핸드폰</THead>
                  <TData>{user.phone}</TData>
                  <THead>이메일</THead>
                  <TData>{user.email}</TData>
                </TRow>
              </table>
            </TData>
          </TRow>
          <TRow>
            <THead>신청내역</THead>
            <TData>
              <table tw="w-full collapse">
                <TRow>
                  <THead>예약일자</THead>
                  <TData colSpan={3}>예약일자</TData>
                </TRow>
                <TRow>
                  <THead>시작시간</THead>
                  <TData>시작시간</TData>
                  <THead>종료시간</THead>
                  <TData>종료시간</TData>
                </TRow>
                <TRow>
                  <THead>신청건물</THead>
                  <TData>건물</TData>
                  <THead>신청장소</THead>
                  <TData>장소</TData>
                </TRow>
              </table>
            </TData>
          </TRow>
        </table>
      </form>
    </div>
  )
}


export default function ReserveForm({ reservInfo }) { //앞서 선택했던 예약 정보들 받아오기
  const { asPath } = useRouter()
  const [isOpen, setIsOpen] = useState(false);


  const onReserve = () => { //예약신청 버튼을 눌렀을 때
    const result = window.confirm("예약이 완료되었습니다. 예약내역을 확인하시겠습니까?");
    if(result) {
      window.location.href= '/mypage'
    } else {
      window.location.href = '/buildings'
    }
  }
  
  const onCancle = () => { //취소 버튼을 눌렀을 때
    const result = window.confirm("예약을 취소하시겠습니까?");
    if(result) {
      setIsOpen(false);
    }
  }
  
  const ButtonArea = ( // buttonArea.
    <div tw="w-full flex justify-center">
      <Button variant={"primary"} onClick={onReserve}>예약신청</Button>
      <Button variant={"trans"} onClick={onCancle}>닫기</Button>
    </div>
  )

  return (
    
      <main tw="h-full">
        <section tw="text-center my-28">
          <div tw="max-w-screen-sm mx-auto">
           <Form user={user} reservInfo={reservInfo}/>
           <ButtonArea/>
          </div>
        </section>
      </main>
   
  )
}

