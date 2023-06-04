import { useEffect, useState } from "react";
import tw from "twin.macro";
import { Button, DropMenu, Img } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";
import styled from "@emotion/styled";
import { useRouter } from "next/router"
import { headers } from "next/dist/client/components/headers";
import api from "../../utils/api"

//이 컴포넌트는 나중에 마이페이지 페이지 제작할 때 들어갈 컴포넌트로 이 파일 삭제 후 마이페이지 페이지에 바로 컴포넌트 생성 후 활용할 예정
/* reserve = {예약번호 : INT,
              신청일 : DATE,
              시설분류 : Charset,
              예약날짜 : DATE,
              예약시간 : TIME,
              처리상태 : boolean} 이라고 가정*/
const ReservCard =(reserve) => {
  
  return (
    <li tw="flex flex-col bg-neutral-1">
      <p>{reserve.inDate}</p>
      <div tw="w-full flex justify-between rounded-lg bg-white">
        <table tw="text-left">
          <tr>
            <td>예약명 : {reserve.name}</td>
            <td>강의실 : {reserve.room}</td>
          </tr>
          <tr>
            <td>예약날짜 : {reserve.resDate}</td>
            <td>예약시간 : {reserve.resTime}</td>
          </tr>
          <tr>
            <td rowSpan={2}>처리상태 : {reserve.resAllow}</td>
          </tr>
        </table>
        <span tw="flex flex-col justify-center">
        </span>
      </div>
    </li>
  );
}

const Tab = ({handleTabChange, activeTab}) => {
  const router = useRouter();
  return (
    <div tw="w-full bg-white border-b border-neutral-3">
      <div tw="max-w-screen-lg h-full mx-auto justify-between flex items-center">
        <div tw="w-auto flex">
          <input tw="appearance-none bg-transparent border-0 outline-none w-4 h-4 rounded-full border-solid border-2 border-gray-500">
            예약내역
          </input>
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


export default function MyPage(reservedList) {
  const [activeTab, setActiveTab] = useState("reservation");
  const [showReserved, setShowReserved] = useState(reservedList);

  const approvalList = reservedList.filter((item) => item.approval === "T");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "reservation") {
      setShowReserved(reservedList);
    } else {
      setShowReserved(approvalList);
    }
  }

  useEffect(() => {
    handleTabChange
  }, [activeTab]);

  return(
    <UserUIContainer title="mypage" headerBorder footer logoName="마이페이지">
      <main tw="h-full">
        
        <section tw="max-w-screen-lg mx-auto text-center my-28">
        <Tab activeTab={activeTab} handleTabChange={handleTabChange}/>
        <ul tw="w-full mb-7">
          {showReserved.map((reserv, index) => {
            <ReservCard reserve={reserv} key={index}/>
          })}
        </ul>
        </section>
      </main>
    </UserUIContainer>
  )
}

export async function getServerSideProps(context) {
  try {
    const response = await api.get("/mypage");
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