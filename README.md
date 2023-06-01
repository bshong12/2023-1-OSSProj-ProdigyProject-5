# 동국대학교 대관 신청 웹 시스템
React 기반의 동국대학교 대관신청 웹 시스템

## Developed by CSID-DGU: Prodigy_Project
<img alt="MIT" src ="https://img.shields.io/badge/license-MIT-salmon"> <img src="https://img.shields.io/badge/Node.js-0175C2?style=flat-square&logo=Nodedotjs%2B%2B&logoColor=white"/> 

| Role  | Name | Skills |
| :-----: |:----:| ------ |
| Frontend  | [김유리](https://github.com/yurik1m) |<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/> <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/>|
| Backend   | [홍범선](https://github.com/bshong12)|<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/>|
| DBA  | [홍서이](https://github.com/hongseoi) | <img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/> <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/>|


로그인 페이지
- 학번, 비밀번호를 입력하여 사이트에 로그인 할 수 있습니다.
- 로그인은 JWT 토큰을 이용하여 구현하였습니다.


회원가입 페이지
- 새 계정을 생성할 수 있습니다.
- 생성된 계정은 데이터베이스에 저장됩니다.

예약일 선택 및 건물 선택
- datepicker를 이용해 원하는 예약일을 선택하고 예약을 원하는 건물을 선택할 수 있습니다.

건물 내 강의실 선택
- 선택한 건물의 예약가능한 강의실을 보여줍니다. 강의실 클릭시 토글 형태로 강의실 정보를 보여줍니다.

예약 폼 작성
- 원하는 예약 시간을 선택하고 예약 폼을 작성하여 예약을 신청할 수 있습니다.

관리자 페이지
- 이용자의 예약 신청 내역을 확인하고 예약에 대해 승인 혹은 취소할 수 있습니다.

## Project Structure

```
└─📂Back-End // 백엔드 관련 파일들
    ├─📂controllers
    ├─📂DB
    ├─📂models
    └─📂services
└─📂Documents   // 문서 및 데이터베이스 관련 파일들
    └─📂DB
        ├─📂Backup  // MySQL sql 백업 파일들
        ├─📂Data    // 파이썬 데이터전처리 관련 파일들
        └─📃OSSProj_데이터베이스 설계도
    ├─📂Interim Announcement    // 중간발표 파일들
    ├─📂Proceddings // 회의록 파일들
    └─📂Propossal   // 제안서 파일들
└─📂Front-End
    ├─📂components
    ├─📂layouts
    ├─📂pages
    ├─📂primitives
    ├─📂public
    ├─📂redux
    └─📂utils

```
## Getting Started

 ./Documents/DB 위치의 sql 파일 최신 버전을 다운로드하고 데이터베이스에 백업합니다.

 ```
 cd ./Back-End
 node server
 cd ./Front-End
 yarn dev
 ```

## References
- https://github.com/cs50victor/cu-rooms
- https://github.com/CSID-DGU/2022-2-OSSProj-You_are_webcome-9

