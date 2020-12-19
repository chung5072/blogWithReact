import express from "express";
import Post from "../../models/post";

// express에서 Router를 불러옴
const router = express.Router();

router.get("/:searchTerm", async (req, res, next) => {
    try {
        // * Post 검색을 제목 기준으로
        const result = await Post.find({
            title: {
                // * mongodb 기본 메서드를 참조해서 사용하는 방식
                $regex: req.params.searchTerm,
                $options: "i", // * 덜 민감하게 정규표현식을 매칭하는 방식
            },
        });
        console.log("get_searchTerm Post Find Result: ", result);
        res.send(result);
    } catch (err) {
        console.error("err", err);
        next(err);
    }
});

export default router;
