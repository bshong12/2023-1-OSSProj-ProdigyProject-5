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
    const matchedBuilding = Buildings.find((building) => building.name === buildingId);
    if (matchedBuilding) {
      router.push(
        {pathname: `/buildings/${buildingId}`,
        query: {date : stringDate}})
     }else {
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
            <div tw="w-full flex ">
              <div tw="w-10/12">
                <img src="/static/campus_map.png" alt="캠퍼스 지도" />
              </div>
              <div tw="w-1/6 flex mt-20">
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