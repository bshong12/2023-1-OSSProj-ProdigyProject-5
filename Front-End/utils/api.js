import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // 프록시 서버의 주소를 baseURL로 설정
});

export default api;