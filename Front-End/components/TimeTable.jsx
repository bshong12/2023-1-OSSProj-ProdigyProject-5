import { useState } from "react";
import tw from "twin.macro";

const TD = tw.td`py-2 px-4 h-12 rounded-lg`;

export default function TimeTable({ reservedTimes, allTimes, selectedTimes, setSelectedTimes }) {

  const possibleTimes = allTimes.filter(time => !reservedTimes.includes(time));

  const handleTimeSelection = (time) => {
    const newSelectedTimes = [...selectedTimes];
  
    if (newSelectedTimes.includes(time)) {
      // 이미 선택된 시간인 경우 해제
      const index = newSelectedTimes.indexOf(time);
      newSelectedTimes.splice(index, 1);
    } else {
      // 선택되지 않은 시간인 경우 추가
      newSelectedTimes.push(time);
    }
  
    const isSequential = newSelectedTimes
      .map(selectedTime => selectedTime.split(':').map(time => parseInt(time)))
      .sort((a, b) => {
        if (a[0] !== b[0]) {
          return a[0] - b[0];
        } else {
          return a[1] - b[1];
        }
      })
      .every((time, index, array) => {
        if (index === 0) {
          return true;
        }
        const prevTime = array[index - 1];
        return (time[0] === prevTime[0] && time[1] === prevTime[1] + 30) || (prevTime[1] === 30 && time[0] === prevTime[0] + 1);
      });
  
    if (newSelectedTimes.length <= 8 && isSequential) {
      setSelectedTimes(newSelectedTimes);
    }
  };
  


  return (
    <table tw="border border-neutral-4 rounded-lg table-auto w-full border-collapse text-left">
      <thead>
        <tr tw="border-b border-neutral-3 rounded-lg text-center">
          <th colSpan={2} tw="h-10 rounded-lg">예약 가능 시간 내역</th>
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
