# 동국대학교 대관 신청 웹 시스템
React 기반의 동국대학교 대관신청 웹 시스템

## Developed by CSID-DGU: Prodigy_Project
<img alt="MIT" src ="https://img.shields.io/badge/license-MIT-salmon"> <img src="https://img.shields.io/badge/Node.js-0175C2?style=flat-square&logo=Nodedotjs%2B%2B&logoColor=white"/> 

| Role  | Name | Skills |
| :-----: |:----:| ------ |
| Frontend  | [김유리](https://github.com/yurik1m) |<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/react.svg" />|
| Backend   | [홍범선](https://github.com/bshong12)|<img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/amazonaws.svg" />|
| DBA  | [홍서이](https://github.com/hongseoi) |<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> |


로그인 페이지

회원가입 페이지

예약일 선택 및 건물 선택

건물 내 강의실 선택

예약 폼 작성

관리자 페이지


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

