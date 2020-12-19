import express from "express";
// 인증 로그인 관련해서 사용
import bcrypt from "bcryptjs";
// jwt
import jwt from "jsonwebtoken";
// 개인 정보가 들어있는 .env 파일 - jwt_secret
import config from "../../config/index";
// auth 미들웨어
import auth from "../../middleware/auth";

// jwt secret 값 - 단순 config를 써야 secretOrPrivateKey must have a value이 에러가 나타나지 않는다/
const { JWT_SECRET } = config;

// model
// user
import User from "../../models/user";

const router = express.Router();

// @route POST api/auth // 로그인을 할 때 사용하는 url
// @desc  Auth user
// @access Public // 로그인이기 때문에 모든 사람이 접근 가능해야
// 로그인은 로그인 정보를 써서 진행하는 것이기에 post()를 사용한다.
router.post("/", (req, res) => {
    const { email, password } = req.body; // == req.body.email, req.body.password

    // 간단한 인증
    if (!email || !password) {
        return res.status(400).json({ msg: "모든 필드를 채워주세요!!" });
    }

    // 유저가 존재하게 된다면
    // email과 password 칸이 다 채워진 다음에
    // 로그인하는 사람은 단 한 명이라서 findOne
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json({ msg: "유저가 존재하지 않습니다!!" });
        }
        // 유저가 존재하고 있다면 password를 검증
        // * 앞의 password는 현재 로그인하고자 하는 사람이 입력한 password
        // * 뒤의 user.password는 email을 통해서 찾은 결과값의 password를 의미
        bcrypt.compare(password, user.password).then((isMatch) => {
            // * compare()는 결과값으로 boolean을 반환 // true 또는 false
            if (!isMatch) {
                // password가 일치하지 않는다면
                return res
                    .status(400)
                    .json({ msg: "비밀번호가 일치하지 않습니다!!" });
            }
            // password가 일치한다면
            // 로그인을 하고 나서 토큰값을 발행해준다 // 회원가입에서 사용한 것과 같은 구조
            // 아이디 값, secret 값, 만료기한,
            jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: "2 days" },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({
                        token,
                        user: {
                            // 여기서 User 모델에 들어있는 user에서 email을 통해서 찾은 그 유저
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role, // User모델에서 작성한 역할, 글을 작성할 수 있는지에 대한 role
                        },
                    });
                }
            );
        });
    });
});

// 로그아웃
// TODO 프론트에서 redux-saga를 이용해서 처리할 예정
router.post("/logout", (req, res) => {
    res.json("로그아웃 성공!!");
});

router.get("/user", auth, async (req, res) => {
    try {
        // 프론트에서 ID를 보내주도록 한 다음에 User 모델에서 ID를 이용해서 찾는다
        // select를 생략하면 password 값도 나타나게 된다.
        const user = await User.findById(req.user.id).select("-password");
        if (!user) throw Error("유저가 존재하지 않습니다.");
        // 유저가 존재한다면 결과값을 프론트에 보내줌
        res.json(user);
    } catch (err) {
        console.log("err!", err);
        res.status(400).json({ msg: err.message });
    }
});

export default router;
