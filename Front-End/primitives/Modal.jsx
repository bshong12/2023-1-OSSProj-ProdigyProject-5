import tw from "twin.macro"
import { Fragment, useState } from "react"
import { Dialog } from "@headlessui/react"
import Transition from "./Transition"
import { HiX } from "react-icons/hi"

//모달창 isOpen과 setIsOpen은 모달창이 열리는 조건 정의
//modalFunc는 모달 창이 닫힐 때 동작 정이
//나머지는 모달 창에 표시될 내용을 Props 형태로 저장
//contentProps에 들어갈 내용은 content 컴포넌트에 들어갈 props넣으면 됨
export default function Modal({
  isOpen,
  setIsOpen,
  modalFunc,
  dialogProps,
  contentProps,
  dialogOverlayProps,
  titleProps,
  descriptionProps,
}) {
  const closeModal = () => setIsOpen(false)

  return (
    <Fragment>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          tw="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
          {...dialogProps}
        >
          <div tw="min-h-screen px-4 text-center">
            <Transition.Child {...overlayTransitionProps} as="div">
              <Dialog.Overlay
                tw="fixed inset-0 bg-black opacity-30"
                {...dialogOverlayProps}
              />
            </Transition.Child>
            <CenterAlignmentHack />
            <Transition.Child {...contentTransitionProps} as={Fragment}>
              <div tw="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl text-gray-900">
                <Content
                  {...contentProps}
                  titleProps={titleProps}
                  descriptionProps={descriptionProps}
                  closeModal={closeModal}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  )
}
function Content({
  title,
  description,
  content,
  closeModal,
  modalFunc,
  closeLabel,
  buttonArea,
  titleProps,
  descriptionProps,
}) {
  return (
    <Fragment>
      <div tw="w-full flex items-center justify-end">
        <button type="button" onClick={closeModal}>
          <HiX
            tw="w-6 h-6 rounded-full border shadow-inner p-1 transition-all ease-in-out
            text-neutral-ying bg-neutral-1 hocus:(bg-neutral-2)
            "
          />
        </button>
      </div>
      <Dialog.Title
        as="h3"
        tw="text-xl font-medium leading-6 text-gray-900 sm:(text-2xl)"
        {...titleProps}
      >
        {title}
      </Dialog.Title>
      {description && (
        <Dialog.Description {...descriptionProps}>{description}</Dialog.Description>
      )}
      <div tw="mt-2">
        <div tw="text-sm text-gray-500">{content}</div>
      </div>
      {buttonArea ? (
        <>{buttonArea}</>
      ) : (
        closeLabel && (
          <div tw="mt-4">
            <button
              type="button"
              tw="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-blue-500)"
              onClick={modalFunc}
            >
              {closeLabel}
            </button>
          </div>
        )
      )}
    </Fragment>
  )
}

/* This element is to trick the browser into centering the modal contents. */
const CenterAlignmentHack = () => {
  return (
    <span tw="inline-block h-screen align-middle" aria-hidden="true">
      &#8203;
    </span>
  )
}
const overlayTransitionProps = {
  enter: tw`ease-out duration-300`,
  enterFrom: tw`opacity-0`,
  enterTo: tw`opacity-100`,
  leave: tw`ease-in duration-200`,
  leaveFrom: tw`opacity-100`,
  leaveTo: tw`opacity-0`,
}
const contentTransitionProps = {
  enter: tw`ease-out duration-300`,
  enterFrom: tw`opacity-0 scale-95`,
  enterTo: tw`opacity-100 scale-100`,
  leave: tw`ease-in duration-200`,
  leaveFrom: tw`opacity-100 scale-100`,
  leaveTo: tw`opacity-0 scale-95`,
}
