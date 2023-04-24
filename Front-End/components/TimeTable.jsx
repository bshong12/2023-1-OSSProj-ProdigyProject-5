import tw from "twin.macro";

const TD = tw.td`py-2 px-4`;

export default function TimeTable(time) { //time은 예약 되어있는 시간 배열
  const allTime = ['06:30-07:30', '07:30-08:30', '08:30-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30',
  '12:30-13:30','13:30-14:30','14:30-15:30','15:30-16:30','16:30-17:30','17:30-18:30']; //모든 시간 테이블 (나중에 db연동에 따라 형식이 바뀔수도 있음)

  const possibleTime = allTime.filter(x => !time.includes(x)); //모든 시간 테이블과 받아온 예약되어있는 시간 테이블의 차집합을 가능한 시간 테이블에 저장
  return (
    <table tw="border border-gray-700 table-auto w-full border-collapse">
      <thead>
        <tr tw="border-bottom border-gray-600">
          <th colSpan={2}>예약 가능 시간 내역</th>
        </tr>
      </thead>
      <tbody>
        {time.map((row, index) =>
          <tr key={index}>
            <TD>
              <input tw="mr-2" type="checkbox" id="`row-${index}`"/>
            </TD>
            <TD>
              {row.map((cell, i) => (
                <TD key={i}>{cell}</TD>
              ))}
            </TD>
          </tr>
        )}
      </tbody>
    </table>
  );
}