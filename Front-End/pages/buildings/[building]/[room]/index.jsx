import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../../components"
import { UserUIContainer } from "../../../../layouts/UserUIContainer"
import { allTimes,nameToSlug, slugToName } from "../../../../utils/buildings"
import { format } from "date-fns"
import { HiOutlineClock } from "react-icons/hi"
import { useSelector } from 'react-redux';


//reservedTimes = [{name: "예약명", startTime: "시작시간", endTime: "종료시간"}, {name: "예약명", startTime: "시작시간", endTime: "종료시간"}] 이라고 가정

// const fullTime = []; 예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

function TimeSplit(reservedTimes) {
  const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

  reservedTimes.forEach(reserve => {
    const [startTime, endTime] = reserve.time.split(" - ");
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");

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
  


export default function Room({ room, reservedTimes }) {
  const { asPath } = useRouter()
  const router = useRouter()
  const pageHeading = room[0]?.toLowerCase().includes("room") ? room[0] : `Room -  ${room[0]}`
  const [selectedTime, setSelectedTimes] = useState([]);
  

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
            <Button tw="w-52 mt-5 mb-5">
              <Link href={`${asPath}/reserve`} passHref>예약하기
              </Link>
            </Button>
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

export async function getServerSideProps(context) {
  const { buildingname, room } = context.query;
  const selectedDate = useSelector((state) => state.selectedDate);
  
  try {
    const response = await api.get(`/buildings/${selectedDate}/${buildingname}/${room}`);
    const reservedTimes = response.data;
    
    return { props: { buildingname, ...reservedTimes } };
  } catch (error) {
    // 오류 처리
    return { props: { buildingname: "" } };
  }
}


// export const getStaticPaths = async () => {
//   const paths = []
//   buildings.forEach((b) => {
//     b.rooms.forEach((room) => {
//       paths.push({ params: { building: nameToSlug(b.name), room: nameToSlug(room[0]) } })
//     })
//   })
//   return {
//     // get an array of all possible building links/slugs
//     paths,
//     fallback: false,
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   // get data from the requested building
//   const buildingData = await buildings.find((b) => nameToSlug(b.name) === params.building)

//   buildingData["room"] = buildingData.rooms.filter(
//     (room) => nameToSlug(room[0]) === params.room,
//   )[0]

//   return { props: { ...buildingData } }
// }