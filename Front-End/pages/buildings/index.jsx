import { useEffect, useState } from "react"
import tw from "twin.macro"
import Link from "next/link"
import { useRouter } from "next/router"
import { Img, Button } from "../../components"
import { UserUIContainer } from "../../layouts/UserUIContainer"
import { buildings, nameToSlug } from "../../utils/buildings"
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

const BuildingCard = ({ building }) => {
  const { img, name } = building
  const slug = nameToSlug(name)

  return (
    <Link href={`/buildings/${slug}`} passHref>
      <a tw="w-full p-2 text-left rounded transition ease-in-out hover:(bg-neutral-1)">
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

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API [database]
  // const res = await fetch(`https://.../data`)
  // Temporary getting data from local file
  const allBuildings = buildings

  // Pass data to the page via props
  return { props: { allBuildings } }
}

Buildings.theme = "light"
