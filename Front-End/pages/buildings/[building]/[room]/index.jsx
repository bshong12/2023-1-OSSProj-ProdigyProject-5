import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from 'react-redux';
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../../components"
import { UserUIContainer } from "../../../../layouts/UserUIContainer"
import { allTimes,nameToSlug, slugToName } from "../../../../utils/buildings"
import api from "../../../../utils/api";



//reservedTimes = [{name: "예약명", startTime: "시작시간", endTime: "종료시간"}, {name: "예약명", startTime: "시작시간", endTime: "종료시간"}] 이라고 가정

// const fullTime = []; 예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

const transReservedTimes = async (transData)  => {
  const res = await api.post(`/buildings/${transData.selectedDate}/${transData.buildingname}/${transData.room}`, transData, {
  });
};


function TimeSplit(reservedTimes) {
  const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

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

//예약되어 있는 시간 표시하는 테이블
function ReservedTable() {
  const fullTime = TimeSplit(reservedTimes);

  const slotRefs = useRef([]);

  const handleReserved = (slotRef) => {
    if (slotRef.current) {
      slotRef.current.textContent = "Reserved";
      slotRef.current.style.backgroundColor = "#d3d3d3";
      slotRef.current.style.color = "white";
    }
  };

  useEffect(() => {
    slotRefs.current.forEach((slotRef,index) => {
      const isReserved = fullTime.includes(allTimes[index]);

      if(isReserved) {
        handleReserved(slotRef);
      }
    });
  }, [fullTime]);


  return (
    <table tw="border-collapse border border-neutral-5 w-full lg:(w-1/2)">
      <thead>
        <tr tw="border-b border-neutral-4 text-center">
          <th colSpan={2} tw="h-10">현재 예약 내역</th>
        </tr>
      </thead>
      <tbody>
        {allTimes.map((time, index) => {
          const isReserved = fullTime.includes(time);
          const slotId = `time-slot-${index}`;
          if (!slotRefs.current[index]) {
            slotRefs.current[index] = React.createRef();
          }

          // 시간 슬롯의 내용과 배경색을 변경
          if (isReserved) {
            handleReserved(slotRefs.current[index]);
          }

          return (
            <tr key={index} tw="h-5">
              <td tw="border border-neutral-4 border-l-neutral-5 text-neutral-4 p-3 w-1/4">{time}</td>
              <td ref={slotRefs.current[index]} id={slotId}></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
  


export default function Room({ buildingname,room, reservedTimes }) {
  const { asPath } = useRouter()
  const router = useRouter()
  const pageHeading = room[0]?.toLowerCase().includes("room") ? room[0] : `Room -  ${room[0]}`
  const [selectedTime, setSelectedTimes] = useState([]);
  const [userToken, setUserToken] = useState("");

  const selectedDate = useSelector((state) => state.selectedDate);


  const transData = {
    buildingname: slugToName(buildingname),
    room: slugToName(room),
    selectedTime: selectedTime,
    userToken: userToken,
    selectedDate: selectedDate,
  }

  
  const handleClick = (data) => {
    transReservedTimes(data)
      .then((res) => {
        router.push({
          pathname: `${asPath}/reserve`,
          query: { responseData: JSON.stringify(res) },
        });
      });
  };
  
  return (
    <UserUIContainer title={pageHeading} headerBorder footer>
      <main tw="h-full">
        <section tw="text-center my-28">
          <div tw="max-w-screen-sm mx-auto">
            <BreadCrumb routesArr={asPath.split("/").filter(String)} />
            <h1
              tw="text-2xl font-semibold md:text-3xl lg:text-4xl
              mt-20 pb-5 capitalize"
            >
              {pageHeading}
            </h1>
            <Button tw="w-52 mt-5 mb-5" onClick={()=>handleClick(transData)}>예약하기</Button>
          </div>
          <div tw="max-w-screen-lg mx-auto my-8 px-3 flex flex-wrap justify-evenly">
            <div tw="w-full mb-12 lg:(w-1/2 border-r mb-0)">
              <TimeTable 
                reservedTimes={TimeSplit(reservedTimes)} 
                allTimes={allTimes} 
                selectedTimes={selectedTime}
                setSelectedTimes={setSelectedTimes}/>
            </div>
            <hr />
            <ReservedTable />
          </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

Room.theme = "light"


export async function getServerSideProps (context) {
  console.log(context.query);
  const {date, building, room} = context.query;

  try {
    const response = await api.get(`/buildings/${date}/${nameToSlug(building)}/${nameToSlug(room)}`);
    const reservedTimes = response.data;
    console.log(reservedTimes);
    
    return { props: { building, room, reservedTimes } };
  } catch (error) {
    // 오류 처리
    return { props: { buildingname: "" } };
  }
};
