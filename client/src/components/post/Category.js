import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "reactstrap";

const Category = ({ posts }) => {
    console.log("category props_posts: ", posts);
    // * 배열 안에 categoryName: 과 posts: [] 형태로 값이 들어온다.
    return (
        <Fragment>
            {Array.isArray(posts)
                ? posts.map(({ _id, categoryName, posts }) => (
                      // * 똑같은 것을 그릴 때에는 반드시 key를 이용해서 고유 값을 넣어줘야 에러가 안뜬다.
                      <div key={_id} className="mx-1 mt-1 my_category">
                          <Link
                              to={`/post/category/${categoryName}`}
                              className="text-dark text-decoration-none"
                          >
                              <span className="ml-1">
                                  <Button color="info">
                                      {categoryName}{" "}
                                      <Badge color="light">
                                          {posts.length}
                                      </Badge>
                                  </Button>
                              </span>
                          </Link>
                      </div>
                  ))
                : ""}
        </Fragment>
    );
};

export default Category;
