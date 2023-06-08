//adds the name and image for each building button
export const buildings = [
  {
    number: 1,
    name: "본관",
    id: "본관"
  },
  {
    number: 2,
    name: "정각원",
    id: "정각원"
  },
  {
    number: 3,
    name: "명진관",
    id: "명진관"
  },
  {
    number: 4,
    name: "만해관",
    id: "법학만해관"
  },
  {
    number: 5,
    name: "법학관",
    id: "법학만해관"
  },
  {
    number: 6,
    name: "과학관",
    id: "과학관"
  },
  {
    number: 7,
    name: "원흥관1",
    id: "원흥관 1,3"
  },
  {
    number: 8,
    name: "원흥관2",
    id: "원흥관 1,3"
  },
  {
    number: 9,
    name: "혜화관",
    id: "혜화관"
  },
  {
    number: 10,
    name: "학림관",
    id: "학림관"
  },
  {
    number: 11,
    name: "학생회관",
    id: "학생회관"
  },
  {
    number: 12,
    name: "경영관",
    id: "사회과학경영관"
  },
  {
    number: 13,
    name: "사회과학관",
    id: "사회과학경영관"
  },
  {
    number: 14,
    name: "문화관",
    id: "학술문화관"
  },
  {
    number: 15,
    name: "학술관",
    id: "학술문화관"
  },
  {
    number: 16,
    name: "다향관",
    id: "다향관"
  },
  {
    number: 17,
    name: "금강관",
    id: "금강관"
  },
  {
    number: 18,
    name: "박물관",
    id: "박물관"
  },
  {
    number: 19,
    name: "계산관A",
    id: "계산관A"
  },
  {
    number: 20,
    name: "계산관B",
    id: "계산관B"
  } ,
  {
    number: 21,
    name: "정보문화관P",
    id: "정보문화관P"
  },
  {
    number: 22,
    name: "정보문화관Q",
    id: "정보문화관Q"
  },
  {
    number: 23,
    name: "상록원",
    id: "상록원"
  },
  {
    number: 24,
    name: "반야관",
    id: "반야관"
  },
  {
    number: 25,
    name: "만해시비",
    id: "만해시비"
  },
  {
    number: 26,
    name: "만해광장",
    id: "만해광장"
  },
  {
    number: 27,
    name: "중앙도서관",
    id: "중앙도서관"
  },
  {
    number: 28,
    name: "생활협동조합",
    id: "생활협동조합"
  },
  {
    number: 29,
    name: "대운동장",
    id: "대운동장"
  },
  {
    number: 30,
    name: "체육관",
    id: "체육관"
  },
  {
    number: 31,
    name: "기숙사",
    id: "신공학관(기숙사)"
  },
  {
    number: 32,
    name: "신공학관",
    id: "신공학관(기숙사)"
  },
  {
    number: 33,
    name: "충무로영상센터",
    id: "충무로 영상센터"
  },
 {
    number: 34,
    name: "법학생활관",
    id: "법학생활관"
 },
  {
    number: 35,
    name: "고시반기숙사",
    id: "고시반기숙사"
  },
  {
    number: 36,
    name: "혜화별관",
    id: "혜화별관"
  },
  {
    number: 37,
    name: "원흥별관",
    id: "원흥별관"
  }
]

//예약이 가능한 모든 시간 배열
export const allTimes = ["6:00", "6:30", "7:00", "7:30", "8:00", "8:30","9:00","9:30",
"10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
"16:00","16:30","17:00","17:30","18:00","18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

// replace all occurrences only works with regex
export const nameToSlug = (name) => name.trim().toLowerCase().replace(/ /g, "-")
export const slugToName = (name) => name.trim().toLowerCase().replace(/-/g, " ")