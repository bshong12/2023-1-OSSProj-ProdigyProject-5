import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../redux/store";
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

//날짜 선택
const Datepicker = () => { 
  const selectedDate = useSelector((state) => state.selectedDate); //현재 Redux에 저장되어 있는 날짜 가져오기
  const dispatch = useDispatch(); 

  const handleDateChange = (date) => { //날짜를 선택하면 Redux에 있는 날짜를 바꾸기 위한 함수
    const selectedDate = date.getTime();
    dispatch(setSelectedDate(selectedDate));
  };

  return (
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
