import { useEffect, useState } from "react";
import tw from "twin.macro";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { BreadCrumb, StyledLink, DropMenu } from "../../../components";
import { UserUIContainer } from "../../../layouts/UserUIContainer";
import { nameToSlug } from "../../../utils/buildings";
import {useSelector} from 'react-redux';
import api from "../../../utils/api";
import { set } from "react-hook-form";

// const selectedDate = useSelector((state) => state.selectedDate);

// {"room":"401-2166(신공학관(기숙사) 2166 강의실)","capacity":100,"equip_info":"","facility_info":"","floor":4}
export default function Building({ buildingname, buildingData }) {
  const { asPath } = useRouter();
  const pageHeading = buildingname || "강의실 목록";
  const [selectedFloor, setSelectedFloor] = useState(""); //선택된 층
  const floors = [...new Set(buildingData.map((room) => room.floor))];
  const date = useSelector((state) => state.selectedDate);
  
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
            {pathname:`${asPath}/${nameToSlug(roomData.room)}`, query: date }} passHref as={`${asPath}/${nameToSlug(roomData.room)}`}>
            <StyledLink
              underline
              tw="inline-flex items-center w-full before:([content:'🚪'] text-3xl mr-2)
                        bg-neutral-1 px-2 py-2 rounded-lg capitalize"
            >
              {roomData.room}
            </StyledLink>
          </Link>
          <button onClick={() => setIsRoomOpen(!isRoomOpen)} tw="mr-3">
            <img src="/static/drop_icon.png" />
          </button>
        </span>
        {isRoomOpen && (
          <div tw="bg-neutral-1 p-3">
            <ol>
              <li>수용인원 : {roomData.capacity}</li>
              <li>보유기자재정보 : {roomData.equip_info}</li>
              <li>보유시설정비정보 : {roomData.facility_info}</li>
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
          <BreadCrumb routesArr={asPath.split("/").filter(String)} />
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
            <ul tw="list-inside text-left text-lg font-hero grid gap-2 sm:(grid-cols-2) lg:(grid-cols-3)">
              {filterRoomsByFloor().map((roomData) => (
                <Roomli key={room[0]} roomData={roomData} />
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
  const { buildingname } = context.params;
  const { selectedDate } = context.query;

  try {
    const response = await api.get(`/buildings/${selectedDate}/${buildingname}`);
    const buildingData = response.data;
    
    return { props: { buildingname, ...buildingData } };
  } catch (error) {
    // 오류 처리
    return { props: { buildingname: "" } };
  }
};