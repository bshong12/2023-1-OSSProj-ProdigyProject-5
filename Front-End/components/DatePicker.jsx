import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../redux/store";
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

//날짜 선택
const Datepicker = () => { 
  const selectedDate = useSelector((state) => state.selectedDate); //현재 Redux에 저장되어 있는 날짜 가져오기 (기본 날짜는 당일의 날짜)
  const dispatch = useDispatch(); 

  const handleDateChange = (date) => { //날짜를 선택하면 Redux에 있는 날짜를 바꾸기 위한 함수
    const selectedDate = date.getTime();
    dispatch(setSelectedDate(selectedDate));
    sessionStorage.setItem('date', selectedDate);
  };

  return ( // 리액트의 데이트피커 라이브러리 이용
        <ReactDatePicker
          tw="rounded-lg border-gray-500 w-32 h-auto mr-2"
          selected={selectedDate}
          minDate={new Date("2023-01-01")}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
        />
        
  );
};

export default Datepicker;
