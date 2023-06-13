import { useEffect, useState } from "react";
import tw from "twin.macro";
import { useRouter } from "next/router"
import { Button, DropMenu, Datepicker } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";
import { buildings, nameToSlug } from "../../utils/buildings"
import { useSelector } from "react-redux";
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import api from "../../utils/api"



//캠퍼스 지도에 표시된 번호를 통해 건물의 위치와 이름을 함께 알려주고 있는 페이지로, 이 페이지에는 대관신청이 안되는 건물도 있기 때문에 대관신청이 되지 않는 건물은 따로 처리
export default function Map({Buildings}) {
  const router = useRouter()
  const BuildingItem = tw.li`
    hover:bg-gray-100
    pt-1 pb-1
  `;
  const allBuildings = buildings

  const selectedDate = useSelector((state) => state.selectedDate);
  const date = new Date(selectedDate);
  const stringDate = date.toISOString().slice(0, 10);


  function handleBuildingClick(buildingName, buildingId) {
    const matchedBuilding = Buildings.find((building) => building.name === buildingId); //서버에서 보내준 건물과 utils폴더에 buildings.js에 있는 건물 배열의 id와 일치할경우
    if (matchedBuilding) {
      router.push(
        {pathname: `/buildings/${buildingId}`,
        query: {date : stringDate}})
     }else { //학교에 존재하는 건물이지만 대관 신청은 불가능한 건물이 있음
      alert(`${buildingName}은/는 대관신청이 불가능합니다`)
    }
  }

  return(
    <UserUIContainer title="campusmap" headerBorder footer>
      <main tw="h-full">
        
        <section tw="max-w-screen-lg mx-auto text-center my-28">
        <div tw="w-full mt-28 flex items-center justify-end">
            <div tw="flex items-center justify-end flex-row">
              <img src="/static/cal_icon.png" tw="w-10 h-auto" />
              <Datepicker/>
            </div>
          </div>
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
            <div tw="w-full flex flex-col lg:(flex-row) ">
              <div tw=" w-full lg:(w-10/12) mt-14">
                <img src="/static/campus_map.png" alt="캠퍼스 지도" />
              </div>
              <div tw="lg:(w-1/6) w-full flex justify-center lg:(justify-start) mt-20">
                <DropMenu buttonText={"건물 리스트"}>
                  <ul>
                    {allBuildings.map((building) => (
                    <BuildingItem
                      key={building.number}
                      onClick={()=>handleBuildingClick(building.name, building.id)}
                    > <b>{building.number}</b> {building.name}</BuildingItem>
                    ))}
                  </ul>
                </DropMenu>
              </div>
            </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

export async function getServerSideProps() {
  try {
    const response = await api.get("/buildings");
    const Buildings = response.data;

    return { props: { Buildings } };
  } catch (error) {
    console.error("Failed to fetch buildings data:", error);
    return { props: { Buildings: [] } };
  }
}