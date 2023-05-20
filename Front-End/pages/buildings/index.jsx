import { useEffect, useState } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { Img, Button, Datepicker } from "../../components"
import { UserUIContainer } from "../../layouts/UserUIContainer"
import { buildings, nameToSlug } from "../../utils/buildings"
import { useSelector } from "react-redux"
import api from "../../utils/api"

const BuildingCard = ({ building }) => {
  const { name, img } = building
  const slug = nameToSlug(name)
  const selectedDate = useSelector((state) => state.date.selectedDate);

  const handleClick = async () => {
    try {
      await axios.post(`api/${selectedDate}/buildingname`, { name: name });
      // 서버로 선택한 건물 정보를 전달하는 POST 요청을 보냄
    } catch (error) {
      console.error("Failed to send building info:", error);
    }
  };


  return (
    <Link href={`/buildings/${slug}`} passHref>
      <a tw="w-full p-2 text-left rounded transition ease-in-out hover:(bg-neutral-1)" onClick={handleClick}>
        <span tw="block px-2 py-2 my-6 font-semibold capitalize bg-neutral-1 rounded-lg text-lg ">
          {name}
        </span>
        <div tw="relative h-40 rounded-lg">
          <Img objectFit={"cover"} tw="rounded-lg" layout={"fill"} src={img} alt={name} />
        </div>
      </a>
    </Link>
  )
}

export default function Buildings({ allBuildings }) {
  const router = useRouter()

  return (
    <UserUIContainer title="Buildings" headerBorder footer>
      <main tw="h-full">
        <section tw="max-w-screen-lg mx-auto text-center my-28">
          <Datepicker/>
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
                grid gap-4 grid-cols-2 sm:(grid-cols-3) lg:(grid-cols-4)
                "
          >
            {allBuildings?.map((building) => (
              <BuildingCard building={building} key={building.name} />
            ))}
          </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

// 백엔드에서 보내주는 data buildings가 [{name: "name", img: "img"}, ...] 형태로 보내줄 것이라 가정
//만약 객체 형태로 올 경우 {{}, {}, ...} => Object.values(buildings)로 배열로 바꿔줘야 함
export async function getServerSideProps() {
  try {
    const response = await api.get("/buildings");
    const allBuildings = response.data;
    console.log(allBuildings)
    return { props: { allBuildings } };
  } catch (error) {
    console.error("Failed to fetch buildings data:", error);
    return { props: { allBuildings: [] } };
  }
}

Buildings.theme = "light"
