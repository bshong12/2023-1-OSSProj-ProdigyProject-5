import { useEffect, useState } from "react";
import tw from "twin.macro";
import { Button, DropMenu, Img } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";
import styled from "@emotion/styled";
import { useRouter } from "next/router"
import { headers } from "next/dist/client/components/headers";
import api from "../../utils/api"
import { Modal } from "../../primitives";

const ReservCard =(reserve) => { //예약 정보를 나타내는 컴포넌트
  let approval = "";
  //서버로부터 받은 예약 정보 중 예약이 대기 중인지 처리되었는 지를 사용자에게 나타내기 위해 변환
  if(reserve.reserve.approval === "W"){
    approval = "대기중"
  } else if(reserve.reserve.approval === "T") {
    approval = "승인"
  } else {
    approval = "거절"
  }

  const [isModalOpen, setIsModalOpen] = useState(false); //모달을 여냐 마냐


  return (
    <li tw="flex flex-col bg-neutral-1 rounded-lg border border-neutral-4 m-14">
      <p tw="text-lg font-bold">{reserve.reserve.event_name}</p>
      <div tw="w-full flex justify-between  bg-white flex-col items-start p-3">
        <p>날짜 : {reserve.reserve.date.slice(0,10)}</p>
        <p>강의실 : {reserve.reserve.room}</p>
        <p>예약시간 : {reserve.reserve.start_time} ~ {reserve.reserve.end_time}</p>
        <p>처리상태 : {approval}</p>
        {approval === "거절" && <p tw="text-neutral-4 underline" onClick={() => setIsModalOpen(true)}>거절 사유 보기</p>}
      </div>
      <Modal isOpen={(isModalOpen)} setIsOpen={setIsModalOpen} title="거절사유" contentProps={{
          title: "거절 사유",
          description: `${reserve.reserve.repuse_reason}`,
        }} /> 
    </li>
  );
}

//본인이 한 예약을 전부 확인할 것인지 승인된 내역만 확인할 것인지 선택하는 탭 컴포넌트 (라디오 버튼으로 표현)
const Tab = ({handleTabChange, activeTab}) => {
  const router = useRouter();
  return (
    <div tw="w-full bg-white border-b border-neutral-3">
      <div tw="max-w-screen-lg h-full mx-auto justify-between flex items-center">
        <div tw="w-auto flex">
          <label tw="relative pl-8 active:(text-dguMain font-bold)" >
            예약내역
            <input 
              type="radio" 
              value="reservation"
              name="tab"
              id="reservation"
              tw="absolute opacity-0 h-0 w-0 checked:(text-dguMain font-bold)"
              checked={activeTab === 'reservation'}
              onChange={handleTabChange}
            />
          </label>
          <label tw="relative pl-8 active:(text-dguMain font-bold)">
            <input 
            type="radio" 
            value="approval"
            name="tab"
            tw="absolute opacity-0 h-0 w-0"
            checked={activeTab === 'approval'}
            onChange={handleTabChange}
            /> 예약승인내역
          </label>
        </div>
        <button onClick={() => router.push("/buildings")} tw="ml-auto">
          <img src="/static/out_icon.png" alt="나가기" tw="w-7 h-7"/>
        </button>
      </div>
    </div>
  )
}


export default function MyPage({reservedList}) {
  const [activeTab, setActiveTab] = useState("reservation"); //기본적으로 모든 예약을 보여줌
  const arrayList = reservedList;
  const [showReserved, setShowReserved] = useState(arrayList); //보여줄 예약 내역이 저장될 배열

  const approvalList = arrayList.filter((item) => item.approval === "T");

  //모든 예약을 볼 것인지 승인된 예약만 볼 것인지 선택할 때 처리되는 함수
  const handleTabChange = (event) => {
    console.log("handle")
    setActiveTab(event.target.value);
    if (activeTab === "approval") {
      setShowReserved(arrayList);
    } else {
      setShowReserved(approvalList);
    }
  }

  return(
    <UserUIContainer title="mypage" headerBorder footer logoName="마이페이지">
      <main tw="h-full">
        
        <section tw="max-w-screen-lg mx-auto text-center my-28">
        <Tab activeTab={activeTab} handleTabChange={handleTabChange}/>
        <ul tw="w-full mb-7">
          {showReserved.map((reserve, index) => (
            <ReservCard reserve={reserve} key={index}/>
          ))}
        </ul>
        </section>
      </main>
    </UserUIContainer>
  )
}

export async function getServerSideProps(context) {
  try {
    const response = await api.get("/mypage",{
      headers:{
        cookie: context.req.headers.cookie || '',
      }
    });
    if(response.status === 200){
      const reservedList = response.data;
      return { props: { reservedList } };
    } else {
      return {
        redirect: {
          destination: "/404", // 리다이렉션할 페이지 경로
          permanent: false, // 일시적인 리다이렉션인 경우 false로 설정
        },
      };
      
    }

  } catch (error) {
    console.error("Failed to fetch buildings data:", error);
    return { props: { reservedList: [] } };
  }
};