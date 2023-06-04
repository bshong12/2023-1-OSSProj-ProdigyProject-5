import MarketingContainer from "../layouts/MarketingContainer"
import tw from "twin.macro"
import {useState, useEffect} from "react"
import {Button} from "../components"
import api from "../utils/api"
import { Modal } from "../primitives"

//reservedLists: 예약되었지만 승인이나 거절 처리가 되지 않은 예약 리스트

const postApproval = async (approve,id) => {
  
  try {
    const requestData = {
      approval: approve,
      id: id
    };
    console.log(requestData);
    const response = await api.post("/admin", requestData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const ReservCard = ({buttonArea, reserv}) => {
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const ModalContent = ({reserv}) => {
  console.log("modal")
  return (
    <div>
      <h3 tw="text-left mt-5">예약 정보</h3>
       <hr tw="w-full border-neutral-3"/>
        <div tw="border border-neutral-4 mt-5"> 
          <div tw="flex w-full items-center border-neutral-4 bg-neutral-1 rounded-lg h-7">
          <p tw="w-3/12 mr-3">예약명</p>
          <p tw="w-9/12 border border-neutral-4 rounded-lg">{reserv.event_name}</p>    
          </div> 
        </div>      
     </div>
  )
}

  console.log(reserv.event_name);
  return (
    <div tw="border border-neutral-4 bg-white rounded-lg w-[95%] flex justify-between p-3">
      <div tw="flex flex-col">
        <h2 tw="text-lg">{reserv.event_name} </h2>
        <p tw="text-sm">강의실 : {reserv.room}</p>
        <p tw="text-sm">예약 날짜 및 시간 : {reserv.date.slice(0,10)} / {reserv.start_time}~{reserv.end_time}</p>
        <p tw="text-sm text-neutral-3 hover:(text-neutral-4)" onClick={handleModalOpen}>자세히보기</p>
      </div>
      {buttonArea ? (
        <>{buttonArea}</>
      ):(
        <></>
      )}
      <Modal isOpen={showModal} setIsOpen={setShowModal} title={reserv.event_name} contentProps={{
          title: `${reserv.event_name}`,
          description: `예약자 : ${reserv.user_id}`,
          content: `단체 : ${reserv.group_name}     참여인원 : ${reserv.people}    개요 : ${reserv.event_content}`,
        }} /> {/* 모달 컴포넌트 추가 */}
    </div>
  )
}

const ButtonArea = ({handleApprovalClick, handleDenyClick, reserv, index}) => {
  return (
    <div tw="flex w-[25%] flex-col ml-14">
      <Button 
      variant="trans"
      type="button"
      onClick={() => handleApprovalClick(reserv, index)}
      tw="flex items-center justify-center w-14 mb-5"
      isSmall>
        승인
      </Button>
      <Button 
      variant="trans"
      type="button"
      onClick={() => handleDenyClick(reserv, index)}
      tw="flex items-center justify-center w-14 "
      isSmall>
        거절
      </Button>
    </div>
  )
}
export default function Management(reservedList) {


  const arrayList = Object.values(reservedList);
  const [wait, setWait] = useState(arrayList);
  console.log(wait);
  const [approval, setApproval] = useState([]);
  const [denied, setDenied] = useState([]);

  const handleApprovalClick = (reserv, index) => {
    if(window.confirm("해당 예약을 승인하시겠습니까?")) {
      reserv.approval = "T";
      postApproval(reserv.approval, reserv.id)
      .then(response => {
        if (response.status === 200) {
          setWait(wait.filter((_, i) => i !== index));
          setApproval(prev => [...prev, reserv]);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }
  };

  const handleDenyClick = (reserv, index) => {
    if(window.confirm("해당 예약을 거절하시겟습니까?")) {
      reserv.approval = "F";
      postApproval(reserv.approval, reserv.id)
      .then(response => {
        if(response.status === 200) {
          setWait(wait.filter((_, i) => i !== index));
          setDenied((prev) => [...prev, reserv]);
        }
      })
      .catch(error => {
        console.error(error)
      });
}
};

  return (
    <MarketingContainer title="management" footer noHeaderNav>
      <main
              tw="min-h-screen max-w-screen-lg w-full
                mx-auto px-4 pb-28 md:(px-8) flex
                flex-row items-start justify-start mt-10"
      >
        <div tw="w-1/2 flex flex-col mt-28">
          <h3>새로운 예약 내역</h3>
          <div tw="border border-neutral-4 rounded-lg w-[95%] bg-neutral-1 h-[45rem] overflow-scroll flex flex-col items-center p-5">
          {wait.map((reserv, index) => {
            return (
              <ReservCard buttonArea={<ButtonArea handleApprovalClick={handleApprovalClick} handleDenyClick={handleDenyClick} reserv={reserv} index={index} />} reserv={reserv} key={index} />
            );
          })}
            
          </div>
        </div>
        <div tw="w-1/2 flex flex-col mt-28 items-end">
          <h3 tw="text-left w-5/6 ">승인한 예약</h3>
          <div tw="border border-neutral-4 rounded-lg w-5/6 bg-neutral-1 h-[20rem] mb-14 max-h-[20rem] overflow-scroll flex flex-col items-center p-5">
            {approval.map((reserv, index) => {
               return <ReservCard reserv={reserv} key={index}/>
            })}
          </div>
          <h3 tw="text-left w-5/6">거절한 예약</h3>
          <div tw="border border-neutral-4 rounded-lg w-5/6 bg-neutral-1 h-[20rem] max-h-[20rem] overflow-scroll flex flex-col items-center p-5">
            {denied.map((reserv, index) => {
                return <ReservCard reserv={reserv} key={index}/>
              })}
          </div>
        </div>
      </main>
    </MarketingContainer>
  )
}

export async function getServerSideProps(context) {
  try {
    const response = await api.get("/admin",{
      headers:{
        cookie: context.req.headers.cookie || '',
      }
    });
    console.log(response.data);
    const reservedList = response.data;
    return { props: { reservedList } };
    } 
  catch (error) {
    console.error("Failed to fetch buildings data:", error);
    return { props: { reservedList: [] } };
  }
};