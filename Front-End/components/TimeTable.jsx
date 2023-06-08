import { useState } from "react";
import tw from "twin.macro";

const TD = tw.td`py-2 px-4 h-12 rounded-lg`;

//allTimes는 utils의 buildings.js 파일에 지정되어 있는데 기본적인 시간 단위가 30분 단위임
export default function TimeTable({ reservedTimes, allTimes, selectedTimes, setSelectedTimes }) {

  //모든 시관과 예약이 되어있는 시간을 받고 예약이 가능한 시간을 거르는 과정
  const possibleTimes = allTimes.filter(time => !reservedTimes.includes(time));

  //시간을 선택할 때의 조건 - 연속된 시간을 선택, 이미 선택된 시간 해제(연속된 시간의 중간인 경우에는 해제 못함), 한 번에 최대로 예약할 수 있는 시간 4시간
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
      .map(selectedTime => selectedTime.split(':').map(time => parseInt(time))) //선택된 시간을 시간과 분으로 나눔
      .sort((a, b) => { //정렬하는데 
        if (a[0] !== b[0]) { //시간(hour)이 다르면 
          return a[0] - b[0]; // 시간 기준 오름차순
        } else { //시간이 같으면 
          return a[1] - b[1]; //분 기준 오름차순
        }
      })
      .every((time, index, array) => { 
        if (index === 0) { //처음 시간이 선택되면 시간 저장 
          return true;
        }
        const prevTime = array[index - 1];
        //시간이 같고 분이 00, 30인 경우(예를 들어 이전 시간 7:00 다음 시간7:30인 경우 저장), 시간의 차이가 1인데 이전 시간의 분이 30이고 다음 시간의 분이 0인 경우(예를 들면 7:30과 8:00)
        return (time[0] === prevTime[0] && time[1] === prevTime[1] + 30) || (prevTime[1] === 30 && time[0] === prevTime[0] + 1 && time[1] === 0);
      });
      //선택한 시간이 4시간 이상(30분 단위이기 때문에 8개 이상 선택)하면 더 이상 선택 안됨
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
