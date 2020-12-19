import axios from "axios";
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
    POSTS_LOADING_FAILURE,
    POSTS_LOADING_SUCCESS,
    POSTS_LOADING_REQUEST,
    POST_UPLOADING_REQUEST,
    POST_UPLOADING_SUCCESS,
    POST_UPLOADING_FAILURE,
    POST_DETAIL_LOADING_SUCCESS,
    POST_DETAIL_LOADING_REQUEST,
    POST_DETAIL_LOADING_FAILURE,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAILURE,
    POST_EDIT_LOADING_REQUEST,
    POST_EDIT_LOADING_SUCCESS,
    POST_EDIT_LOADING_FAILURE,
    POST_EDIT_UPLOADING_SUCCESS,
    POST_EDIT_UPLOADING_FAILURE,
    POST_EDIT_UPLOADING_REQUEST,
    CATEGORY_FIND_REQUEST,
    CATEGORY_FIND_FAILURE,
    CATEGORY_FIND_SUCCESS,
    SEARCH_SUCCESS,
    SEARCH_FAILURE,
    SEARCH_REQUEST,
} from "../types";

// all posts load
const loadPostAPI = (payload) => {
    return axios.get(`/api/post/skip/${payload}`);
};

function* loadPost(action) {
    try {
        // * action.payload는 infinit scroll 땜에 넣음
        const result = yield call(loadPostAPI, action.payload); // loadPostAPI에서 값을 불러옴
        console.log("loadPost_result", result);
        yield put({
            type: POSTS_LOADING_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });
    } catch (err) {
        yield put({
            type: POSTS_LOADING_FAILURE,
            payload: err,
        });
        // yield push("/"); // 글 불러오는데 실패하면 home으로 가도록
    }
}

function* watchLoadPosts() {
    yield takeEvery(POSTS_LOADING_REQUEST, loadPost);
}

// POST UPLOAD
// 인증 받은 사람만이 업로드를 할 수 있도록 설정
// payload 안에 글도 있고 token 값도 있고 등등
const uploadPostAPI = (payload) => {
    // * 인증받는 부분
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    };
    const token = payload.token;
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return axios.post("/api/post", payload, config);
};

function* uploadPost(action) {
    // * front에서 받는 값: action
    try {
        console.log("upload post function", action);
        // * 어떤 값을 가지고 함수를 불러서
        // * 나오는 result값에
        const result = yield call(uploadPostAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("uploadPostAPI", result);

        yield put({
            type: POST_UPLOADING_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });

        // * front에다가 주소를 하나 보내줌
        // * 글을 작성한 detail page로 넘어갈 수 있도록
        yield put(push(`/post/${result.data._id}`));
    } catch (err) {
        yield put({
            type: POST_UPLOADING_FAILURE,
            payload: err,
        });
        yield put(push("/")); // 글 불러오는데 실패하면 home으로 가도록
    }
}

function* watchUpLoadPosts() {
    yield takeEvery(POST_UPLOADING_REQUEST, uploadPost);
}
// ! 서버 쪽으로 가는 router도 달아줘야 한다.

// POST DETAIL
const loadPostDetailAPI = (payload) => {
    // * postDetail을 갸져올 때는 token이 필요가 없다.
    // * 일반 유저도 글의 내용을 볼 수 있어야 하기 때문에
    /**PostDetail.js에서 넘겨주는 값
     * type: POST_DETAIL_LOADING_REQUEST,    
       payload: req.match.params.id // * 주소창에서 id값을 빼온다.
     */
    console.log(payload); // * 주소창의 id 값?
    return axios.get(`/api/post/${payload}`);
};

function* loadPostDetail(action) {
    console.log("hello");
    // * front에서 받는 값: action
    try {
        const result = yield call(loadPostDetailAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("loadPostDetailAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: POST_DETAIL_LOADING_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });
    } catch (err) {
        yield put({
            type: POST_DETAIL_LOADING_FAILURE,
            payload: err,
        });
        yield put(push("/")); // 글 불러오는데 실패하면 home으로 가도록
    }
}

function* watchLoadPostDetail() {
    yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

// POST DELETE
const postDeleteAPI = (payload) => {
    // ! 지우는 작업은 오로지 글쓴이만 가능
    const config = {
        // * 인증
        headers: {
            "Content-type": "application/json",
        },
    };
    const token = payload.token;

    if (token) {
        config.headers["x-auth-token"] = token;
    }

    return axios.delete(`/api/post/${payload.id}`, config);
};

function* postDelete(action) {
    // * front에서 받는 값: action
    try {
        const result = yield call(postDeleteAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("postDeleteAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: POST_DELETE_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });
        yield put(push("/"));
    } catch (err) {
        yield put({
            type: POST_DELETE_FAILURE,
            payload: err,
        });
    }
}

function* watchPostDelete() {
    yield takeEvery(POST_DELETE_REQUEST, postDelete);
}

// * 글 수정
// POST Edit load
const editPostLoadAPI = (payload) => {
    // ! 글 수정 작업은 오로지 글쓴이만 가능
    const config = {
        // * 인증
        headers: {
            "Content-type": "application/json",
        },
    };
    const token = payload.token;

    if (token) {
        config.headers["x-auth-token"] = token;
    }

    // * 인증된 사람만 post edit의 정보를 가져올 수가 있다
    return axios.get(`/api/post/${payload.id}/edit`, config);
};

function* editPostLoad(action) {
    // * front에서 받는 값: action
    try {
        const result = yield call(editPostLoadAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("editPostLoadAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: POST_EDIT_LOADING_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });
    } catch (err) {
        yield put({
            type: POST_EDIT_LOADING_FAILURE,
            payload: err,
        });
        yield put(push("/")); // * 글 수정 실패햐면 홈으로
    }
}

function* watchEditPostLoad() {
    yield takeEvery(POST_EDIT_LOADING_REQUEST, editPostLoad);
}

// * 글 수정
// POST Edit Upload
// ! payload 안에 token 값이 있다.
const editPostUploadAPI = (payload) => {
    // ! 글 수정 작업은 오로지 글쓴이만 가능 == 인증된 사람만
    const config = {
        // * 인증
        headers: {
            "Content-type": "application/json",
        },
    };
    // * config 앞에는 payload가 있어야
    const token = payload.token; // * 이 문장이 실행이 가능

    if (token) {
        config.headers["x-auth-token"] = token;
    }

    // * 인증된 사람만 post edit의 정보를 가져올 수가 있다
    // * payload: 넘어온 값을 넘겨줌
    return axios.post(`/api/post/${payload.id}/edit`, payload, config);
};

function* editPostUpload(action) {
    // * front에서 받는 값: action
    try {
        const result = yield call(editPostUploadAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("editPostUploadAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: POST_EDIT_UPLOADING_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });

        yield put(push(`/post/${result.data._id}`));
    } catch (err) {
        yield put({
            type: POST_EDIT_UPLOADING_FAILURE,
            payload: err,
        });
        yield put(push("/")); // * 글 수정 실패햐면 홈으로
    }
}

function* watchEditPostUpload() {
    yield takeEvery(POST_EDIT_UPLOADING_REQUEST, editPostUpload);
}

// * 카테고리 검색
// Category find
const categoryFindAPI = (payload) => {
    // * encodeURIComponent: URI 특정 문자를 UTF-8로 인코딩해서 연속된 문자로 나타낸다.
    // 한글같은 문자로는 주소창에 이상한 문자로 나타나는 경우가 있는데
    // 그런 문자를 UTF-8로 인코딩해서 문자로 변환을 해준다
    return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
};

function* categoryFind(action) {
    // * front에서 받는 값: action
    try {
        const result = yield call(categoryFindAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("categoryFindAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: CATEGORY_FIND_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });
    } catch (err) {
        yield put({
            type: CATEGORY_FIND_FAILURE,
            payload: err,
        });
    }
}

function* watchCategoryFind() {
    yield takeEvery(CATEGORY_FIND_REQUEST, categoryFind);
}

// * 제목 검색
// Search
const searchAPI = (payload) => {
    // * encodeURIComponent: URI 특정 문자를 UTF-8로 인코딩해서 연속된 문자로 나타낸다.
    // 한글같은 문자로는 주소창에 이상한 문자로 나타나는 경우가 있는데
    // 그런 문자를 UTF-8로 인코딩해서 문자로 변환을 해준다
    return axios.get(`/api/search/${encodeURIComponent(payload)}`);
};

function* search(action) {
    // * front에서 받는 값: action
    try {
        const result = yield call(searchAPI, action.payload); // uploadPostAPI에서 값을 불러옴
        console.log("searchAPI_postsaga", result); // API에서 넘어온 결과값들 // 글의 내용들이나 status값 등등
        // result의 data 쪽에서 creator나 date나 그런 글의 내용 관련 정보

        yield put({
            type: SEARCH_SUCCESS,
            payload: result.data, // console.log를 확인하자
        });

        // * 카테고리는 버튼을 통한 링크 이동이 있었으나
        // ! 검색은 단순히 입력한 내용을 토대로 검색을 진행하기 때문에 아래의 기능이 필요하다.
        yield put(push(`/search/${encodeURIComponent(action.payload)}`));
    } catch (err) {
        yield put({
            type: SEARCH_FAILURE,
            payload: err,
        });
    }
}

function* watchSearch() {
    yield takeEvery(SEARCH_REQUEST, search);
}

export default function* postSaga() {
    yield all([
        fork(watchLoadPosts),
        fork(watchUpLoadPosts),
        fork(watchLoadPostDetail),
        fork(watchPostDelete),
        fork(watchEditPostLoad),
        fork(watchEditPostUpload),
        fork(watchCategoryFind),
        fork(watchSearch),
    ]);
}
