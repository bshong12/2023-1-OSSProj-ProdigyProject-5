import { useEffect, useState } from "react";
import tw from "twin.macro";
import { Button, DropMenu } from "../../components";
import { UserUIContainer } from "../../layouts/UserUIContainer";

export default function Map() {
  return(
    <UserUIContainer title="campusmap" headerBorder footer>
      <main tw="h-full">
        
        <section tw="max-w-screen-lg mx-auto text-center my-28">
          <Datepicker/>
          <h1 className="h2-headline" tw="mt-20 pb-5">
            CAMPUS MAP
          </h1>
          <div tw="w-full justify-end">
            <Button 
              variant={trans}
              type="button"
              onClick={() => router.push("buildings")}
              tw="flex items-center justify-center"
              disabled={!!isLoading}
              isSmall
              > {isLoading ? <LoadingCircle /> : "지도로 보기"} </Button>
          </div>
          <span tw="w-9/12">

          </span>
          <span tw="w-1/4">

          </span>
        </section>
      </main>
    </UserUIContainer>
  )
}