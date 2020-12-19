// dotenv(Mongo DB 설정 내용, )로 작성한 내용들을 불러올 파일
import dotenv from "dotenv";
dotenv.config();

export default {
    // 모듈화를 통해서 다른 파일에서 MONGO_URI로 불러올 수 있도록
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
};
