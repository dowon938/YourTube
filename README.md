# YourTube

---

이 프로젝트는 유튜브의 수많은 유혹을 뿌리치고자 만든 개인 프로젝트입니다.
내가 원하는 채널과, 재생목록을 저장해두고 유튜브에 들어가지 않고, 필요한 영상만 시청하기 위해 만들었습니다.
좋아하는 작업용 음악들을 모아두고 재생할 때 유용해요👍🏻

### 랜딩페이지
![image](https://user-images.githubusercontent.com/68101878/127576907-80759f4e-6ede-4fb5-a949-b102792a97bc.png)
[YourTube 바로가기](https://yourtube-app.netlify.app/)

처음 방문하는 사용자에게 간략하게 사용법을 안내해주고 쿠키를 통해 재방문시 표시되지 않도록 함
* react-cookie 라이브러리사용

### 로그인
![image](https://user-images.githubusercontent.com/68101878/127577507-85cec30b-0241-4161-b491-de3b3383a38f.png)
헤더에서 구글과 깃허브 아이콘을 클릭해 구글계정과 깃허브 계정을 통해 로그인 가능
* Firebase Authentication을 사용
* 로그인후에 자신만의 페이지를 만들었을 때 Firebase Realtime DB에 정보를 저장
* 로그인하지 않아도 기능은 모두 체험할 수 있으며 다만 DB에 저장되지 않음(isSample변수를 만들어 샘플일시에 state만 변경하고 DB에는 저장하지 않도록 설정)
