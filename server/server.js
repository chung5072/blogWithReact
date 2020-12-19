// server.js를 이용해서 package.json에서 dev 스크립트를 실행시켜서
// server만 실행시키면 app.js 파일을 불러와서 구동하는 방식을 이용
import app from "./app";
// .env에 적은 개인정보
import config from "./config/index";
// 포트 번호
const { PORT } = config;

// 포트 번호도 .env에 저장
app.listen(PORT, () => {
    // 포트 7000에서 듣고 있다 == 대기?
    // 들으면 실행하는 문장
    // 7000 포트에서 hello, it's me 문장을 실행시켜 주세요 라고 작성
    // ``를 통해서 텍스트와 변수를 같이 작성 가능
    console.log(`hello, it's me... Server Started on Port ${PORT}`);
});
