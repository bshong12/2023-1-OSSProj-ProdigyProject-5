import MarketingContainer from "../layouts/MarketingContainer"
import tw from "twin.macro"
import {useState, useEffect} from "react"
import {Button} from "../components"

//reservedLists: 예약되었지만 승인이나 거절 처리가 되지 않은 예약 리스트


const ReservCard = ({buttonArea, reserv, index}) => {
  return (
    <div tw="border border-neutral-4 bg-white rounded-lg w-[95%] flex justify-between p-3">
      <div tw="flex flex-col">
        <h2 tw="text-lg">예약명 </h2>
        <p tw="text-sm">강의실 : </p>
        <p tw="text-sm">예약 날짜 및 시간 : </p>
        <p tw="text-sm text-neutral-3 hover:(text-neutral-4)">자세히보기</p>
      </div>
      {buttonArea ? (
        <>{buttonArea}</>
      ):(
        <></>
      )}
    </div>
  )
}

const ButtonArea = ({handleApprovalClick, handleDenyClick, reserv}) => {

}
export default function Management() {
  const [wait, setWait] = useState([]);
  const [approval, setApproval] = useState([]);
  const [denied, setDenied] = useState([]);

  const handleApprovalClick = (reserv, index) => {
    if(window.confirm("해당 예약을 승인하시겠습니까?")) {
      setWait(wait.filter((_, i) => i !== index));
      setApproval((prev) => [...prev, reserv]);
    }
  };

  const handleDenyClick = (reserv, index) => {
    if(window.confirm("해당 예약을 거절하시겟습니까?")) {
      setWait(wait.filter((_, i) => i !== index));
      setDenied((prev) => [...prev, reserv]);
    }
  }

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
            <ReservCard />
          </div>
        </div>
        <div tw="w-1/2 flex flex-col mt-28 items-end">
          <h3 tw="text-left w-5/6 ">승인한 예약</h3>
          <div tw="border border-neutral-4 rounded-lg w-5/6 bg-neutral-1 h-[20rem] mb-14 max-h-[20rem] overflow-scroll flex flex-col items-center p-5"></div>
          <h3 tw="text-left w-5/6">거절한 예약</h3>
          <div tw="border border-neutral-4 rounded-lg w-5/6 bg-neutral-1 h-[20rem] max-h-[20rem] overflow-scroll flex flex-col items-center p-5"></div>
        </div>
      </main>
    </MarketingContainer>
  )
}