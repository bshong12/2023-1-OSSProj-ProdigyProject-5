import { useEffect, useState } from "react";
import tw from "twin.macro";
import { useRouter } from "next/router"
import { Button, DropMenu, Img } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div tw="w-full mx-auto mt-28 flex items-center justify-end">
      <div tw="flex items-center justify-end">
        <ReactDatePicker
          tw="rounded-lg border-gray-500 w-32 h-auto mr-2"
          selected={selectedDate}
          minDate={new Date('2023-01-01')}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
        />
        <img src="/static/cal_icon.png" tw="w-7 h-auto mr-10"/>
      </div>
    </div>
  );
  
  
};

export default function Map() {
  const router = useRouter()

  return(
    <UserUIContainer title="campusmap" headerBorder footer>
      <main tw="h-full">
        
        <section tw="max-w-screen-lg mx-auto text-center my-28">
          <Datepicker/>
          <h1 className="h2-headline" tw="mt-20 pb-5">
            Campus Map
          </h1>
          <div tw="w-full flex justify-end">
            <Button 
              variant="trans"
              type="button"
              onClick={() => router.push("/buildings")}
              tw="flex items-center justify-center mr-10 w-32"
              isSmall
              > 건물 보기</Button>
          </div>
          <div tw="w-full flex ">
            <div tw="w-9/12">
              <img src="/static/campus_map.png" alt="캠퍼스 지도"/>
            </div>
            <div tw="w-1/6 flex mt-20">
              <DropMenu buttonText={"건물 리스트"}>



              </DropMenu>
            </div>
          </div>
        </section>
      </main>
    </UserUIContainer>
  )
}