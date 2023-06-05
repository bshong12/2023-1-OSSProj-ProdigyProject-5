import { UserUIContainer } from "../layouts/UserUIContainer"
import tw from "twin.macro"
import {useState, useEffect} from "react"
import {Button} from "../components"
import api from "../utils/api"
import { Modal } from "../primitives"

//reservedLists: 예약되었지만 승인이나 거절 처리가 되지 않은 예약 리스트

const postApproval = async (approve,id,repuse_reason) => { //승인되거나 거절 된 예약을 서버로 보낸다(처리한 예약 보내기)
  
  try {
    const requestData = {
      approval: approve,
      id: id,
      repuse_reason: repuse_reason
    };
    console.log(requestData);
    const response = await api.post("/admin", requestData); //엔드포인트는 /admin
    return response;
  } catch (error) {
    console.error(error);
  }
};

const ReservCard = ({buttonArea, reserv}) => { //각 예약의 정보를 보여주는 함수
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  
  const handleModalOpen = () => { //모달을 보여주는 함수(클릭했을 때 모달을 열고 싶은 요소에 추가)
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return ( //예약 정보 표시. 자세히 보기를 누르면 모달창 뜸
    <div tw="border border-neutral-4 bg-white rounded-lg w-[95%] flex justify-between p-3">
      <div tw="flex flex-col">
        <h2 tw="text-lg">{reserv.event_name} </h2>
        <p tw="text-sm">강의실 : {reserv.room}</p>
        <p tw="text-sm">예약 날짜 및 시간 : {reserv.date.slice(0,10)} / {reserv.start_time}~{reserv.end_time}</p>
        <p tw="text-sm text-neutral-3 hover:(text-neutral-4)" onClick={handleModalOpen}>자세히보기</p>
      </div>
      {buttonArea ? ( //버튼 속성이 주어지면 버튼 첨부
        <>{buttonArea}</>
      ):(
        <></>
      )}
      <Modal isOpen={showModal} setIsOpen={setShowModal} title={reserv.event_name} contentProps={{
          title: `${reserv.event_name}`,
          description: `예약자 : ${reserv.user_id}`,
          content: `단체 : ${reserv.group_name}     참여인원 : ${reserv.people}    개요 : ${reserv.event_content}`,
        }} /> 
    </div>
  )
}

const ButtonArea = ({ handleApprovalClick, handleDenyClick, reserv, index }) => {
  const [reason, setReason] = useState(""); //거절 이유 저장
  const [showPopover, setShowPopover] = useState(false); //팝오버를 보여줄 지 말 지

  const handleDenyButtonClick = () => { //거절 버튼을 누르면 팝오버 보임
    setShowPopover(true);
  };

  const handleDenySubmit = () => { //팝오버 제출하면 handleDenyClick(Defualt 컴포넌트 안에 선언되어 있는) 동작
    if(reason === "") {
      window.alert("거절사유를 작성해주세요");
    } else {
      handleDenyClick(reserv, index, reason);
      setShowPopover(false);
    }
    
  };

  return (
    <div tw="flex w-[25%] flex-col ml-14">
      <Button
        variant="trans"
        type="button"
        onClick={() => handleApprovalClick(reserv, index)}
        tw="flex items-center justify-center w-14 mb-5"
        isSmall
      >
        승인
      </Button>
      <Button
        variant="trans"
        type="button"
        onClick={handleDenyButtonClick}
        tw="flex items-center justify-center w-14"
        isSmall
      >
        거절
      </Button>
      {showPopover && (
        <div tw="max-w-sm w-[70%] h-[40%] px-4 mt-3 transform overflow-hidden rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 flex flex-col fixed top-[40%] left-[40%] p-3">
          <p tw="m-5">거절 사유</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="거절 사유를 입력하세요"
            tw="rounded-lg border border-neutral-5 h-60 mb-6"
          />
          <Button variant="primary" onClick={handleDenySubmit}>
            확인
          </Button>
        </div>
      )}
    </div>
  );
};

export default function Management({reservedList}) {

  const arrayList = reservedList; //예약 리스트
  const [wait, setWait] = useState(arrayList); //승인 대기 중인 예약 리스트(초기값은 서버가 보내 준 파라미터로 받은 리스트)
  const [approval, setApproval] = useState([]); //승인된 예약이 들어가는 리스트
  const [denied, setDenied] = useState([]); //거절된 예약이 들어가는 리스트

  const handleApprovalClick = (reserv, index) => { //승인 버튼을 눌렀을 때(매개변수로 받는 reserv는 각 예약의 정보. index는 그 예약의 index)
    if(window.confirm("해당 예약을 승인하시겠습니까?")) { //confirm창을 띄워서 한 번 더 확인한 뒤 확인 버튼을 누르고 서버로부터 200 응답을 받으면 예약 승인
      reserv.approval = "T"; //DB에 저장하는 형식 W:대기, T:승인, F:거절
      const reason = "";
      postApproval(reserv.approval, reserv.id, reason)
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

  const handleDenyClick = (reserv, index, reason) => { //거절 버튼을 눌렀을 때(매개변수로 받는 reserv는 각 예약의 정보. index는 그 예약의 index)
      if(window.confirm("해당 예약을 거절하시겟습니까?")) { //confirm창을 띄워서 한번 더 확인한 뒤 확인 버튼을 누르고 서버로부터 200 응답을 받으면 예약 거절
        reserv.approval = "F";
        postApproval(reserv.approval, reserv.id, reason)
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
    <UserUIContainer title="Management" headerBorder footer logoName="관리자 페이지">
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
              <ReservCard buttonArea={<ButtonArea handleApprovalClick={handleApprovalClick} handleDenyClick={handleDenyClick} reserv={reserv} index={index}
              />} 
              reserv={reserv} key={index} />
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
    </UserUIContainer>
  )
}

//처리하지 않은 예약 리스트를 서버로부터 받는 함수..
export async function getServerSideProps(context) {
  try {
    const response = await api.get("/admin",{
      headers:{
        cookie: context.req.headers.cookie || '', //쿠키에 저장된 사용자 토큰을 포함
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