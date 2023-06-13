import React, { useEffect, useState, useRef, Fragment } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import {Button, Input} from "../../../../components"
import { set, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import api from "../../../../utils/api"


//id, room_id, date, reason, event_name, people, group_name, event_content, user_id, approval, start_time, end_time
//예약 폼 서버로 전송하는 함수
const apply = async (data, responseData, user) => {
  try {
    const requestData = {
      room_id: responseData.room,
      date: responseData.selectedDate,
      reason: data.reason,
      event_name: data.name,
      people: data.headcount,
      group_name: data.organization,
      event_content: data.outline,
      user_id: user.id,
      approval: "W",
      start_time: responseData.startTime,
      end_time: responseData.endTime,
    };
    const response = await api.post(`/buildings/${requestData.date}/${responseData.buildingname}/${requestData.room_id}/reservation`, requestData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const schema = yup.object().shape({ //에약 폼 스키마
  reason: yup.string().required("신청사유를 입력해주세요."),
  name: yup.string().required("예약명(행사명)을 입력해주세요"),
  headcount: yup.string().required("인원수를 입력해주세요. "),
  organization: yup.string().required("단체명 또는 주최자명을 입력해주세요"),
  outline: yup.string().required("행사개요를 입력해주세요. ")
});



export default function ReserveForm({responseData, user}) { //앞서 선택했던 예약 정보들 받아오기
  const router = useRouter();
  const startTime = responseData.selectedTime[0]; //시작시간은 선택한 시간 중 가장 앞시간

  const endTime = () => { //끝시간은 선택한 시간 중 가장 마지막 시간에서 30분 지난 시간
    const Time = responseData.selectedTime;
    const lastItem = Time[Time.length - 1];
    const [hour, minute] = lastItem.split(":")
    if(minute === "30") {
      return `${parseInt(hour) + 1}:00`
    } else {
      return `${hour}:30`
    }
  }
  responseData.startTime = startTime; // 추가
  responseData.endTime = endTime(); // 추가


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  })

  
  const onSubmit = (data) => { //예약 폼을 제출하면 하는 동작
    apply(data, responseData, user)
    .then(response => {
      if(response.status === 200) {
        const result = window.confirm("예약이 완료되었습니다. 예약내역을 확인하시겠습니까?");
        if(result) {
          router.push('../../../mypage'); //예약내역을 확인할 수 있는 마이페이지로 이동
        } else {
          router.push('../../../buildings'); //새로운 예약을 하기 위한 buildings페이지로 이동
        }
      }
      else {
        console.log(response.status);
      }
    })
    .catch(error => {
      console.error(error);
    })
  }

  return (
    <Fragment>
      <main tw="h-full">
        <section tw="text-center my-28">
          <div tw="max-w-screen-lg mx-auto">
          <div tw="w-full">
            <h3 tw="w-full text-left bg-neutral-2 h-10 flex items-center p-2">상세내역 입력</h3>
            <hr tw="w-full border-neutral-3"/>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div tw="flex w-full items-center mt-5 border-t border-b border-neutral-3 "> 
                <p tw="w-3/12 mr-3">신청사유</p>  
                <Input
                      type="text"
                      placeholder="신청사유"
                      {...register("reason")}
                      error={!!errors?.reason}
                      aria-label="reason"
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
                      aria-label="name"
                      {...register("name")}
                      error={!!errors?.name}
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
                      placeholder="신청인원"
                      aria-label="headcount"
                      autoComplete="off"
                      autoCapitalize="none"
                      {...register("headcount")}
                      error={!!errors?.headcount}
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
                      aria-label="organization"
                      {...register("organization")}
                      error={!!errors?.organization}
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
                      aria-label="outline"
                      {...register("outline")}
                      
                      autoComplete="off"
                      autoCapitalize="none"
                      maxLength="200"
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
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">전화번호</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">이메일</p>
                    </div> 
                    <div tw="flex w-full items-center border-t border-neutral-3 h-7">
                      <p tw="border-neutral-3 w-1/12 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{user.name}</p>
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{user.id}</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{user.phone}</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{user.email}</p>
                    </div>
                  </div>
                  <h3 tw="text-left mt-5">신청 정보 확인</h3>
                  <hr tw="w-full border-neutral-3"/>
                  <div tw="border border-neutral-4 mt-5"> 
                    <div tw="flex w-full items-center border-neutral-4 bg-neutral-1 h-7">
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">예약일자</p>
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">시작시간</p>
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 text-sm">종료시간</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm">신청건물</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 text-sm ">신청장소</p>
                    </div> 
                    <div tw="flex w-full items-center border-t border-neutral-3 h-7">
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{responseData.selectedDate}</p>
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{startTime}</p>
                      <p tw="border-neutral-3 w-1/6 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{endTime()}</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{responseData.buildingname}</p>
                      <p tw="border-neutral-3 w-1/3 text-neutral-5 overflow-hidden whitespace-nowrap overflow-ellipsis">{responseData.room}</p>
                    </div>
                  </div>
                  <div tw="w-full flex justify-center">
                    <Button variant={"primary"} type="submit" tw="m-7 w-36">예약신청</Button>
                    <Button variant={"trans"} type="button" onClick={() => { //예약 취소 버튼. 클릭하게 되면 다시 건물 페이지로 이동
                      const result = window.confirm("예약을 취소하시겠습니까?");
                      if(result) {
                        router.push('../../../buildings');
                      }
                    }} tw="m-7 w-36">취소</Button>
                  </div>
            </form>
          </div>
          </div>
        </section>
      </main>
    </Fragment>
  )
}

//해당 예약을 하는 유저 정보와 앞서 선택했던 예약 정보들을 받아옴
export async function getServerSideProps (context) {
  const responseData = JSON.parse(decodeURIComponent(context.query.responseData));
  try {
    const response = await api.get(`/buildings/${responseData.selectedDate}/${responseData.buildingname}/${responseData.room}/reservation`, {headers:{cookie: context.req.headers.cookie || ''}});
    if(response.status === 200) {
      const user = response.data;
      return { props: { responseData, user } };
    } else {

    }
    
  } catch (error) {
    console.error(error);
    return {props: {responseData: "", user: ""}};
  }
};