// mongoose를 이용하여 JS로 DB 관리
import mongoose from "mongoose";
// UTC 반영
import moment from "moment";

// 스키마 == 데이터 모델
// create schema
const UserSchema = new mongoose.Schema({
    // 이름, 아이디, 비밀번호, 가입한 날짜, 역할 부여(관리자만 글 작성 가능, 나머지는 댓글만),
    // 사용자와 글, 댓글의 연관성
    name: {
        // 이름
        type: String,
        required: true, // 반드시 필수
    },
    email: {
        type: String,
        required: true, // 반드시 필수
        unique: true, // 중복 불가 - 남들과 비교할 수 있는 유일한 식별자
    },
    password: {
        type: String,
        required: true, // 반드시 필수
    },
    role: {
        type: String,
        enum: ["MainJuin", "SubJuin", "User"], // 역할 부여 - 역할을 바꿔주는 것은 DB에서 직접
        default: "User",
    },
    register_date: {
        type: Date,
        default: moment().format("YYYY-MM-DD hh:mm"), // Date.now 에서 변경 - 연도-월-일 시간-분
    },
    comments: [
        // 모델끼리 _id를 통해서 서로 연결, 서로를 찾아줌
        // 유저 한 사람이 많은 수의 글이나 댓글을 쓸 수 있다. - 1 대 다 관계
        // 배열 구조
        {
            post_id: {
                // ! 얘 같은 경우에는 글을 지우게 되면 댓글도 같이 지워주는 기능을 위해서 글의 ID도 적어준다.
                // ! 글을 지울 때 postid와 관련된 것은 모두 지우기 위해서
                type: mongoose.Schema.Types.ObjectId,
                ref: "posts",
                // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
            },
            comment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "comments",
                // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
            },
        },
    ],
    posts: [
        // 글 - 한 사람이 여러 개의 글을 작성할 수 있기 때문에 1 대 다 관계
        // 배열 구조
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],
});

const User = mongoose.model("user", UserSchema);
// 향후 User 모델을 불러올 때는 user을 이용하겠다.

export default User;
// 유저 모델을 모델화하여 외부에서 이용할 수 있도록
