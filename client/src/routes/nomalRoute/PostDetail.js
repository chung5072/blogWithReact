import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet"; // 브라우저 상단의 창 이름을 바꿔줌
import {
    POST_DETAIL_LOADING_REQUEST,
    POST_DELETE_REQUEST,
    USER_LOADING_REQUEST,
} from "../../redux/types";
import { Button, Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import { GrowingSpinner } from "../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencilAlt,
    faCommentDots,
    faMouse,
} from "@fortawesome/free-solid-svg-icons";
import BalloonEditor from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
import Comments from "../../components/comments/Comments";

// 서버로부터 정보를 전송받아서 주로 그려주는 역할
const PostDetail = (req) => {
    const dispatch = useDispatch();
    // * postReducer.js에서 initialState를 가져옴
    const { postDetail, creatorId, title, loading } = useSelector(
        (state) => state.post
    );
    // * authReducer.js에서 initialState를 가져옴
    const { userId, userName } = useSelector((state) => state.auth);
    // * comment: commentReducer
    const { comments } = useSelector((state) => state.comment);

    console.log("PostDetail에서 받은 정보: ", req);

    useEffect(() => {
        // * dispatch를 통해서 내용들을 불러올 수 있도록
        dispatch({
            type: POST_DETAIL_LOADING_REQUEST,
            // detail을 클릭하게 되었을 때, post의 id가 담긴다
            // req로 들어오는 정보에 의하면 match안에 params안에 id로해서 담겨져 있는 정보이다
            payload: req.match.params.id,
        });

        // 서버쪽에 요청, id를 가지고 post를 검색해서 post의 내용을 가져오도록
        // 글 쓴 사람만이 delete 버튼을 볼 수 있도록
        dispatch({
            type: USER_LOADING_REQUEST,
            payload: localStorage.getItem("token"), // localStorage에서 token 값을 가져옴
            // localStorage는 F12에서 Application에서 Storage에서 localStorage가 있다
            // 관리자 도구/응용프로그램/저장소/로컬저장소 - 키 / 값으로 쌍으로 구성됨
        });
    }, [dispatch, req.match.params.id]); // ! 여기에서 의존성 값은 []를 넣어주지 않는다면 무한 반복이 된다.
    // dispatch, req.match.params.id

    // 글을 지워주는 버튼
    // 글 저자만 보일 수 있게
    const onDeleteClick = () => {
        // * 지우는 것은 딱히 상태변화가 없기 때문에 PostSaga.js만 작업한다.
        dispatch({
            type: POST_DELETE_REQUEST,
            payload: {
                id: req.match.params.id, // 글의 id를 주소에서 떼와서
                token: localStorage.getItem("token"), // delete는 오로지 글 쓴 사람만이 할 수 있도록 인증을 넣을 것
            },
        });
    };

    const EditButton = (
        <Fragment>
            <Row className="d-flex justify-content-center pb-3">
                <Col className="col-md-3 mr-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
                <Col className="col-md-3 mr-md-3">
                    <Link
                        to={`/post/${req.match.params.id}/edit`}
                        className="btn btn-success btn-block"
                    >
                        Edit Post
                    </Link>
                </Col>
                <Col className="col-md-3">
                    <Button
                        className="btn-block btn-danger"
                        onClick={onDeleteClick}
                    >
                        Delete
                    </Button>
                </Col>
            </Row>
        </Fragment>
    );

    // 본인 인증이 되지 않은 경우
    const HomeButton = (
        <Fragment>
            <Row className="d-flex justify-content-center pb-3">
                <Col className="col-sm-12 com-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
            </Row>
        </Fragment>
    );

    const Body = (
        <>
            {userId === creatorId ? EditButton : HomeButton}
            <Row className="border-bottom border-top border-primary p-3 mb-3 d-flex justify-content-between">
                {(() => {
                    if (postDetail && postDetail.creator) {
                        return (
                            <Fragment>
                                <div className="font-weight-bold text-big">
                                    <span className="mr-3">
                                        <Button color="info">
                                            {postDetail.category.categoryName}
                                        </Button>
                                    </span>
                                    {postDetail.title}
                                </div>
                                <div className="align-self-end">
                                    {postDetail.creator.name}
                                </div>
                            </Fragment>
                        );
                    }
                })()}
            </Row>
            {postDetail && postDetail.comments ? (
                <Fragment>
                    <div className="d-flex justify-content-end align-items-baseline small">
                        <FontAwesomeIcon icon={faPencilAlt} />
                        &nbsp;
                        <span>{postDetail.date}</span>
                        &nbsp;&nbsp;
                        <FontAwesomeIcon icon={faCommentDots} />
                        &nbsp;
                        <span>{postDetail.comments.length}</span>
                        &nbsp;&nbsp;
                        <FontAwesomeIcon icon={faMouse} />
                        <span>{postDetail.views}</span>
                    </div>
                    {/* CKEditor는 볼 때도 에디터를 이용해서 봐야한다 그때 이용하는 것이 balloon editor이다 */}
                    <Row className="mb-3">
                        <CKEditor
                            editor={BalloonEditor}
                            data={postDetail.contents}
                            config={editorConfiguration}
                            disabled="true" // * 에디터를 이용하지만 작성은 할 수 없도록 제한
                        />
                    </Row>
                    <Row>
                        {/* 댓글을 보일 수 있는 부분 */}
                        <Container className="mb-3 border border-blue rounded">
                            {/* comments가 배열이라고 하면 
                            3항 연산자를 사용*/}
                            {Array.isArray(comments)
                                ? comments.map(
                                      // ! Comment 모델에 있는 내용
                                      ({
                                          contents,
                                          creator,
                                          date,
                                          _id,
                                          creatorName,
                                      }) => (
                                          // * 값에 변화되는 부분이 있다면 react가 변화되는 부분을 캐치해줌
                                          <div key={_id}>
                                              <Row className="justify-content-between p-2">
                                                  <div className="font-weight-bold">
                                                      {/* 작성자 이름이 있다면 해당 이름을 적어주고 없으면 고유 ID를 적어줌 */}
                                                      {creatorName
                                                          ? creatorName
                                                          : creator}
                                                  </div>
                                                  <div className="text-small">
                                                      <span className="font-weight-bold">
                                                          {/* data를 띄어쓰기(" ")로 구분을 하여 나눠준 다음에 첫번째 값을 적어줌
                                                        이건 댓글의 날짜를 적을 때, 년-월-시를 굵게 표시해주기 위해서 작성함 */}
                                                          {date.split(" ")[0]}
                                                      </span>
                                                      <span className="font-weight-light">
                                                          {" "}
                                                          {date.split(" ")[1]}
                                                      </span>
                                                  </div>
                                              </Row>
                                              <Row className="p-2">
                                                  <div>{contents}</div>
                                              </Row>
                                              <hr />
                                          </div>
                                      )
                                  )
                                : "Creator"}
                            <Comments
                                // ! 넘겨주는 id는 post의 id // 어떤 post의 comments인지
                                id={req.match.params.id}
                                userId={userId} // ! auth 부분에서 userId를 가져오고 있다. // 로그인한 사람
                                userName={userName}
                            />
                        </Container>
                    </Row>
                </Fragment>
            ) : (
                <h1>hi!</h1>
            )}
        </>
    );

    return (
        <div>
            <Helmet title={`Post | ${title}`} />
            {loading === true ? GrowingSpinner : Body}
        </div>
    );
};

export default PostDetail;
