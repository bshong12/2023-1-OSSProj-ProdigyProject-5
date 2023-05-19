import { useEffect, useState } from "react";
import tw from "twin.macro";
import { useRouter } from "next/router"
import { Button, DropMenu, Datepicker } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";

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