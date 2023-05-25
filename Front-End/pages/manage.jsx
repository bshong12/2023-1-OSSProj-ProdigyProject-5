import MarketingContainer from "../layouts/MarketingContainer"

//reservedLists: 예약되었지만 승인이나 거절 처리가 되지 않은 예약 리스트
export default function Management(reservedLists) {
  return (
    <MarketingContainer title="management" footer noHeaderNav>
      <main
              tw="min-h-screen max-w-screen-lg w-full
                mx-auto px-4 pb-28 md:(px-8) flex
                flex-row items-center justify-start mt-10"
      >
        <div tw="w-1/2 flex flex-col">
        </div>
      </main>
    </MarketingContainer>
  )
}