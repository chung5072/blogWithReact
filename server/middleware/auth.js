// 웹 토큰
import jwt from "jsonwebtoken";

// dotenv에 작성한 개인정보 값
import config from "../config/index";
// jwt secret 값
const { JWT_SECRET } = config;

const auth = (req, res, next) => {
    // token 값은 브라우저 헤더에 저장이 되어있음 // 헤더에서 가져옴
    const token = req.header("x-auth-token");

    if (!token) {
        return res
            .status(401)
            .json({ msg: "토큰이 없습니다. 인증이 거부되었습니다!!" });
    }
    try {
        // 토큰이 존재하게 된다면 해석
        // 서버에서 발행했다는 인증 값인 secret 값을 넣어서 토큰을 해석
        const decoded = jwt.verify(token, JWT_SECRET);
        // 토큰 값과 요청한 user의 값이 같다면
        req.user = decoded;
        // 다음으로 넘어감
        next();
    } catch (err) {
        console.log("err!", err);
        res.status(400).json({ msg: "토큰 값이 유효하지 않습니다" });
    }
};

export default auth;
