import { Transition as HeadlessUiTransition } from "@headlessui/react"


export default function Transition(props) { //애니메이션(어떤 컴포넌트의 상태가 변할 때 동작 정의)
  return <HeadlessUiTransition {...getProps(props)} />
}
Transition.Child = function TransitionChild(props) {
  return <HeadlessUiTransition.Child {...getProps(props)} />
}
function getProps(props) {
  return {
    ...props,
    enter: "enter",
    enterFrom: "enter-from",
    enterTo: "enter-to",
    entered: "entered",
    leave: "leave",
    leaveFrom: "leave-from",
    leaveTo: "leave-to",
    css: {
      "&.enter": props.enter,
      "&.enter-from": props.enterFrom,
      "&.enter-to": props.enterTo,
      "&.entered": props.entered,
      "&.leave": props.leave,
      "&.leave-from": props.leaveFrom,
      "&.leave-to": props.leaveTo,
    },
    beforeEnter: () => props.beforeEnter?.(),
    afterEnter: () => props.afterEnter?.(),
    beforeLeave: () => props.beforeLeave?.(),
    afterLeave: () => props.afterLeave?.(),
  }
}
