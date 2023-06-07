import { useEffect, useState } from "react";
import tw from "twin.macro";
import { Button, DropMenu, Img } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";
import styled from "@emotion/styled";
import { useRouter } from "next/router"
import { headers } from "next/dist/client/components/headers";
import api from "../../utils/api"
import { Modal } from "../../primitives";

//이 컴포넌트는 나중에 마이페이지 페이지 제작할 때 들어갈 컴포넌트로 이 파일 삭제 후 마이페이지 페이지에 바로 컴포넌트 생성 후 활용할 예정
/* reserve = {예약번호 : INT,
              신청일 : DATE,
              시설분류 : Charset,
              예약날짜 : DATE,
              예약시간 : TIME,
              처리상태 : boolean} 이라고 가정*/
const ReservCard =(reserve) => {
  let approval = "";
  console.log(reserve.reserve.approval);
  if(reserve.reserve.approval === "W"){
    approval = "대기중"
  } else if(reserve.reserve.approval === "T") {
    approval = "승인"
  } else {
    approval = "거절"
  }

  const [isOpen, setIsOpen] = useState();

  return (
    <li tw="flex flex-col bg-neutral-1 rounded-lg border border-neutral-4 m-14">
      <p tw="text-lg font-bold">{reserve.reserve.event_name}</p>
      <div tw="w-full flex justify-between  bg-white flex-col items-start p-3">
        <p>날짜 : {reserve.reserve.date.slice(0,10)}</p>
        <p>강의실 : {reserve.reserve.room}</p>
        <p>예약시간 : {reserve.reserve.start_time} ~ {reserve.reserve.end_time}</p>
        <p>처리상태 : {approval}</p>
        {approval === "거절" && <p tw="text-neutral-4 underline" onClick={() => setIsOpen(!isOpen)}>거절 사유 보기</p>}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="거절사유" contentProps={{
          title: "거절 사유",
          description: `${reserve.refuse_reason}`,
        }} /> 
    </li>
  );
}

const Tab = ({handleTabChange, activeTab}) => {
  const router = useRouter();
  return (
    <div tw="w-full bg-white border-b border-neutral-3">
      <div tw="max-w-screen-lg h-full mx-auto justify-between flex items-center">
        <div tw="w-auto flex">
          <label tw="relative pl-8">
            예약내역
            <input 
              type="radio" 
              value="reservation"
              name="tab"
              tw="absolute opacity-0 h-0 w-0"
              checked={activeTab === 'reservation'}
              onChange={handleTabChange}
            />
            
          </label>


          <label tw="relative pl-8">
            <input 
            type="radio" 
            value="approval"
            name="tab"
            tw="absolute opacity-0 h-0 w-0"
            checked={activeTab === 'approval'}
            onChange={handleTabChange}
            /> 예약승인내역
          </label>
    
        {/* <button
            onClick={() => handleTabChange("reservation")}
            tw={`text-neutral-7 mr-5 ${activeTab === "reservation" && "active:(text-dguMain font-bold)"}`}
          >
            예약내역
          </button>
          <button
            onClick={() => handleTabChange("approval")}
            tw={`text-neutral-7 ${activeTab === "approval" && "active:(text-dguMain font-bold)"}`}
          >
            예약승인내역
          </button> */}
        </div>
        <button onClick={() => router.push("/buildings")} tw="ml-auto">
          <img src="/static/out_icon.png" alt="나가기" tw="w-7 h-7"/>
        </button>
      </div>
    </div>
  )
}


export default function MyPage({reservedList}) {
  const [activeTab, setActiveTab] = useState("reservation");
  const arrayList = reservedList;
  console.log(arrayList);
  const [showReserved, setShowReserved] = useState(arrayList);

  const approvalList = arrayList.filter((item) => item.approval === "T");

  const handleTabChange = (event) => {
    console.log("handle")
    setActiveTab(event.target.value);
    if (activeTab === "reservation") {
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
      console.log(response.data);
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