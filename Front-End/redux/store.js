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

// 리듀서
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
