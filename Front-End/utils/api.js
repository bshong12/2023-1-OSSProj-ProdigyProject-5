import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // 프록시 서버의 주소를 baseURL로 설정

  withCredentials: true, // withCredentials 옵션을 추가하여 쿠키를 전송

});

export default api;