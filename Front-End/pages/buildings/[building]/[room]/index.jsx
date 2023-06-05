import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from 'react-redux';
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../../components"
import { UserUIContainer } from "../../../../layouts/UserUIContainer"
import { allTimes,nameToSlug, slugToName } from "../../../../utils/buildings"
import api from "../../../../utils/api";

function TimeSplit(reservedTimes) {
  const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열
  console.log(reservedTimes);
  
  reservedTimes.forEach(reserv => {
    const [startHour, startMinute] = reserv.startTime.split(":");
    const [endHour, endMinute] = reserv.endTime.split(":");

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

function ReservedLi({reserved}) {
  
  return (
    <li tw="border border-neutral-3 rounded-lg m-5 w-5/6">
      <p tw="text-left p-3 font-bold">{reserved.name}</p>
      <p tw="text-left p-3 text-neutral-4">{reserved.startTime} ~ {reserved.endTime}</p>
    </li>
  )

}


export default function Room({ date, building, room, reservedTimes }) {

  const { asPath } = useRouter()
  const router = useRouter()
  const pageHeading = room?.toLowerCase().includes("room") ? room : `Room -  ${room}`
  const [selectedTime, setSelectedTimes] = useState([]);
  const [reservedArray, setReservedArray] = useState([]);

  useEffect(() => {
    setReservedArray(TimeSplit(reservedTimes));
  }, []);
  
  const sortedReservedTimes = reservedTimes.sort((a, b) => {
    const startTimeA = new Date(`2000-01-01 ${a.startTime}`);
    const startTimeB = new Date(`2000-01-01 ${b.startTime}`);
    return startTimeA - startTimeB;
  });

  const transData = {
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
              router.push({
              pathname: `${asPath}/reserve`,
              query: { responseData: encodeURIComponent(JSON.stringify(transData)) },
            })}}>예약하기</Button>
          </div>
          <div tw="max-w-screen-lg mx-auto my-8 px-3 flex flex-wrap justify-evenly">
            <div tw="w-full mb-12 lg:(w-1/2 border-r mb-0)">
              <TimeTable 
                reservedTimes={reservedArray} 
                allTimes={allTimes} 
                selectedTimes={selectedTime}
                setSelectedTimes={setSelectedTimes}/>
            </div>
            <table tw="border border-neutral-4 rounded-lg table-auto w-1/3 border-collapse text-left">
              <thead>
                <tr tw="border-b border-neutral-3 rounded-lg text-center">
                  <th colSpan={2} tw="h-10 rounded-lg">현재 예약/수업 내역</th>
                </tr>
              </thead>
              <tbody >
                <ul>
                {reservedTimes
                .sort((a, b) => {
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
