import tw, { css } from "twin.macro"
import { Disclosure as HeadlessDisclosure } from "@headlessui/react"
import Icons from "./Icons"
import Transition from "./Transition"

//접기 펼치기 동작을 구현하는 Disclosure 컴포넌트
//HeadlessDisclosure.Button과 HeadlessDisclosure.Panel은 접기/펼치기 동작을 처리하는 버튼과 패널을 제공
//items 배열을 매개변수로 받아서 각 아이템에 대한 접기/펼치기 동작을 생성
//buttonProps와 panelProps
export default function Disclosure({
  items,
  disclosureProps,
  buttonProps,
  panelProps = {},
}) {
  if (!items) return null
  return (
    <div tw="p-2 space-y-2 bg-white rounded-2xl">
      {items.map((item) => {
        return (
          <HeadlessDisclosure key={item.heading} {...disclosureProps}>
            {({ open }) => (
              <div>
                <HeadlessDisclosure.Button
                  tw="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:(ring ring-purple-500 ring-opacity-75)"
                  {...buttonProps}
                >
                  <span>{item.heading}</span>
                  <Icons.ChevronUp
                    css={[tw`w-5 h-5 text-purple-500`, open && tw`transform rotate-180`]}
                  />
                </HeadlessDisclosure.Button>
                <Transition show={open} {...transitionProps}>
                  <HeadlessDisclosure.Panel
                    static
                    tw="px-4 pt-4 pb-2 text-sm text-gray-500"
                    {...panelProps}
                  >
                    {item.content}
                  </HeadlessDisclosure.Panel>
                </Transition>
              </div>
            )}
          </HeadlessDisclosure>
        )
      })}
    </div>
  )
}
const transitionProps = {
  enter: tw`transition ease-out duration-100`,
  enterFrom: tw`transform opacity-0 scale-95`,
  enterTo: tw`transform opacity-100 scale-100`,
  leave: tw`transition ease-out duration-75`,
  leaveFrom: tw`transform opacity-100 scale-100`,
  leaveTo: tw`transform opacity-0 scale-95`,
}
