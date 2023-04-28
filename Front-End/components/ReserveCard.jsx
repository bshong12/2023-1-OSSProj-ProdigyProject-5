import { useState } from "react";
import tw from "twin.macro";
import {Button} from "./Button"

/* reserve = {예약번호 : INT,
              신청일 : DATE,
              시설분류 : Charset,
              예약날짜 : DATE,
              예약시간 : TIME,
              처리상태 : boolean} 이라고 가정*/
export default function(reserve) {
  
  return (
    <div tw="flex flex-column bg-neutral-1">
      <p>{reserve.inDate}</p>
      <div tw="w-full flex flex-between rounded-lg bg-white">
        <table tw="text-left">
          <tr>
            <td>예약번호 : {reserve.reserveNum}</td>
            <td>시설분류 : {reserve.roomSep}</td>
          </tr>
          <tr>
            <td>예약날짜 : {reserve.resDate}</td>
            <td>예약시간 : {reserve.resTime}</td>
          </tr>
          <tr>
            <td rowSpan={2}>처리상태 : {reserve.resAllow}</td>
          </tr>
        </table>
        <span tw="flex flex-column justify-center">
          <Button variant = {"trans"}>예약취소</Button>
        </span>
      </div>
    </div>
  );


}