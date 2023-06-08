import { configureStore, createSlice } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper"

// 초기 상태
const initialState = {
  selectedDate: new Date(),
};

// createSlice를 사용하여 액션과 리듀서를 생성-날짜 저장
const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
});

// 액션 생성자 함수를 추출
export const { setSelectedDate } = dateSlice.actions;

// rootReducer를 생성
const rootReducer = dateSlice.reducer;

// 스토어 생성
const store = configureStore({
  reducer: rootReducer,
});

export const wrapper = createWrapper(store, { debug: true })

export default store;
