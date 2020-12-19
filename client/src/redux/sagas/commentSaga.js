import axios from "axios";
import { put, takeEvery, all, call, fork } from "redux-saga/effects";
import {
    COMMENT_LOADING_FAILURE,
    COMMENT_LOADING_SUCCESS,
    COMMENT_LOADING_REQUEST,
    COMMENT_UPLOADING_FAILURE,
    COMMENT_UPLOADING_REQUEST,
    COMMENT_UPLOADING_SUCCESS,
} from "../types";
import { push } from "connected-react-router";

// Load Comment
// * 값이 올때 id 값만 넘어온다.
const loadCommentsAPI = (payload) => {
    console.log("load_comment_api: ", payload);
    // post의 id를 넘겨줄 것
    return axios.get(`/api/post/${payload}/comments`);
};

function* loadComments(action) {
    console.log("load_comments_function: ", action);
    try {
        const result = yield call(loadCommentsAPI, action.payload);
        console.log("load_comment_result: ", result);

        yield put({
            type: COMMENT_LOADING_SUCCESS,
            payload: result.data,
        });
    } catch (err) {
        console.error("err, err");
        yield put({
            type: COMMENT_LOADING_FAILURE,
            payload: err,
        });

        yield put(push("/"));
    }
}

function* watchLoadComments() {
    yield takeEvery(COMMENT_LOADING_REQUEST, loadComments);
}

// Upload Comment
// * payload 값 안에는 댓글이나 글쓴이 내용등이 담겨올 수가 있기 때문에 id를 따로 빼서 본다.
const uploadCommentAPI = (payload) => {
    console.log("upload_comment_api: ", payload.id);
    // post의 id를 넘겨줄 것
    // ! 에러났었음 // 값을 넘겨주고나서 받지 않고 있었다.
    return axios.post(`/api/post/${payload.id}/comments`, payload);
};

function* uploadComment(action) {
    console.log("upload_comments_function: ", action);
    try {
        const result = yield call(uploadCommentAPI, action.payload);
        console.log("upload_comment_result: ", result);

        yield put({
            type: COMMENT_UPLOADING_SUCCESS,
            payload: result.data,
        });
    } catch (err) {
        console.error("err, err");
        yield put({
            type: COMMENT_UPLOADING_FAILURE,
            payload: err,
        });

        yield put(push("/"));
    }
}

function* watchUploadComment() {
    yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComment);
}

export default function* commentSaga() {
    yield all([fork(watchLoadComments), fork(watchUploadComment)]);
}
