// node js 서버 프레임워크
import express from "express";
// Mongo DB - mongoose
import mongoose from "mongoose";
// .env 파일 - Mongo DB 설정
import config from "./config/index";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
// import path from "path"; // 절대 경로 // 드라이버까지
// route들을 등록
// post
import postsRoutes from "./routes/api/post";
// user
import userRoutes from "./routes/api/user";
// auth
import authRoutes from "./routes/api/auth";
// search
import searchRoutes from "./routes/api/search";

const app = express();
// Mongo DB 설정
const { MONGO_URI } = config;

const prod = process.env.NODE_ENV === "production";

/*===== express 설정 =====*/
// 서버 보안 부분을 보완해주는 라이브러리
app.use(hpp());
app.use(helmet());

// 브라우저가 다른 도메인이나 포트가 다른 서버의 자원을 요청해주는 것.
// react 같은 싱글 페이지 애플리케이션에서는 서버에서 설정을 해준다.
// origin: 허락하고자 하는 주소 - true라고 적으면 모두 허용
// credentials: true라고 작성하면 브라우저의 헤더에 추가된다.
app.use(cors({ origin: true, credentials: true }));
// 개발을 할 때 로그를 볼 수 있도록
// dev 개발 환경 설정으로 로그를 확인하도록
app.use(morgan("dev"));

// router를 사용하게 되면 body-parser를 이용하게 된다.
// body-parser를 통해서 req.body의 body 내용을 서버가 해석하도록
// express에 자체 내장이 되어있는 것을 사용할 것.
// express.json() // json 형태로 브라우저에서 어떤 내용을 보내면 서버에서 json 형태를 해석
app.use(express.json());
/*========================*/

/*===== Mongo DB 연결 =====*/
mongoose
    .connect(MONGO_URI, {
        // 아래 옵션들을 안 적으면 mongoose에서 경고를 계속 보냄
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("Mongo DB Connecting Success!!"))
    .catch((err) => console.log("Mongo DB Connecting Failed!!\n", err));
/*========================*/

/*===== router 설정 =====*/
// * front에서 서버접속을 하면 /api로 시작한 것으로 접속하는데
// home
// app.get("/"); // 처음에 신호들어오면 모두 여기서 받아들인다
// post
// /api/post를 적고 다음 주소에 따라서 post.js에 작성된 라우터들이 작동한다.
app.use("/api/post", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
// 여기 아래에는 위의 url과 다른 주소가 들어오면 client로 가달라는 형식으로 코드를 작성할 것이다.
// 그래서 서버 쪽이랑 client 쪽이랑 주소의 형식이 달라야 한다.

// * build한 react(client)를 여기에 가져와서
// * backend server 하나만 운영할 것이다.
// * 그 외에 모든 주소는 express 서버에서 아래의 주소(*)로 받는다.

// if (prod) {
//     // 이미 빌드가 완료된 정적인 파일을 사용한다
//     app.use(express.static(path.join(__dirname, "../client/build")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
//     });
// }

export default app; // app을 모듈화시켜서 다른 파일에서 이용할 수 있도록
