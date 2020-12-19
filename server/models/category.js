import mongoose from "mongoose";

// Create Schema
const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        default: "미분류",
        // 글을 작성할 때 카테고리를 작성하지 않으면 미분류라고 나타남
    },
    posts: [
        // 한 카테고리 안에 여러 개의 글이 작성될 수 있기 때문에 배열로 설정
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            // 서로 간에 참조할 때는 반드시 ref를 이용해서 누구를 참조할 것인지
            // const Post = mongoose.model("post", PostSchema); // 여기서 "" 내부인 post를 작성한다.
        },
    ],
});

const Category = mongoose.model("category", CategorySchema);

export default Category;
