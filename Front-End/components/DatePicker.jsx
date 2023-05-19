import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate } from "../redux/store";
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = () => {
  const selectedDate = useSelector((state) => state.selectedDate);
  const dispatch = useDispatch();

  // 초기에 선택된 날짜가 없을 경우, 오늘 날짜로 설정
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, []);

  const handleDateChange = (date) => {
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
