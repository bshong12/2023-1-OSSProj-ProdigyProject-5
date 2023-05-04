import { useState } from "react";
import tw from "twin.macro";

const TD = tw.td`py-2 px-4 h-12`;

export default function TimeTable({ reservedTimes, allTimes }) {
  const [selectedTimes, setSelectedTimes] = useState([]);

  const possibleTimes = allTimes.filter(time => !reservedTimes.includes(time));

  const handleTimeSelection = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(selectedTime => selectedTime !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
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
