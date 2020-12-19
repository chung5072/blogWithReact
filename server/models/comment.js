// 댓글 관련
import mongoose from "mongoose";
import moment from "moment";

const CommentSchema = new mongoose.Schema({
    contents: {
        type: String,
        required: true,
        // 댓글의 내용은 글자(문자열)이고 반드시 있어야 한다. > required: true는 개발자 마음
    },
    date: {
        type: String,
        default: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    // ObjectId를 통해서 다른 모듈과 연결(연동)
    // const Post = mongoose.model("post", PostSchema); // posr
    // const User = mongoose.model("user", UserSchema); // user
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
    },
    creatorName: {
        // 댓글을 달려고 할 때마다 user 모델을 들어가서 댓글 작성자 이름을 가져오는 것보다
        // 아예 댓글을 작성할 때 작성자 이름을 보낼 수 있도록 설정 > DB의 부담을 줄여줌
        type: String,
    },
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
