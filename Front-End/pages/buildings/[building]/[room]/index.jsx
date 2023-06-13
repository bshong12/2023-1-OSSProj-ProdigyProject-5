import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from 'react-redux';
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../../components"
import { UserUIContainer } from "../../../../layouts/UserUIContainer"
import { allTimes,nameToSlug, slugToName } from "../../../../utils/buildings"
import api from "../../../../utils/api";

function TimeSplit(reservedTimes) { //예약 시작시간 예약 끝 시간이 저장되어있는 예약 시간을 받아 예약이 되어있는 시간을 30분 단위로 쪼개서 저장하는 함수
  const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열
  
  reservedTimes.forEach(reserv => {
    //시간과 분으로 쪼갬
    const [startHour, startMinute] = reserv.startTime.split(":");
    const [endHour, endMinute] = reserv.endTime.split(":");

    //시작시간과 끝시간의 시간, 분을 고려하여 저장
    if(startHour === endHour){ 
      fullTime.push(`${startHour}:${startMinute}`);
    }
    else {
      for(var i=startHour; i<=endHour; i++){
        if(i == startHour && startMinute === "30"){
          fullTime.push(`${i}:30`);
        }else if(i == endHour && endMinute === "30"){
          fullTime.push(`${i}:00`);
        }else if(i == endHour && endMinute === "00"){
        }
        else {
          fullTime.push(`${i}:00`);
          fullTime.push(`${i}:30`);
        }
      }
    }
  });

  return fullTime;
}

function ReservedLi({reserved}) { //이미 에약되어 있는 리스트 나타냄
  
  return (
    <li tw="border border-neutral-3 rounded-lg m-5 w-5/6">
      <p tw="text-left p-3 font-bold">{reserved.name}</p>
      <p tw="text-left p-3 text-neutral-4">{reserved.startTime} ~ {reserved.endTime}</p>
    </li>
  )

}

//강의실 예약을 위한 시간 선택 페이지
export default function Room({ date, building, room, reservedTimes }) {

  const { asPath } = useRouter()
  const router = useRouter()
  const pageHeading = room?.toLowerCase().includes("room") ? room : `Room -  ${room}`
  const [selectedTime, setSelectedTimes] = useState([]); //사용자가 선택한 시간 저장 배열
  const [reservedArray, setReservedArray] = useState([]); //받은 예약 리스트에서 시간만 빼서 30분 단위로 쪼개서 저장한 배열

  useEffect(() => {
    setReservedArray(TimeSplit(reservedTimes));
  }, []);

  const transData = { //다음 페이지에 보내주기 위한 데이터
    buildingname: building,
    room: room,
    selectedTime: selectedTime,
    selectedDate: date,
  }

  
  
  return (
    <UserUIContainer title={pageHeading} headerBorder footer>
      <main tw="h-full">
        <section tw="text-center my-28">
          <div tw="max-w-screen-sm mx-auto">
            <BreadCrumb routesArr={decodeURIComponent(asPath).split("/").filter(String)} />
            <h1
              tw="text-2xl font-semibold md:text-3xl lg:text-4xl
              mt-20 pb-5 capitalize"
            >
              {pageHeading}
            </h1>
            <Button tw="w-52 mt-5 mb-5" onClick={()=> {
              if(selectedTime.length === 0) {
                alert("시간을 선택해주세요");
              } else{
              router.push({
              pathname: `${asPath}/reserve`,
              query: { responseData: encodeURIComponent(JSON.stringify(transData)) },
            })}
            }}>예약하기</Button>
          </div>
          <div tw="max-w-screen-lg mx-auto my-8 px-3 flex flex-wrap justify-evenly">
            <div tw="w-full mb-12 lg:(w-1/2 border-r mb-0)">
              <TimeTable 
                reservedTimes={reservedArray} 
                allTimes={allTimes} 
                selectedTimes={selectedTime}
                setSelectedTimes={setSelectedTimes}/>
            </div>
            <table tw="border border-neutral-4 rounded-lg table-auto w-full lg:(w-1/3) border-collapse text-left">
              <thead>
                <tr tw="border-b border-neutral-3 rounded-lg text-center">
                  <th colSpan={2} tw="h-10 rounded-lg">현재 예약/수업 내역</th>
                </tr>
              </thead>
              <tbody tw="h-[45rem] overflow-scroll w-full mb-12 lg:(w-1/2 border-r mb-0)">
                <ul>
                {reservedTimes
                .sort((a, b) => { //예약 리스트를 시간 순으로 정렬하여 보여줌
                  const startTimeA = new Date(`2000-01-01 ${a.startTime}`);
                  const startTimeB = new Date(`2000-01-01 ${b.startTime}`);
                  return startTimeA - startTimeB;
                })
                .map((reserved, index) => (
                    <ReservedLi key={index} reserved={reserved} />

                  ) )}
                </ul>
              </tbody>
             </table>
            {/* <hr />
            <ReservedTable /> */}
          </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

Room.theme = "light"

//해당 날짜에 예약되어 있는 리스트 반환
export async function getServerSideProps (context) {
 
  const {date, building, room} = context.query;

  try {
    const response = await api.get(`/buildings/${date}/${building}/${room}`);
    const reservedTimes = response.data;
    return { props: { date, building, room, reservedTimes } };
  } catch (error) {
    // 오류 처리
    return { props: { buildingname: "" } };
  }
};
