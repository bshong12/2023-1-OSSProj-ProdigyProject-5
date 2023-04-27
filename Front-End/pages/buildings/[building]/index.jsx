import { useEffect, useState } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { BreadCrumb, StyledLink, DropMenu } from "../../../components"
import { UserUIContainer } from "../../../layouts/UserUIContainer"
import { buildings, nameToSlug } from "../../../utils/buildings"

//rooms=[[이름,층수,수용인원,보유기자재정보,보유시설정비정보],[...],...] 라는 가정 하에 작성
export default function Building({ heading, rooms, name }) {
  const { asPath } = useRouter()
  const pageHeading = heading || `${name} Rooms`
  const [selectedFloor, setSelectedFloor] = useState("");

  filterRoomsByFloor = () => { //선택된 층수에 따라 강의실 filter해서 분류
    if(!selectedFloor) {
      return rooms
    }
    return rooms.filter((room) => room[1] === selectedFloor)
  }

  const FloorItem = tw.li`
    hover:bg-gray-100
    pt-1 pb-1
  `

  return (
    <UserUIContainer title={pageHeading} headerBorder footer>
      <main tw="h-full">
        {/* sm은 640px이 최대인 환경에서(모바일 고려) md-lg일때는 1040px이 최대 데탑환경고려 */}
        <section tw="max-w-screen-sm md:max-w-screen-lg mx-auto text-center my-28 px-4"> 
          <BreadCrumb routesArr={asPath.split("/").filter(String)} />
          <h1 className="h2-headline" tw="mt-20 pb-5 capitalize">
            {pageHeading}
          </h1>
          <div tw="flex">
            <span tw="mr-10">
              <DropMenu buttonText={"층 리스트"}>
                <ul>
                  <FloorItem onClick={() => setSelectedFloor("")}>모든 층 보기</FloorItem>
                  <FloorItem onClick={() => selectedFloor(1)}>1층</FloorItem>
                  <FloorItem onClick={() => selectedFloor(2)}>2층</FloorItem>
                </ul>
              </DropMenu>
            </span>
            <ul tw="list-inside text-left text-lg font-hero grid gap-2 sm:(grid-cols-2) lg:(grid-cols-3)">

              {filterRoomsByFloor.map((room) => (
                <li key={room[0]}>
                  <span tw="flex flex-between w-auto bg-neutral-1">
                    <Link href={`${asPath}/${nameToSlug(room)}`} passHref>
                      <StyledLink
                        underline
                        tw="inline-flex items-center w-full before:([content:'🚪'] text-3xl mr-2)
                        bg-neutral-1 px-2 py-2 rounded-lg capitalize"
                      >
                        {room[0]}
                      </StyledLink>
                    </Link>
                    <DropMenu buttonText={""}>
                      <ol>
                        <li>수용 인원 : {room[2]}</li>
                        <li>보유 기자재 : {room[3]}</li>
                        <li>보유시설정비 : {room[4]}</li>
                      </ol>
                    </DropMenu>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </UserUIContainer>
  )
}

Building.theme = "light"

export const getStaticPaths = async () => {
  // get an array of all possible building links/slugs
  const paths = await buildings.map((b) => ({ params: { building: nameToSlug(b.name) } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  // get data from the requested building
  const buildingData = await buildings.find((b) => nameToSlug(b.name) === params.building)
  return { props: { ...buildingData } }
}
