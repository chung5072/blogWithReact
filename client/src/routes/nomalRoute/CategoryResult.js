import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CATEGORY_FIND_REQUEST } from "../../redux/types";
import { Row } from "reactstrap";
import PostCardOne from "../../components/post/PostCardOne";

const CategoryResult = () => {
    const dispatch = useDispatch();
    // * useParams: 주소에서 params 부분을 따로 때어올 수 있는
    let { categoryName } = useParams();
    const { categoryFindResult } = useSelector((state) => state.post);
    console.log("categoryFindResult: ", categoryFindResult);
    console.log("categoryName: ", categoryName);

    useEffect(() => {
        dispatch({
            type: CATEGORY_FIND_REQUEST,
            payload: categoryName,
        });
    }, [dispatch, categoryName]);

    return (
        <div>
            <h1>Category: "{categoryName}"</h1>
            <Row>
                <PostCardOne posts={categoryFindResult.posts} />
            </Row>
        </div>
    );
};

export default CategoryResult;
