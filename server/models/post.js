import mongoose from "mongoose";
import moment from "moment";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        // index는 나중에 검색 기능을 이용할 때 사용 > 검색은 제목을 이용해서 검색
    },
    contents: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: -2,
        // views는 조회수에 대한 필드인데 처음 작성할 때도 기록이 되기 때문에 작성할 때의 횟수를 빼기 위해서
    },
    fileUrl: {
        // 글을 작성하면서 올린 그림파일의 주소를 저장하기 위해서 만든 것
        // default url에 적힌 주소는 이미지를 랜덤으로 가져옴
        // 다른 그림 파일로 대체가 가능
        type: String,
        default: "https://source.unsplash.com/random/301x201",
    },
    date: {
        type: String,
        default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    category: {
        // 한 개의 post는 한 개의 카테고리가 있도록 정의해서 배열이 아닌 객체로 설정.
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
    },
    comments: [
        // 댓글은 한 글에 여러 개가 달릴 수 있어서 배열로 설정
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
            // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
        },
    ],
    creator: {
        // 작성자 - user 모델과 연결
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
        // 참조할 때 ObjectId를 이용한다.
        // ! user.js에서 const User = mongoose.model("user", UserSchema);
        // ! 위의 부분을 통해서 user라는 이름을 사용하여 User 모델을 이용한다.
    },
});

const Post = mongoose.model("post", PostSchema);

export default Post;
