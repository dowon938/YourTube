# YourTube

---

이 프로젝트는 유튜브의 수많은 유혹을 뿌리치고자 만든 개인 프로젝트입니다.
내가 원하는 채널과, 재생목록을 저장해두고 유튜브에 들어가지 않고, 필요한 영상만 시청하기 위해 만들었습니다.
좋아하는 작업용 음악들을 모아두고 재생할 때 유용해요👍🏻

### 랜딩페이지

![image](https://user-images.githubusercontent.com/68101878/127576907-80759f4e-6ede-4fb5-a949-b102792a97bc.png)
[YourTube 바로가기](https://yourtube-app.netlify.app/)

**처음 방문하는 사용자에게 간략하게 사용법을 안내해주고 쿠키를 통해 재방문시 표시되지 않도록 함**

- react-cookie 라이브러리사용

### 로그인

![image](https://user-images.githubusercontent.com/68101878/127577507-85cec30b-0241-4161-b491-de3b3383a38f.png)
**헤더에서 구글과 깃허브 아이콘을 클릭해 구글계정과 깃허브 계정을 통해 로그인 가능**

- Firebase Authentication을 사용
- 로그인후에 자신만의 페이지를 만들었을 때 Firebase Realtime DB에 정보를 저장
- 로그인하지 않아도 기능은 모두 체험할 수 있고 다만 DB에 저장되지 않음
- 샘플페이지는 isSample변수를 만들어 구분하고, 샘플일시에 state만 변경하고 DB에는 저장하지 않도록 설정

### 페이지(재생목록) 구조

![image](https://user-images.githubusercontent.com/68101878/127579450-b809eb07-d3e8-4d25-87d7-2152a28efba3.png)
**페이지들은 여러 네모(재생목록더미)로 구성되어 있고, 네모는 비디오를 담고 있음**</br>
App - page - nemo - video

<img src="https://user-images.githubusercontent.com/68101878/127754217-0fda5223-bd1f-46c9-a27f-577c21f8495e.png" width='40%'><img src="https://user-images.githubusercontent.com/68101878/127754209-2c5d4c11-7d8b-4297-b5be-0bd91b1b8ea2.png" width='55%'>

<center><img src="https://user-images.githubusercontent.com/68101878/127754444-89dac5e1-1d66-4c42-b9fb-fad0efafbdc1.gif" width='75%'></center>

**네모에는 채널과 재생목록 중 하나를 추가 할 수 있고, 영상이 모자랄 경우 영상을 추가 할 수 있음**

- 채널 추가 - 채널을 추가하면 채널의 최신 동영상을 가져옴
- 재생목록 추가 - public으로 설정된 재생목록만 가져올 수 있고, url을 붙여넣으면 재생목록 ID를 찾아 추가함
- 네모에 비디오 갯수가 모자랄 경우에 영상 추가 버튼이 보임
- 영상 추가 - 영상을 키워드로 검색하거나 원하는 영상의 url로 직접 영상을 추가 할 수 있음
- 영상을 키워드로 검색하면 스크롤시에 nextPageToken을 이용해서 계속해서 목록을 받아와 무한스크롤
