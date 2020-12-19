import React, { Fragment } from "react";
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    Row,
    Button,
    Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMouse } from "@fortawesome/free-solid-svg-icons";

/**여기가 presenter로서 기능을 함
 * PostCardList.js에서 값을 가져오는 Container로서 역할을 한 다음 PostCardOne.js로 값을 보내서
 * presenter로서 PostCardOne.js를 이용함
 */
const PostCardOne = (props) => {
    const posts = props.posts;

    return (
        <Fragment>
            {
                // posts가 배열이라고 한다면
                // posts안에 _id, title, fileUrl, comments, views
                // mongoDB는 각각 값에 _id를 넣어준다
                // col-md-4: col은 12칸 / 4여서 카드를 3칸 보여준다. 각각 카드가 4칸을 차지한다고 생각하면 됨
                Array.isArray(posts)
                    ? posts.map(({ _id, title, fileUrl, comments, views }) => {
                          return (
                              <div key={_id} className="col-md-4">
                                  {/* 카드 어느쪽을 클릭을 하든 원하는 곳으로 날려보내기 위해서 링크를 달아준다 
                            Router.js를 봐야한다. <Route path="/post/:id" exact component={PostDetail} />
                            카드를 클릭을 해주면 PostDetail 로 넘어가는 구조*/}
                                  <Link
                                      to={`/post/${_id}`}
                                      className="text-dark text-decoration-none"
                                  >
                                      <Card className="mb-3">
                                          {/* alt 태그는 이미지 태그에서 이미지를 렌더링되지 못했을 때 나타낼 문자열 */}
                                          <CardImg
                                              top
                                              alt="카드 이미지"
                                              src={fileUrl}
                                          />
                                          <CardBody>
                                              <CardTitle className="text-truncate d-flex justify-content-between">
                                                  {/* text-truncate: 제목이 길다면 다 표시하지 말고 ...로 표시 
                                            justify-content-between: 양 사이드로 값을 넣는 것*/}
                                                  <span className="text-truncate">
                                                      {title}
                                                  </span>
                                                  <span>
                                                      <FontAwesomeIcon
                                                          icon={faMouse}
                                                      />
                                                      &nbsp;&nbsp;
                                                      <span>{views}</span>
                                                  </span>
                                              </CardTitle>
                                              <Row>
                                                  <Button
                                                      color="primary"
                                                      className="p-2 btn-block"
                                                  >
                                                      {/* 댓글 갯수 */}
                                                      More
                                                      <Badge color="light">
                                                          {comments.length}
                                                      </Badge>
                                                  </Button>
                                              </Row>
                                          </CardBody>
                                      </Card>
                                  </Link>
                              </div>
                          );
                      })
                    : ""
            }
        </Fragment>
    );
};

export default PostCardOne;
