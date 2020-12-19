// 회원 가입과 로그인을 처리
// 방식은 jwt web token 방식
// jwt. 즉, 토큰 안에 j 형태로 된 웹 토큰 안에 일정한 정보를 담아서
// 로그인을 하거나 post 글 작성할 때 오로지 인증된 사람만 작성할 수 있도록
// 웹에서 토큰을 보내주면 서버에서 이를 인증을 해서 만약에 성공한다면 글을 쓸 수 있거나 로그인을 하는 형태로 진행
// 이런 방식으로 한다면 서버측에서 유저가 로그인을 했는지를 보관하고 있을 필요가 없고
// 단지 요청이 있을 때, 즉 로그인을 하거나 인증된 유저만이 글을 쓸 수 있다고 가정을 한다면
// 토큰 값이 유효한지만 체크를 해서 접근 여부를 허용할 수 있다.

import express from "express";

// 비밀번호 암호화
import bcrypt from "bcryptjs";
// 웹 토큰
import jwt from "jsonwebtoken";

// 모델을 불러옴
import User from "../../models/user";

// .env에서 작성한 개인정보 값 - jwt_secret
// config는 {}로 묶으면 안된다.
import config from "../../config/index";
// 웹 토큰 사용시 필요한 비밀 값 == jwt_secret
const { JWT_SECRET } = config;

const router = express.Router();

// @routes GET api/user
// @desc   Get all user
// @access public

// 유저 정보를 가져옴
router.get("/", async (req, res) => {
    try {
        // 에러가 발생할 수도 있는 코드
        // 유저를 찾음
        const users = await User.find();
        if (!users) {
            // 만약에 유저가 하나도 없다면
            throw Error("No Users");
        }
        // 유저가 있다면
        res.status(200).json(users);
    } catch (err) {
        // 에러가 발생한다면 실행하는 코드
        console.log("err!", err);
        res.status(400).json({ msg: err.message });
    }
});

// @routes POST api/user
// @desc   Register user
// @access public // 회원 등록하는 것은 모든 사람이 접근할 수 있는 것이 맞음

// 회원 가입
router.post("/", (req, res) => {
    // 브라우저에서 express로 무슨 정보를 넘기면 req의 body에 해당 정보의 내용이 들어가있다
    console.log(req.body);
    const { name, email, password } = req.body;

    //간단한 인증
    if (!name || !email || !password) {
        // User 모델에서 name, email, password를 required: true로 설정을 했음
        return res.status(400).json({ msg: "모든 필드를 채워주세요!" });
        // 향후 프론트에서 결과값으로 msg가 들어오면
        // bootstrap에서 알림을 처리하기 위해서
    }

    // 만약 유저가 기존에 가입된 유저가 있다면
    // User 모델에서 email을 unique: true 설정을 해줌
    // 이메일을 통해서 가입된 유저인지 판별을 할 예정
    /**아래와 같은 구조
     * const user = User.findOne({email})
     * function (user) {
     *  if(user) {return ... }
     * }
     */
    User.findOne({ email }).then((user) => {
        // then은 findOne을 통해 찾은 값이 then 안으로 들어오게 됨
        if (user) {
            // 유저가 존재한다면 회원 가입 실패
            return res
                .status(400)
                .json({ msg: "이미 가입된 유저가 존재합니다" });
        }
        // 존재하지 않는 유저라면
        const newUser = new User({
            name,
            email,
            password,
        });

        // 비밀번호 암호화 - bcrypt - hash를 편하게 이용할 수 있도록 하는 라이브러리
        // hash를 이용, 문장 길이가 어떻든 내용을 어떤 일정한 길이의 내용으로 변경
        // 비밀번호에 소금을 쳐서 해커한테 털려도 알 수 없게끔. 망치는데 소금을 친다는 것에서 유래
        // 암튼 못알아보게 하는거임
        // genSalt(10, ) // 10은 2^10
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // 새 유저의 비밀번호(평문), 소금으로 칠 값, 평문과 소금으로 칠 값으로 hash를 만듦
                if (err) {
                    throw err;
                }
                newUser.password = hash;
                newUser.save().then((user) => {
                    // 위에서 생성했던 newUser에 hash로 만들어진 비밀번호를 넣고
                    // 드디어 newUser를 save()를 통해서 저장
                    jwt.sign(
                        // 웹 토큰에 등록
                        { id: user.id },
                        // jwt_secret == 서버에서 인증한 웹 토큰이라는 것을 인정받기 위해서 비밀값이 필요
                        // 비밀 값이라서 .env파일에 저장
                        JWT_SECRET,
                        // 만기 시간, 단위가 초
                        // 아니면 10h(10시간)이나 10d(10일) 이런 식으로도 적을 수 있다
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) {
                                throw err;
                            }
                            res.json({
                                token,
                                user: {
                                    // mongo db에 들어갈 때 _id로 나타나는데 어떻게 .id로 쓰는데 되는거냐
                                    // _id를 바로 불러서 사용할 때 .id 형태로 사용
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                },
                            });
                        }
                    );
                });
            });
        });
    });
});

// * Profil 작업
// @route Post /api/user/:username/profile
// @desc post edit password
// @access private
router.post("/:userName/profile", async (req, res) => {
    try {
        // 기존 비밀번호, 새 비밀번호, 새 비밀번호 확인, 유저 아이디
        const { previousPassword, password, rePassword, userId } = req.body;
        console.log("req.body user & pw: ", req.body);
        // * userId를 통해서 User 모델에서 user를 찾아내고 해당 user의 password를 찾아낸다
        const result = await User.findById(userId, "password");

        // * 이전 비밀번호와 resut에서 찾은 user의 비밀번호를 비교하면
        bcrypt.compare(previousPassword, result.password).then((isMatch) => {
            if (!isMatch) {
                // * 비밀번호가 서로 일치하지 않으면
                return res.status(400).json({
                    match_msg: "기존 비밀번호와 일치하지 않습니다",
                });
            } else {
                // * 이전 비밀번호과 result에서 찾은 user의 비밀번호가 같으면
                if (password === rePassword) {
                    // * 그리고 새로 입력한 비밀번호와 새 비밀번호 확인이 같으면
                    bcrypt.genSalt(10, (err, salt) => {
                        // * bcrypt를 통해 암호화 하는 과정
                        // * hash = password + salt
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            result.password = hash;
                            result.save();
                        });
                    });
                    res.status(200).json({
                        success_msg: "비밀번호 업데이트에 성공했습니다.",
                    });
                } else {
                    res.status(400).json({
                        fail_msg: "새로운 비밀번호가 일치하지 않습니다.",
                    });
                }
            }
        });
    } catch (err) {
        console.log("err: ", err);
    }
});

export default router;
