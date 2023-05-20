// src/redux/store.js

import { createStore } from "redux";

// 초기 상태
const initialState = {
  selectedDate: new Date(),
};

// 액션 타입
const SET_SELECTED_DATE = "SET_SELECTED_DATE";

// 액션 생성자 함수
export const setSelectedDate = (date) => ({
  type: SET_SELECTED_DATE,
  payload: date,
});

// 리듀서 - Datepicker 컴포넌트에서 날짜가 변경되어 dispatch함수를 실행시키면 해당 내용이 리듀서로 전달됨
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };
    default:
      return state;
  }
};

// 스토어 생성
const store = createStore(reducer);

export default store;

//Datepicker가 없는 파일에서 날짜 불러오는 방법
// import { useSelector } from "react-redux";
// const selectedDate = useSelector((state) => state.selectedDate);