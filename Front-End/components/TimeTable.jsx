import { useState } from "react";
import tw from "twin.macro";

const TD = tw.td`py-2 px-4 h-12`;

export default function TimeTable({ reservedTimes, allTimes, selectedTime, setSelectedTimes }) {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const possibleTimes = allTimes.filter(time => !reservedTimes.includes(time));

  //연속된 시간 선택을 위한 함수
  const handleTimeSelection = (time) => {
    const newSelectedTimes = [...selectedTimes, time];
    const isSequential = newSelectedTimes
      .map(selectedTime => selectedTime.split(':').map(time => parseInt(time)))
      .sort((a, b) => a[0] - b[0] || a[1] - b[1])
      .every((time, index, array) => {
        if (index === 0) {
          return true;
        }
        const prevTime = array[index - 1];
        return time[0] === prevTime[0] && time[1] === prevTime[1] + 30;
      });
  
    if (isSequential) {
      setSelectedTimes(newSelectedTimes);
    }
  };

  return (
    <table tw="border border-neutral-5 rounded-lg table-auto w-full border-collapse text-left">
      <thead>
        <tr tw="border-b border-neutral-4 text-center">
          <th colSpan={2} tw="h-10">예약 가능 시간 내역</th>
        </tr>
      </thead>
      <tbody>
        {possibleTimes.map((time, index) => (
          <tr key={time}>
            <TD>
              <input
                tw="mr-2"
                type="checkbox"
                id={`row-${index}`}
                checked={selectedTimes.includes(time)}
                onChange={() => handleTimeSelection(time)}
              />
            </TD>
            <TD>
              {time}
            </TD>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
