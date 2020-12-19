import React, { useEffect, Fragment, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POSTS_LOADING_REQUEST } from "../../redux/types";
import { Helmet } from "react-helmet";
import { Alert, Row } from "reactstrap";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import PostCardOne from "../../components/post/PostCardOne";
import Category from "../../components/post/Category";

const PostCardList = () => {
    // 먼저 redux 작업을 하고 진행한다.
    // ! redux/reducers/index.js에서 post: postReducer
    // posts: redux/reducers/postReducer.js에서  initialState의 posts: []
    const { posts, categoryFindResult, loading, postCount } = useSelector(
        (state) => state.post
    );
    console.log("posts_postcardlist", posts);

    const dispatch = useDispatch();

    useEffect(() => {
        // * 처음 넘겨주는 값은 0
        // * infinite scroll // 총 postCount에서 6을 빼주면서 count가 없어질 때까지 진행
        dispatch({ type: POSTS_LOADING_REQUEST, payload: 0 });
        // dispatch가 변할 때 마다
        // 그러니까 post 로딩을 요청할 때마다
    }, [dispatch]);

    // * infinit scroll
    // * useRef는 전 생애주기에서 살아남아 있는 메서드
    // * useEffect나 useCallback안에서 상태 값들을 저장하고 빼오기 위해서
    // * 일반적인 useState로 접근을 할 수가 없다.
    // * 그래서 useEffect나 useCallback안에 변화된 값들을 접근하기 위해서 사용
    const skipNumberRef = useRef(0); // * 처음 값은 0
    const postCountRef = useRef(0);
    const endMsg = useRef(false);

    postCountRef.current = postCount - 6;

    const observer = useRef();

    const lastPostElementRef = useCallback(
        (node) => {
            if (loading) return;
            // observer가 현재 달린 곳에 IntersectionObserver를 새로 만드는데
            // 이 IntersectionObserver는 임계값에 하나라도 cross가 되면(<div>의 내용이 1px이라도 보이면)
            // IntersectionObserver의 객체의 콜백 함수가 실행이 된다.
            observer.current = new IntersectionObserver((entries) => {
                console.log("lastPostElementRef entries: ", entries);
                /**콘솔 결과
                 * entries 안에
                 * [IntersectionObserverEntry] 안에
                 * 0: 안에
                 * isIntersecting을 주목
                 * 다 안내렸을 때: isIntersecting: false
                 * 다 내렸을 때: isIntersecting: true
                 */
                // IntersectionObserver의 콜백함수가 작동
                // 계산함
                if (entries[0].isIntersecting) {
                    let remainPostCount =
                        postCountRef.current - skipNumberRef.current;
                    if (remainPostCount >= 0) {
                        dispatch({
                            type: POSTS_LOADING_REQUEST,
                            payload: skipNumberRef.current + 6,
                        });
                        skipNumberRef.current += 6;
                    } else {
                        // * 더 이상 포스트는 없습니다 라는 메세지가 나타난다.
                        endMsg.current = true;
                    }
                }
            });

            // IntersectionObserver의 콜백함수가 작동이 되었다고 하면
            // 한번 끊어주고 > 원하는 값을 계산하기 위해서
            if (observer.current) observer.current.disconnect();

            if (node) {
                console.log("node: ", node);
                // 끊어준 콜백함수를 다시 관측을 시작하라고 명령함
                // 끊어주지 않고 계속 계산을 하면 값이 계속 변할 수 있으므로
                observer.current.observe(node);
                // * <div ref={lastPostElementRef}>{loading && GrowingSpinner}</div> 이게 넘어오고 있는 것
            }
        },
        [dispatch, loading]
    );

    return (
        <Fragment>
            <Helmet title="Home" />
            <Row className="border-bottom border-top border-primary py-2 mb-3">
                <Category posts={categoryFindResult} />
            </Row>
            {/* 여기 posts는 redux에서 가져온 posts */}
            <Row>{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}</Row>

            {/* 아래의 div 값이 단 1px이라도 보인다면 */}
            {/* infinit scroll - intersection observer // 최신의 브라우저에서만 사용가능 */}
            {/* intersection observer 사용방법은 감지가 될 칸을 만들어서 Ref값을 직접 dom에다가 달아줘야 */}
            {/* 6개의 칸을 보고 내려서 그 아래 div안에 1px이라도 나와서 */}
            {/* lastPostElementRef이 함수가 감지를 하게 된다고 하면 */}
            {/* 서버쪽에다가 요청을 보내서 post를 받을 것이다. */}
            {/* loading(과 GrowingSpinner)은 post를 다 받으면 사라진다 */}
            <div ref={lastPostElementRef}>{loading && GrowingSpinner}</div>
            {/* 로딩이 끝났는데 endMsg가 보인다고 하면 서버쪽에서 post를 다 보낸 것(더는 없다). */}
            {loading ? (
                "" // * 로딩 중이면 아무것도 안보여줌
            ) : endMsg ? ( // * 로딩이 끝났는데 endMsg가 존재하면
                <div>
                    <Alert
                        color="danger"
                        className="text-center font-weight-border"
                    >
                        더 이상의 포스트는 없습니다
                    </Alert>
                </div>
            ) : (
                "" // * 로딩이 끝났는데 endMsg가 없다면 > 아직 post가 남아있는 것
            )}
        </Fragment>
    );
};

export default PostCardList;
