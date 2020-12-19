// redux에서 쓰일 상태에 관한 타입들을 정의함
// redux-saga에서는 이렇게 3가지 패턴을 만들어서 프론트에서 각각 request타입을 보내주면
// success 든 failure 든 선택해서 값을 반환받게 된다.
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

// 로그아웃
// 이 다음에 설정해줄 것: authReducer.js, authSaga.js
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

// USER LOADING
export const USER_LOADING_REQUEST = "USER_LOADING_REQUEST";
export const USER_LOADING_SUCCESS = "USER_LOADING_SUCCESS";
export const USER_LOADING_FAILURE = "USER_LOADING_FAILURE";

// 에러를 clear
// CLEAR ERROR
export const CLEAR_ERROR_REQUEST = "CLEAR_ERROR_REQUEST";
export const CLEAR_ERROR_SUCCESS = "CLEAR_ERROR_SUCCESS";
export const CLEAR_ERROR_FAILURE = "CLEAR_ERROR_FAILURE";

// REGISTER
export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

// POSTS WRITE
export const POSTS_WRITE_REQUEST = "POSTS_WRITE_REQUEST";
export const POSTS_WRITE_SUCCESS = "POSTS_WRITE_SUCCESS";
export const POSTS_WRITE_FAILURE = "POSTS_WRITE_FAILURE";

// POSTS LOADING
export const POSTS_LOADING_REQUEST = "POSTS_LOADING_REQUEST";
export const POSTS_LOADING_SUCCESS = "POSTS_LOADING_SUCCESS";
export const POSTS_LOADING_FAILURE = "POSTS_LOADING_FAILURE";

// POSTS UPLOADING
export const POST_UPLOADING_REQUEST = "POST_UPLOADING_REQUEST";
export const POST_UPLOADING_SUCCESS = "POST_UPLOADING_SUCCESS";
export const POST_UPLOADING_FAILURE = "POST_UPLOADING_FAILURE";

// POST DETAIL LOADING
export const POST_DETAIL_LOADING_REQUEST = "POST_DETAIL_LOADING_REQUEST";
export const POST_DETAIL_LOADING_SUCCESS = "POST_DETAIL_LOADING_SUCCESS";
export const POST_DETAIL_LOADING_FAILURE = "POST_DETAIL_LOADING_FAILURE";

// POST DELETE
export const POST_DELETE_REQUEST = "POST_DELETE_REQUEST";
export const POST_DELETE_SUCCESS = "POST_DELETE_SUCCESS";
export const POST_DELETE_FAILURE = "POST_DELETE_FAILURE";

// Comment Loading
export const COMMENT_LOADING_REQUEST = "COMMENT_LOADING_REQUEST";
export const COMMENT_LOADING_SUCCESS = "COMMENT_LOADING_SUCCESS";
export const COMMENT_LOADING_FAILURE = "COMMENT_LOADING_FAILURE";

// Commnet uploading
export const COMMENT_UPLOADING_REQUEST = "COMMENT_UPLOADING_REQUEST";
export const COMMENT_UPLOADING_SUCCESS = "COMMENT_UPLOADING_SUCCESS";
export const COMMENT_UPLOADING_FAILURE = "COMMENT_UPLOADING_FAILURE";

// Post Edit Loading
export const POST_EDIT_LOADING_REQUEST = "POST_EDIT_LOADING_REQUEST";
export const POST_EDIT_LOADING_SUCCESS = "POST_EDIT_LOADING_SUCCESS";
export const POST_EDIT_LOADING_FAILURE = "POST_EDIT_LOADING_FAILURE";

// Post Edit Uploading
export const POST_EDIT_UPLOADING_REQUEST = "POST_EDIT_UPLOADING_REQUEST";
export const POST_EDIT_UPLOADING_SUCCESS = "POST_EDIT_UPLOADING_SUCCESS";
export const POST_EDIT_UPLOADING_FAILURE = "POST_EDIT_UPLOADING_FAILURE";

// Category Find
export const CATEGORY_FIND_REQUEST = "CATEGORY_FIND_REQUEST";
export const CATEGORY_FIND_SUCCESS = "CATEGORY_FIND_SUCCESS";
export const CATEGORY_FIND_FAILURE = "CATEGORY_FIND_FAILURE";

// Search
export const SEARCH_REQUEST = "SEARCH_REQUEST";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_FAILURE = "SEARCH_FAILURE";

// Password Edit
export const PASSWORD_EDIT_UPLOADING_REQUEST =
    "PASSWORD_EDIT_UPLOADING_REQUEST";
export const PASSWORD_EDIT_UPLOADING_SUCCESS =
    "PASSWORD_EDIT_UPLOADING_SUCCESS";
export const PASSWORD_EDIT_UPLOADING_FAILURE =
    "PASSWORD_EDIT_UPLOADING_FAILURE";