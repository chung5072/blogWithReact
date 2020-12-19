import express from "express";
// Mongo DB 모델을 불러옴
import User from "../../models/user";
import Post from "../../models/post";
import Category from "../../models/category";
import Comment from "../../models/comment";
import auth from "../../middleware/auth";
import moment from "moment";
import "@babel/polyfill"; // es6 버젼의 문법을 이용하다보니 잘 호환되지 않는 경우가 있는데 그 경우를 대비하기 위해서 사용

// express에서 Router를 불러옴
const router = express.Router();

// 파일들을 주고 받을 수 있는 라이브러리
import multer from "multer";
// s3: aws s3와 향후 주고받을 수 있게 도와주는 라이브러리
import multerS3 from "multer-s3";
// 지금 경로를 파악할 수 있도록 도와줌
import path from "path";
// aws를 사용할 수 있게 도와주는 개발자 도구
import AWS from "aws-sdk";

// dotenv
import dotenv from "dotenv";
import { isNullOrUndefined } from "util";
import { userInfo } from "os";
dotenv.config();

// s3 설정
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

// 업로드 s3 설정
const uploadS3 = multer({
    storage: multerS3({
        // access key: s3
        s3,
        bucket: "reactbloglec/upload",
        region: "ap-northeast-2",
        key(req, file, cb) {
            // 파일을 불러와서 보낼 때 파일 이름은
            // 우연의 일치로 같을 수가 있다.
            // 파일 이름에 업로드한 날짜를 심어주어서
            // * 파일 이름이 동일해도 서로 간에 구별이 가능하도록
            const ext = path.extname(file.originalname); // * 파일의 확장자
            const basename = path.basename(file.originalname, ext);
            cb(null, basename + new Date().valueOf() + ext); // 파일의 이름 + 업로드 날짜 + 확장자
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 }, // 파일 업로드 제한: 100메가
});

// @route POST api/post/image
// @desc CREATE a post
// @access Private // 글은 MainJuin인 개발자만 작성 가능
// 여러 개 업로드할 수도 있다 - 5개까지만
router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => {
    // next는 에러가 나면 다음으로 넘긴다
    /**
     * /image라는 주소를 통해서 사진 파일을 배열 형태로 업로드를 하면
     * async(req, res, next)로 주소가 들어오게 된다. // req로
     * 그래서 AWS S3로 보내게되면 그 주소가 req로 들어오게 되는데
     * 그 req 중에서 파일이라는 곳에 location 이라는 곳이 있는데
     * 파일이 배열 형태로 되어있다고 하면 // 여러 개를 업로드 해서
     * 그 각각을 location을 이용해서 출력해주세요
     *
     * 이거는 오로지 게시판에 글을 작성할 때
     * 파일을 보내고나서 올린 파일을 글 작성 페이지에 보여주기 위한 라우터일 뿐
     * 파일의 주소를 일단 저장해 놓고
     * 그리고 나서 추후에 글을 다 작성하고 나서 제출하기를 통해서
     * 글을 최종적으로 보낼 것인데... 이어서
     */
    try {
        // 업로드를 배열로 설정해서
        // 여러 개의 파일이 들어올 수 있다고 설정을 했기 때문에
        console.log(req.files.map((v) => v.location));
        res.json({ uploaded: true, url: req.files.map((v) => v.location) });
        // url이 배열로 되어있다면 주소를 쫙 뿌려주세요
    } catch (err) {
        console.error("err", err);
        // 에러 나면 업로드는 없는 것이고 url은 비어준다
        res.json({ uploaded: false, url: null });
    }
});

// ! infinite scroll 추가
// * @route get api/post
// * @desc more loading posts
// * @access public
// 모든 post를 검색을 하는 router를 작성
// api/post/ == api/post로 된 모든 주소를 검색할 수 있게 된다.
// express 서버에서 백엔드와 프론트를 같이 돌리려면 주소 체계를 다르게 해야한다.
// 프론트와 백엔드의 주소가 약간 달라야 프론트의 파일을 일반 유저들이 볼 수 있다
// req: requst == 브라우저에서 서버 쪽으로 요청, res: response == 서버에서 브라우저 쪽으로 응답
router.get("/skip/:skip", async (req, res) => {
    try {
        // * infinit Scroll
        const postCount = await Post.countDocuments(); // * Post 모델에 존재하는 내용의 갯수
        // api/post 주소로 하면 모든 포스트를 검색할 수 있도록
        // ! await는 Post.find()를 다 실행할 때까지 이후의 코드를 진행하지말고 대기하라는 뜻
        // find() - mongoose에서 제공하는 메서드 - 모든 Post를 찾아줌
        // const postFindResult = await Post.find(); // 기존 내용
        // * infinite scroll
        // * req.params.skip으로 넘어온 값을 숫자로 변환하여
        // * 그만큼의 값을 넘겨가며 검색을 진행한다.
        // * 6개를 기본 갯수로 지정하면, 처음에는 6개의 내용이 나타나고
        // * 그 다음부터는 이미 나온 6개를 넘기고(skip) 결과를 나타낸다.
        // * 대신 6개씩만(limit(6))
        // * 정렬하는데 가장 최신부터(sort({date: -1}))
        const postFindResult = await Post.find()
            .skip(Number(req.params.skip))
            .limit(6)
            .sort({ date: -1 });
        // * 카테고리 정보가 넘어오지 않아서 추가함
        const categoryFindResult = await Category.find();
        const result = { postFindResult, categoryFindResult, postCount };
        console.log(result, "All Post and Category Get");
        // ! 서버에서는 마지막 줄에 응답이 있어야
        // ! 이것이 없으면 브라우저에서는 요청이 fail 났다고 생각하기 땜시롱
        res.json(result);
        // ! 이렇게 그냥 res.json(result);로 보내면 front에서 받아볼 수가 없는데
        // * 그 이유는 postReducer.js에서 기존에는 action.payload 값에 postFindResult가 들어있었으나
        // * 지금은 안에 categoryFindResult와 같이 들어있으므로 조정을 해줘야 한다.
    } catch (err) {
        console.log("err", err);
        res.json({ msg: "더 이상 포스트가 없습니다." });
    }
});

// @route POST api/post
// @desc Create a post
// @access Private
// 글을 작성하는 라우터
// mongoose에서 제공하는 메서드를 사용한다면 async와 await를 사용해야 작동을 한다.
// 다른 방법으로는 exec()을 사용해서 작성한다.
/** uploadS3.none()
 * * post를 올릴 때에는 이미 s3에다가 이미지를 올리고 난 다음에
 * * 그 주소만을 저장하고 있으므로 별로도 s3에 뭔가를 올리지는 않는다.
 */
// ! 글을 작성할 때 카테고리를 넘겨주는 것을 추가
// ! 그리고 글을 작성하는 사람의 id값과 글의 id값을 연결시켜주는 작업 추가
router.post("/", auth, uploadS3.none(), async (req, res, next) => {
    // 글을 작성하는데 에러가 날 수도 있기 땜시롱
    try {
        // 에러가 날 수도 있는 코드
        console.log(req, "req");
        const { title, contents, fileUrl, creator, category } = req.body;
        const newPost = await Post.create({
            title,
            contents,
            fileUrl,
            creator: req.user.id, // ! Post 모델에서 creator가 ObjectId와 연결이 안되서 수정을 함
            /**원래는 아래와 같이 하나하나 적어줘야 한다. 그러나 2개 같다고 하면 생략이 가능하다
             * title: title,
             * ...
             */
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
        });

        // * await는 결과값이 나올때까지 다음으로 넘어가지 않음
        const findResult = await Category.findOne({
            // Category 모델에서 한 개만 찾아달라
            // categoryName이 요청한(req.body) category와 일치하는 것
            categoryName: category,
        });

        console.log("category find: ", findResult);

        if (isNullOrUndefined(findResult)) {
            // ! 카테고리를 처음 만들 경우에는 없을 것.
            const newCategory = await Category.create({
                // req.body에서 보내준 category로 새로운 카테고리를 만들어달라
                categoryName: category,
            });

            // Post - Category 연결
            // Post 모델에서 Id로 값을 찾아서 update를 해달라
            // Post 모델에서는 한 Post는 한 Category만 들어갈 수 있도록
            await Post.findByIdAndUpdate(newPost._id, {
                // * newPost는 위에서 만듦 - 117번째 줄, 이미 만들어진 것이다.
                // $push는 배열에다가 값을 넣어달라는 의미
                $push: { category: newCategory._id },
            });

            // Category - Post 연결
            // Category 모델에서는 한 카테고리에서 여러 개의 Post가 들어갈 수 있도록 배열로 설정
            await Category.findByIdAndUpdate(newCategory._id, {
                $push: { posts: newPost._id },
            });

            // 글을 작성한 사람과 Post를 연결
            // req에 user의 정보도 같이 딸려온다
            // 한 사람은 여러 개의 post를 작성할 수 있도록
            await User.findByIdAndUpdate(req.user.id, {
                // ! user model에서 작성한 것과 동일하게 이름을 지어줘야
                $push: { posts: newPost._id },
            });
        } else {
            // ! 카테고리가 있을 경우
            // * _id: 몽고 디비에서 id를 자동적으로 생성해주는데,
            // * id를 생성할 때 _id로 만들기 땜시롱 _id로 적어준다.
            await Category.findByIdAndUpdate(findResult, {
                $push: { posts: newPost._id },
            });

            await Post.findByIdAndUpdate(newPost._id, {
                $push: { category: findResult._id },
            });

            await User.findOneAndUpdate(req.user.id, {
                $push: {
                    posts: newPost._id,
                },
            });
        }

        return res.redirect(`/api/post/${newPost._id}`);
    } catch (err) {
        // 에러 발생시 처리하는 코드
        console.log("err!", err);
    }
});

// 새로운 페이지로 가는 주소를 적어줬다 // postsaga.js에서
// 서버 쪽에서 해당 id로 가는 라우터를 달아줘야 한다.
// @route POST api/post/:id
// @desc DetailPost
// @access Public
router.get("/:id", async (req, res, next) => {
    try {
        /**populate
         * Post 모델에서 Object ID를 통해서 연결된 것이 있다 // category, comment, user
         * 연결되어 있는 모델?로 넘어가서 만들어 달라
         */
        const post = await Post.findById(req.params.id)
            .populate("creator", "name") // 생략해서 작성
            .populate({ path: "category", name: "categoryName" }); // 이게 정석적인 방법
        post.views += 1;
        post.save();
        console.log(post);
        res.json(post); // ! 이게 없어가지고 postDetail의 내용이 안보였었던 것
    } catch (err) {
        console.error("err", err);
        next(err);
    }
});

// comment의 reducer와 saga를 받아줄 라우터
// ! @route Get api/post/:id/comments
// ! @desc Get All Comments
// 모든 comments를 가져오는 서버 라우터
// ! @access public
router.get("/:id/comments", async (req, res) => {
    try {
        const comment = await Post.findById(req.params.id).populate({
            // * Post 모델에서 id를 검색 // Post 아래에 댓글이 달리는 것이므로
            path: "comments",
        });
        // const previewComment = comment;
        const result = comment.comments; // comment의 내용 중에서 comments만 빼서 나오는거라 댓글이 없을 때는 빈 배열이 나온다.
        // console.log("comment: ", previewComment);
        console.log("result_comments: ", result);
        res.json(result);
    } catch (err) {
        console.error("error", err);
        // res.redirect("/");
    }
});

// * 글을 올리는 부분
router.post("/:id/comments", async (req, res, next) => {
    const newComment = await Comment.create({
        contents: req.body.contents,
        creator: req.body.userId,
        creatorName: req.body.userName,
        post: req.body.id, // ! 어떤 post의 comment인지
        date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });
    console.log("new comments: ", newComment);

    try {
        await Post.findByIdAndUpdate(req.body.id, {
            // ! req.body.id로 Post 내용을 찾아서
            $push: {
                comments: newComment._id,
            },
        });

        await User.findByIdAndUpdate(req.body.userId, {
            // ! 댓글 쓴 사람을 찾아서 그 사람이 쓴 댓글이 무엇인지
            $push: {
                comments: {
                    post_id: req.body.id,
                    comment_id: newComment._id,
                },
            },
        });

        res.json(newComment);
    } catch (err) {
        console.error("err", err);
        next(err);
    }
});

// * 글 삭제 부분
// @route Delete api/post/:id
// @desc Delete a post
// @access Private

// ! 에러났었음 axios.delete(`/api/post/${payload.id}`, config); 이렇게 값이 넘어오는다
// ! id로 맞춰줘야 값이 넘어올 수가 있다.
router.delete("/:id", auth, async (req, res) => {
    await Post.deleteMany({ _id: req.params.id }); // * req의 params에서 id에 해당하는 내용을 다 지워준다
    await Comment.deleteMany({ post: req.params.id }); // * Post처럼 id와 관련된 댓글을 다 지워준다
    await User.findByIdAndUpdate(req.user.id, {
        // * 어떤 사람이 작성한 글만을 삭제하는 것
        $pull: {
            // ! 이름은 User 모델에서 확인을 해야
            // * 배열에서 어떤 값을 넣어줄 때는 push
            // * 배열에서 어떤 값을 빼줄 대는 pull
            // * User 부분에서 배열 부분에서 값을 빼달라
            // * Post 배열에서 req.params.id
            // * 이 사람이 작성했던 많은 Post 중에 하나(id에 해당하는 것)를 빼주고
            posts: req.params.id,
            comments: { post_id: req.params.id },
        },
    });

    const CategoryUpdateResult = await Category.findOneAndUpdate(
        { posts: req.params.id },
        { $pull: { posts: req.params.id } },
        { new: true } // * 얘를 설정해줘야 update가 적용이 된다
    );

    if (CategoryUpdateResult.posts.length === 0) {
        // * 카테고리가 하나도 없을 경우에 id 값을 지워주게 된다?
        await Category.deleteMany({ _id: CategoryUpdateResult });
    }

    return res.json({ success: true });
});

// @route GET api/post/:id/edit
// @desc edit Post
// @access private
router.get("/:id/edit", auth, async (req, res, next) => {
    // * 여기서 인증을 넣지 않았는데
    // * front에서 edit 버튼 자체가 글 쓴 사람과 로그인한 사람 자체가
    // * 일치할 경우에만 버튼이 보이도록 작업을 했기 때문에 인증을 뺌
    // * front에서 보낼 때 인증 부분인 token을 넣어서 보냈기 때문에
    // * 여기서 auth를 넣어도 좋다. 프론트에서도 보안이 있고 서버에서도 보안을 넣기 때문에
    try {
        // * Post를 찾고 정보를 내보내줌
        const post = await Post.findById(req.params.id).populate(
            "creator",
            "name"
        );
        res.json(post);
    } catch (err) {
        console.error("err", err);
        // res.redirect("/");
    }
});

router.post("/:id/edit", auth, async (req, res, next) => {
    console.log("post_/api/post/:id/edit", req);
    // * req 안에 body가 있고 그 안에 title과 contents와 fileUrl, id를 분리 // 구조분해 문법
    const {
        body: { title, contents, fileUrl, id },
    } = req;

    try {
        const modified_post = await Post.findByIdAndUpdate(
            id, // * id로 Post를 찾고 아래의 내용을 수정함
            {
                title,
                contents,
                fileUrl,
                date: moment().format("YYYY-MM-DD hh:mm:ss"),
            },
            { new: true }
        );
        console.log("edit modified post", modified_post);
        res.redirect(`/api/post/${modified_post.id}`);
    } catch (err) {
        console.error("err", err);
        next(err);
    }
});

// * 카테고리 작업
router.get("/category/:categoryName", async (req, res, next) => {
    try {
        // * Category 모델에서 있는 posts 필드에서 내용을 찾으라
        const result = await Category.findOne(
            {
                categoryName: {
                    // * mongodb 기본 메서드를 참조해서 사용하는 방식
                    $regex: req.params.categoryName,
                    // 이 조건으로 대소문자를 구분하지 않고 검색이 가능하다
                    $options: "i", // * 덜 민감하게 정규표현식을 매칭하는 방식
                },
            },
            "posts"
        ).populate({ path: "posts" });
        console.log("get_categoryName Category Find Result: ", result);
        res.send(result);
    } catch (err) {
        console.error("err", err);
        next(err);
    }
});

// 모듈화
// export default를 하면 한 개만 내보낼 수 있는데,
// 장점으로는 다른 파일에서 해당 모듈을 사용하는데 지정하는 이름을 자유롭게 지을 수 있다
// 또한 괄호를 치지 않고 불러올 수 있다.
export default router;
// export const name = () => {}
// 이처럼 이름을 지어서 여러 개의 모듈을 내보낼 수 있다.
// 다른 파일에서 import로 불러들일 때 이름을 자유롭게 지을 수 없고
// name으로 작성한 이름으로만 불러올 수 있다.
// 또한 괄호{}안에 이름을 적어야지만 불러올 수 있다.
