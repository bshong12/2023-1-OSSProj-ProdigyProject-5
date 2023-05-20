import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../redux/store";
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

//날짜 선택
const Datepicker = () => { 
  const selectedDate = useSelector((state) => state.selectedDate); //현재 Redux에 저장되어 있는 날짜 가져오기
  const dispatch = useDispatch(); 

  const handleDateChange = (date) => { //날짜를 선택하면 Redux에 있는 날짜를 바꾸기 위한 함수
    dispatch(setSelectedDate(date));
  };

  return (
    <div tw="w-full mx-auto mt-28 flex items-center justify-end">
      <div tw="flex items-center justify-end">
        <ReactDatePicker
          tw="rounded-lg border-gray-500 w-32 h-auto mr-2"
          selected={selectedDate}
          minDate={new Date("2023-01-01")}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
        />
        <img src="/static/cal_icon.png" tw="w-7 h-auto mr-10" />
      </div>
    </div>
  );
};

export default Datepicker;
