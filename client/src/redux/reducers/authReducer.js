import {
    // login type을 불러옴
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    CLEAR_ERROR_REQUEST,
    CLEAR_ERROR_SUCCESS,
    CLEAR_ERROR_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    PASSWORD_EDIT_UPLOADING_REQUEST,
    PASSWORD_EDIT_UPLOADING_SUCCESS,
    PASSWORD_EDIT_UPLOADING_FAILURE,
} from "../types";

/** 변수의 이름은 store.js 16번째 줄에서 사용했던 initialState와 이름을 똑같이 만들어줘야 한다
 * * 토큰은 지난번 backend에서 만들어줬던 토큰을 의미
 * ! 에러메세지는 여기 errorMsg에서만 저장
 * * 그러면 회원가입 실패했을 때 발생한 에러를 clear해주지 않으면
 * * 로그인 실패할 때 발생하는 에러가 회원 가입 실패시 발생한 에러 메세지가 그대로 나타나게 된다.
 *
 * ! authReducer.js와 authSaga.js는 세트
 * ! reducer와 saga는 세트
 */

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: "",
    userId: "",
    userName: "",
    userRole: "",
    errorMsg: "", // * 에러메세지는 여기에서만 저장
    successMsg: "",
    previousMatchMsg: "", // * 이전 값과 같은지 여부
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST: // 로그인과 다를바가 없다
        case LOGOUT_REQUEST:
        // LOGIN_REQUEST와 별반 다를 것이 없다
        // 그래서 LOGIN_REQUEST의 위에 작성을 하면
        // LOGIN_REQUEST 아래에 작성한 returh의 기능을 같이 이용한다.
        case LOGIN_REQUEST:
            return {
                ...state,
                errorMsg: "",
                isLoading: true, // 로딩 과정에 있다 // spinner를 표시해주기 위해서 넣어준 상태값
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            // back에서 가져온 action.payload
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload, // 넘어온 값
                isAuthenticated: true,
                isLoading: false,
                userId: action.payload.user.id,
                userRole: action.payload.user.role,
                userName: action.payload.user.name, // ! 와 내가 이걸 해냄 미쳤따리 오졌따리 이거 넣어서 로그인 후 바로 회원정보 수정 가능
                errorMsg: "",
            };
        case REGISTER_FAILURE:
        case LOGOUT_FAILURE:
        // 로그아웃 실패시 로그인 실패와 같다고 봐도 된다.
        case LOGIN_FAILURE:
            // 로그인 실패시 토큰 지워줌
            localStorage.removeItem("token");
            return {
                ...state,
                ...action.payload, // 넘어온 값
                token: null,
                user: null,
                userId: null,
                isAuthenticated: false,
                isLoading: false,
                userRole: null,
                errorMsg: action.payload.data.msg, // 로그인 실패시 action.payload의 data.msg라는 곳에 담아서 볼 수 있게
            };
        // 로그 아웃 request는 위에 작성함
        case LOGOUT_SUCCESS:
            /**로그 아웃 success
             * ! 토큰을 날려버린다
             * 그리고 로그 아웃은 기존의 상태값이 필요가 없다
             * ! 값을 다 날려준다고 생각하면 된다.
             */
            localStorage.removeItem("token");
            return {
                token: null,
                user: null,
                userId: null,
                isAuthenticated: false, // 아 이거 때문에 에러가 나고 난리야 흙흙
                isLoading: false,
                userRole: null,
                errorMsg: "",
            };
        case USER_LOADING_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADING_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload, // user에는 넘겨온 값이 들어오고
                // * user 한 곳에 받아서 뽑아내기에 나중에 처리하기 곤란할 수 있으므로
                // * 미리 아래에서 Id나 name이나 role를 뽑아낸다
                // 나중에 추가적인 정보가 있을 때 userRole 아래로 정보를 추가해주면 된다
                userId: action.payload._id, // ! mongo DB에서 자동적으로 주어지는 _id값
                userName: action.payload.name,
                userRole: action.payload.role,
            };
        case USER_LOADING_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                userRole: "",
            };
        // edit 업로딩 버튼을 누를 때 에러는 모두 날려줄 것이다
        // 그리고 나서 서버 쪽에서 메세지를 받을 것이다
        case CLEAR_ERROR_REQUEST:
            // 에러메세지 삭제
            return {
                ...state,
            };
        case CLEAR_ERROR_SUCCESS:
            return {
                ...state,
                errorMsg: "",
                previousMatchMsg: "",
            };
        case CLEAR_ERROR_FAILURE:
            return {
                ...state,
                errorMsg: "Clear Error Fail",
                previousMatchMsg: "Clear Error Fail",
            };
        case PASSWORD_EDIT_UPLOADING_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case PASSWORD_EDIT_UPLOADING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                successMsg: action.payload.data.success_msg,
                errorMsg: "",
                previousMatchMsg: "",
                /** router/api/user.js
                 * res.status(200).json({
                        success_msg: "비밀번호 업데이트에 성공했습니다.",
                    });
                 */
            };
        case PASSWORD_EDIT_UPLOADING_FAILURE:
            return {
                ...state,
                isLoading: false,
                successMsg: "",
                errorMsg: action.payload.data.fail_msg,
                /** router/api/user.js
                 * res.status(400).json({
                        fail_msg: "새로운 비밀번호가 일치하지 않습니다.",
                    });
                 */
                previousMatchMsg: action.payload.data.match_msg,
                /** router/api/user.js
                 * return res.status(400).json({
                    match_msg: "기존 비밀번호와 일치하지 않습니다",
                });
                 */
            };
        default:
            return state;
    }
};

export default authReducer;
