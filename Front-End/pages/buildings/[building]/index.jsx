import { useEffect, useState } from "react";
import tw from "twin.macro";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { BreadCrumb, StyledLink, DropMenu } from "../../../components";
import { UserUIContainer } from "../../../layouts/UserUIContainer";
import { nameToSlug } from "../../../utils/buildings";
import api from "../../../utils/api";
import { set } from "react-hook-form";

// const selectedDate = useSelector((state) => state.selectedDate);

// {"room":"401-2166(신공학관(기숙사) 2166 강의실)","capacity":100,"equip_info":"","facility_info":"","floor":4}
export default function Building({ date, building, buildingData }) {
  const { asPath } = useRouter();
  const pageHeading = building || "강의실 목록";
  const [selectedFloor, setSelectedFloor] = useState(""); //선택된 층
  const floors = [...new Set(buildingData.map((roomData) => roomData.floor))];
  

  console.log(buildingData);
  
  const filterRoomsByFloor = () => {
    //선택된 층수에 따라 강의실 filter해서 분류
    if (!selectedFloor) {
      return buildingData;
    }
    return buildingData.filter((room) => room.floor === selectedFloor);
  };

  const Roomli = ({ roomData }) => {
    const [isRoomOpen, setIsRoomOpen] = useState(false);

    return (
      <li tw="mr-5 mb-5">
        <span tw="flex w-auto bg-neutral-1 justify-between rounded-lg">
          <Link href={
            
            {pathname: `/buildings/${building}/${roomData.room}`, query: {date : date}}} 
            passHref as={`/buildings/${building}/${roomData.room}`}>
            <div>
              <StyledLink
                underline
                tw="inline-flex items-center w-full before:([content:'🚪'] text-3xl mr-2)
                          bg-neutral-1 px-2 py-2 rounded-lg capitalize"
              >
                {roomData.room}
              </StyledLink>
            </div>
          </Link>
          <button onClick={() => setIsRoomOpen(!isRoomOpen)} tw="mr-3">
            <img src="/static/drop_icon.png" />
          </button>
        </span>
        {isRoomOpen && (
          <div tw="bg-neutral-1 p-3">
            <ol>
              {roomData.cpacity === ""? null : <li><b>수용인원</b> : {roomData.capacity}</li>}
              {roomData.equip_info === ""? null : <li><b>보유기자재정보</b> : {roomData.equip_info}</li>}
              {roomData.facility_info === ""? null : <li><b>보유시설정비정보</b> : {roomData.facility_info}</li>}
            </ol>
          </div>
        )}
      </li>
    );
  };
  const FloorItem = tw.li`
    hover:bg-gray-100
    pt-1 pb-1
  `;


  return (
    <UserUIContainer title={pageHeading} headerBorder footer>
      <main tw="h-full">
        {/* sm은 640px이 최대인 환경에서(모바일 고려) md-lg일때는 1040px이 최대 데탑환경고려 */}
        <section tw="max-w-screen-sm md:max-w-screen-lg mx-auto text-center my-28 px-4">
          <BreadCrumb routesArr={decodeURIComponent(asPath).split("/").filter(String)} />
          <h1 className="h2-headline" tw="mt-20 pb-5 capitalize">
            {pageHeading}
          </h1>
          <div tw="flex mt-10">
            <span tw="mr-10">
              <DropMenu buttonText={"층 리스트"}>
                <ul>
                  <FloorItem onClick={() => setSelectedFloor("")}>
                    모든 층 보기
                  </FloorItem>
                  {floors.map((floor) => (
                  <FloorItem
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                  > {floor} 층 </FloorItem>
                  ))}
                </ul>
              </DropMenu>
            </span>
            <ul tw="list-inside text-left text-lg font-hero grid gap-2 sm:(grid-cols-1) lg:(grid-cols-1)">
              {filterRoomsByFloor().map((roomData) => (
                <Roomli key={roomData[0]} roomData={roomData} />
              ))}
            </ul>
          </div>
        </section>
      </main>
    </UserUIContainer>
  );
}

Building.theme = "light";

export async function getServerSideProps (context) {
  const { date ,building } = context.query;

  try {
    const response = await api.get(`/buildings/${date}/${building}`);
    const buildingData = response.data;
    
    return { props: { date, building, buildingData } };
  } catch (error) {
    // 오류 처리
    return { props: { buildingname: "" } };
  }
};