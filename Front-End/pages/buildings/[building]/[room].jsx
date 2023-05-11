import React, { useEffect, useState, useRef } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { Img, BreadCrumb, StyledLink, Button, TimeTable } from "../../../components"
import { UserUIContainer } from "../../../layouts/UserUIContainer"
import { buildings, nameToSlug, slugToName } from "../../../utils/buildings"
import { format } from "date-fns"
import { HiOutlineClock } from "react-icons/hi"
import { Modal } from "../../../primitives"

const reservTable = [
  {
    name: "Lonnie Bowe",
    img: "/static/bowe.jpg",
    time: "8:00 - 8:30",
    title: "Assistant Professor of Computer Science",
  },
  {
    name: "Joseph Allen",
    img: "/static/allen.jpg",
    time: "9:00 - 10:30",
    title: "Distinguished Professor of Geology/Chair",
  },
  {
    name: "Lisa Darlington",
    img: "/static/lisa.jpg",
    time: "12:00 - 12:30",
    title: "Professor-Mathematics/Department Chair",
  },
  {
    name: "Mark Dietrich",
    img: "/static/dietrich.jpg",
    time: "13:00 - 13:30",
    title: "Assistant Professor of Computer Science",
  },
  {
    name: "Angela Addair",
    img: "/static/addair.jpg",
    time: "15:00 - 16:00",
    title: "Assistant Professor of Management",
  },
]

const allTimes = ["6:00", "6:30", "7:00", "7:30", "8:00", "8:30","9:00","9:30",
"10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
"16:00","16:30","17:00","17:30","18:00","18:30"];
const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

function TimeSplit(reserveTable) {
  const fullTime = []; //예약되어있는 시간을 30분 단위로 쪼개서 저장하는 배열

  reserveTable.forEach(reserve => {
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
  const fullTime = TimeSplit(reservTable);

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


export default function Room({ room, name }) {
  const { asPath } = useRouter()
  const pageHeading = room[0]?.toLowerCase().includes("room") ? room[0] : `Room -  ${room[0]}`
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTimes] = useState([]);

  const handleButtonClick = () => { //시간을 선택하고 예약하기 버튼을 눌렀을 때 모달창이 열리도록
    setIsOpen(true);
  }

  const onReserve = () => { // 예약 모달창에서 예약신청 버튼을 눌렀을 때
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
  
  const buttonArea = ( // 모달 창에 들어갈 buttonArea.
    <div tw="w-full flex justify-center">
      <Button variant={"primary"} onClick={onReserve}>예약신청</Button>
      <Button variant={"trans"} onClick={onCancle}>닫기</Button>
    </div>
  )

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
            <Button tw="w-52 mt-5 mb-5" onClick={handleButtonClick}>예약하기</Button>
            <Modal 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              titleProps={"대관사용신청"} 
              buttonArea={buttonArea}>
              <Form user={user} />
            </Modal>
          </div>
          <div tw="max-w-screen-lg mx-auto my-8 px-3 flex flex-wrap justify-evenly">
            <div tw="w-full mb-12 lg:(w-1/2 border-r mb-0)">
              <TimeTable 
                reservedTimes={TimeSplit(reservTable)} 
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

export const getStaticPaths = async () => {
  const paths = []
  buildings.forEach((b) => {
    b.rooms.forEach((room) => {
      paths.push({ params: { building: nameToSlug(b.name), room: nameToSlug(room[0]) } })
    })
  })
  return {
    // get an array of all possible building links/slugs
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  // get data from the requested building
  const buildingData = await buildings.find((b) => nameToSlug(b.name) === params.building)

  buildingData["room"] = buildingData.rooms.filter(
    (room) => nameToSlug(room[0]) === params.room,
  )[0]

  return { props: { ...buildingData } }
}
