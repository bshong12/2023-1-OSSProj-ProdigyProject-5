import { use, useEffect, useState } from "react"
import { useRouter } from "next/router"
import tw from "twin.macro"
import styled from "@emotion/styled"
import Link from "next/link"
import { useSelector } from "react-redux"
import { Img, Button, Datepicker} from "../../components"
import { UserUIContainer } from "../../layouts/UserUIContainer"
import api from "../../utils/api"

//건물의 이름과 사진을 나타낼 반복되는 건물카드 컴포넌트
const BuildingCard = ({ building, date}) => {
  const router = useRouter();
  const { name, image } = building
  const slug = name


  return ( //해당 카드를 선택하면 query를 통해 datePicker에서 선택한 날짜를 보내주고 선택한 건물에 맞는 페이지로 이동
    <Link href={{pathname: `/buildings/${slug}`, query: {date : date}}} as={`/buildings/${slug}`} passHref>
      <div tw="hover:bg-neutral-1 w-full p-2 text-left rounded transition ease-in-out">
          <span tw="block px-2 py-2 my-6 font-semibold capitalize bg-neutral-1 rounded-lg text-lg  ">
            {name}
          </span>
          <div tw="relative h-40 rounded-lg">
            <Img objectFit={"cover"} tw="rounded-lg" layout={"fill"} src={image} alt={name} />
          </div>
      </div>
    </Link>
  )
}

//건물의 사진과 이름으로 나타나는 건물 페이지. 캠퍼스맵페이지와 서로 왔다갔다함
export default function Buildings({ allBuildings }) {
  const router = useRouter()
  const selectedDate = useSelector((state) => state.selectedDate);
  const date = new Date(selectedDate); //리덕스에 저장되어 있는 날짜 Date로 반환
  const stringDate = date.toISOString().slice(0, 10); //YYYY-MM-DD형태로 나타남

  return (
    <UserUIContainer title="Buildings" headerBorder footer>
      <main tw="h-full">
        <section tw="max-w-screen-lg mx-auto text-center my-28">
          <div tw="w-full mt-28 flex items-center justify-end">
            <div tw="flex items-center justify-end flex-row">
              <img src="/static/cal_icon.png" tw="w-10 h-auto" />
              <Datepicker/>
            </div>
          </div>
            <h1 className="h2-headline" tw="mt-20 pb-5">
              Buildings
            </h1>
            <div tw="w-full flex justify-end py-10">
              <Button 
                variant="trans"
                type="button"
                onClick={() => router.push("buildings/campusmap")}
                tw="flex items-center justify-center w-32 mr-10"
                isSmall
                >지도로 보기</Button>
            </div>
            <div
              tw="relative px-5 py-10
                  grid gap-4 grid-cols-1 sm:(grid-cols-3) lg:(grid-cols-4)
                  "
            >
              {allBuildings?.map((building) => (
                <BuildingCard building={building} date={stringDate} key={building.name} />
              ))}
            </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

// 백엔드에서 대관이 가능한 건물들을 [{name: "name", image: "img"}, ...] 형태로 보내줄 것
//만약 객체 형태로 올 경우 {{}, {}, ...} => Object.values(buildings)로 배열로 바꿔줘야 함
export async function getServerSideProps() {
  try {
    const response = await api.get("/buildings");
    const allBuildings = response.data;

    return { props: { allBuildings } };
  } catch (error) {
    console.log("Failed to fetch buildings data:", error);
    return { props: { allBuildings: [] } };
  }
}

Buildings.theme = "light"
