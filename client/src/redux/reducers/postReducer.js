import {
    POSTS_LOADING_REQUEST,
    POSTS_LOADING_SUCCESS,
    POSTS_LOADING_FAILURE,
    POSTS_WRITE_REQUEST,
    POSTS_WRITE_SUCCESS,
    POSTS_WRITE_FAILURE,
    POST_DETAIL_LOADING_REQUEST,
    POST_DETAIL_LOADING_SUCCESS,
    POST_DETAIL_LOADING_FAILURE,
    POST_UPLOADING_REQUEST,
    POST_UPLOADING_SUCCESS,
    POST_UPLOADING_FAILURE,
    POST_EDIT_LOADING_REQUEST,
    POST_EDIT_LOADING_SUCCESS,
    POST_EDIT_LOADING_FAILURE,
    POST_EDIT_UPLOADING_REQUEST,
    POST_EDIT_UPLOADING_SUCCESS,
    POST_EDIT_UPLOADING_FAILURE,
    CATEGORY_FIND_REQUEST,
    CATEGORY_FIND_SUCCESS,
    CATEGORY_FIND_FAILURE,
    SEARCH_REQUEST,
    SEARCH_SUCCESS,
    SEARCH_FAILURE,
} from "../types";

const initialState = {
    isAuthenticated: null, // 인증이 된 사람만 글을 쓸 수 있도록 하기 위해서
    posts: [],
    postDetail: "",
    postCount: "", // 추후에 infinity scroll을 사용할 때 총 post의 갯수를 의미
    loading: false,
    error: "",
    creatorId: "",
    categoryFindResult: "", // 카테고리 검색 기능을 구현하기 위함
    title: "", // PostCard를 담을 title
    searchBy: "",
    searchResult: "",
};

// ! server나 saga에서는 하는 내용이 명확, 어디선가 정보를 받고 그것을 뿌려준다
// ! reducer 부분은 작업을 계속해보면서 상태를 어떻게 가져가면 좋을지 판단을 해야한다.
// ! > 계락적으로 작성해보고 상태보고 수정

export default function (state = initialState, action) {
    switch (action.type) {
        case POSTS_LOADING_REQUEST:
            return {
                ...state, // react를 비교를 해야하니까 처음 값을 복사해서 가져옴
                // * 검색이랑 카테고리에서 검색을 하면 기존 post와 겹칠까봐 posts를 빈 배열로 놓았는데
                // * 다른 곳에서 posts: [] 작업을 했으므로
                // * infinit scroll에서 기존 posts를 다시 보여주기 위해서 없에줌
                // * 누적이 된다 이말이야
                // posts: [],
                loading: true,
            };
        case POSTS_LOADING_SUCCESS:
            return {
                ...state,
                // * route/api/post.js에서 수정이 있어서
                // * ...action.payload에서 .postFindResult가 추가됨.
                posts: [...state.posts, ...action.payload.postFindResult], // 기존에 작성한 글에서 추가로 작성한 글을 더해서 배열에 저장
                categoryFindResult: action.payload.categoryFindResult,
                postCount: action.payload.postCount,
                loading: false,
            };
        case POSTS_LOADING_FAILURE:
            return {
                ...state,
                loading: false,
            };
        case POSTS_WRITE_REQUEST:
            return {
                ...state,
                posts: [],
                loading: true,
            };
        case POSTS_WRITE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case POSTS_WRITE_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case POST_DETAIL_LOADING_REQUEST:
            return {
                ...state,
                posts: [],
                loading: true,
            };
        case POST_DETAIL_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                postDetail: action.payload,
                creatorId: action.payload.creator._id,
                title: action.payload.title,
            };
        case POST_DETAIL_LOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case POST_UPLOADING_REQUEST:
            return {
                ...state,
                posts: [],
                loading: true,
            };
        case POST_UPLOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: action.payload,
                isAuthenticated: true,
            };
        case POST_UPLOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case POST_EDIT_LOADING_REQUEST:
            return {
                ...state,
                posts: [], // * 모든 post를 불러올 때 저장하는 배열
                loading: true,
            };
        case POST_EDIT_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                postDetail: action.payload,
            };
        case POST_EDIT_LOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case POST_EDIT_UPLOADING_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case POST_EDIT_UPLOADING_SUCCESS:
            // ! uploading이 성공했을 때, edit 부분은 인증된 사람만 edit를 할 수 있도록 권한을 줄 것 == 인증 성공
            return {
                ...state,
                loading: false,
                posts: action.payload,
                isAuthenticated: true,
            };
        case POST_EDIT_UPLOADING_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case CATEGORY_FIND_REQUEST:
            return {
                ...state,
                posts: [],
                // * 빈 배열로 만들어주지 않으면 카테고리 찾은 것과
                // * 기존 home에서 봤던 posts들이 서로 겹치게 된다.
                loading: true,
            };
        case CATEGORY_FIND_SUCCESS:
            return {
                ...state,
                loading: false,
                categoryFindResult: action.payload,
            };
        case CATEGORY_FIND_FAILURE:
            return {
                ...state,
                categoryFindResult: action.payload,
                loading: false,
            };
        case SEARCH_REQUEST:
            return {
                ...state,
                posts: [],
                // * 빈 배열로 만들어주지 않으면 카테고리 찾은 것과
                // * 기존 home에서 봤던 posts들이 서로 겹치게 된다.
                searchBy: action.payload, // * 검색어 입력한 값 // input 창에서 사용할 state
                loading: true,
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                loading: false,
                searchBy: state.searchBy,
                searchResult: action.payload, // * 검색한 값을 받는 곳 // 검색 화면에서 보여줄 state
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                searchResult: action.payload,
                loading: false,
            };
        default:
            return state;
    }
}
