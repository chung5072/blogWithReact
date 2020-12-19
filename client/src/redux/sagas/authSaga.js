// axios - express는 axios를 주로 사용
import axios from "axios";
import { put, takeEvery, all, call, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_REQUEST,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_FAILURE,
    REGISTER_REQUEST,
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    CLEAR_ERROR_SUCCESS,
    CLEAR_ERROR_FAILURE,
    CLEAR_ERROR_REQUEST,
    PASSWORD_EDIT_UPLOADING_REQUEST,
    PASSWORD_EDIT_UPLOADING_SUCCESS,
    PASSWORD_EDIT_UPLOADING_FAILURE,
} from "../types";

/**아래의 함수가 하나의 패턴
 * ! loginUserApi()
 * ! loginUser()
 * ! watchLoginUser() -> loginUser()를 부르고 -> loginUserApi()를 부른다
 */

//1. 로그인 유저 api
// login
const loginUserApi = (loginData) => {
    /**에러가 발생
     * * undefined "loginData"
     * ! 값이 넘어온 것이 없다는 의미인데 이것은
     * ! function* loginUser() {} 여기의
     * * const result = yield call(loginUserApi, action.payload); 이 부분에서
     * ! action.payload 값이 없다는 것
     * * > LoginModal.js에서 확인
     * LoginModal에서 const onSubmit에서 dispatch를 통해 값을 보내는 데 type을 LOGIN_REQUEST라고 하고
     * 여기의 action은 type(== LOGIN_REQUEST)을 의미한다.
     * action.payload라고 이름을 지어줬는데 LoginModal에서는 data라고 이름을 지어줌
     * dispatch({
            type: LOGIN_REQUEST,
            data: user,
        });
     */
    console.log(loginData, "loginData");
    const config = {
        // * postman에서 작업해 준 것 - 설정
        headers: {
            "Content-type": "application/json",
        },
    };
    return axios.post("api/auth", loginData, config);
};

//2.
function* loginUser(action) {
    try {
        // 에러가 안나면
        // action.payload: login한 리퀘스트에서 넘어오는 payload값을 같이 담아서 함수로 불러준다
        const result = yield call(loginUserApi, action.payload);
        console.log(result);
        yield put({
            type: LOGIN_SUCCESS,
            payload: result.data, // call(loginUserApi, action.payload) 여기서 나온 값을 넘겨준다.
        });
    } catch (err) {
        yield put({
            type: LOGIN_FAILURE,
            payload: err.response,
        });
    }
}

function* watchLoginUser() {
    // * 감시하는 것과 감시하면 작동하게 될 함수 // loginUser
    yield takeEvery(LOGIN_REQUEST, loginUser);
}

/** LOGOUT
 * * API 서버랑 통신할 일이 없다 - call 함수를 쓸 일이 없다.
 *
 */
function* logout(action) {
    // ! 로그 아웃은 넘겨주는 값이 없으므로 payload값이 없다
    try {
        yield put({
            type: LOGOUT_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: LOGOUT_FAILURE,
        });
        console.log(err);
    }
}

/**대략 순서가 - 로그아웃
 * ! LOGOUT_REQUEST가 발생하면 logout 함수를 실행한다
 * * logout 매개변수로 action 값을 받는데
 * * action의 type이 logout_success인지
 *                 logout_failure인지
 * 판단
 */
function* watchLogout() {
    // 얘는 항상 logout_requst를 보고 있다가 logut을 작동시켜준다.
    yield takeEvery(LOGOUT_REQUEST, logout);
}

// User Loading
/**userLoading과 loginUser는 매우 유사
 * * userLoading은 매번 로그인하는 것이라고 볼 수 있다
 * * 챕터가 넘어가거나 혹은 뭔가 바뀌었을 때 매번 자동으로 로그인을 해보고
 * * 성공인지 실패인지 가늠하는 것이라 로그인과 유사
 * * 다른 점은 userLoading은 토큰만 있으면 판단할 수 있다
 * ! 오로지 토큰값만 넘겨주도록 한다
 */
const userLoadingApi = (token) => {
    // token에 들어가는 값은 action.payload;
    // const token = data.payload;
    console.log("token: ", token);
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    };
    if (token) {
        config.headers["x-auth-token"] = token;
    }

    return axios.get("api/auth/user", config); // 여기를 통해 userLoading을 확인할 것이다.
    // ! router/api/auth.js의 router.get("/user", auth, async (req, res) => {}); 이 부분
    // * 단지 유저가 존재하는지 확인하는 부분이기에 get을 이용한다.
};

function* userLoading(action) {
    try {
        console.log("userLoading_action", action);
        // action.payload 안에는 토큰 값이 들어있다.
        // data: token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmN...
        // data에 들어있는 토큰 값으로, 껍데기를 벗겨서 값을 보내주고 있다.
        /**yield
         * ! 아무튼 얘가 없으면 에러남 일단 그럼
         * yield 키워드는 제너레이터 함수의 실행을 중지시키거나
         * 그리고  yield 키워드 뒤에오는 표현식[expression]의 값은 제너레이터의 caller로 반환된다.
         * 제너레이터 버전의 return 키워드로 생각 할 수 있다.
         */
        const result = yield call(userLoadingApi, action.payload);
        // console.log("userLoadingApi", result);
        /**result 결과값
         * object / payload / args: ['토큰의 내용']
         */
        yield put({
            type: USER_LOADING_SUCCESS,
            payload: result.data,
        });
    } catch (err) {
        yield put({
            type: USER_LOADING_FAILURE,
            payload: err.response,
        });
    }
}

function* watchUserLoading() {
    yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

// REGISTER
const registerUserApi = (registerData) => {
    console.log(registerData, "registerData");
    // 회원 가입에는 특별한 토큰이 필요 없다.
    // router/api/user.js
    // * router.post("/", (req, res) => {}}; // 회원 가입
    return axios.post("api/user", registerData);
};

function* registerUser(action) {
    try {
        // 에러가 안나면
        const result = yield call(registerUserApi, action.payload);
        console.log(result, "register user data");
        yield put({
            type: REGISTER_SUCCESS,
            payload: result.data,
        });
    } catch (err) {
        yield put({
            type: REGISTER_FAILURE,
            payload: err.response,
        });
    }
}

function* watchRegisterUser() {
    yield takeEvery(REGISTER_REQUEST, registerUser);
}

// CLEAR ERROR
// error를 날리는 부분은 api가 필요가 없다

function* clearError() {
    try {
        // 에러가 안나면
        yield put({
            type: CLEAR_ERROR_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: CLEAR_ERROR_FAILURE,
        });
    }
}

function* watchClearError() {
    yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

// * 회원 정보(비밀번호) 수정
// edit password
// USER EDIT
const editPasswordApi = (payload) => {
    // * 인증된 사람만 비밀번호를 바꿀 수 있도록
    const config = {
        headers: {
            "Content-type": "application/json",
        },
    };
    const token = payload.token; // * 이 부분땜시롱 payload를 먼저 받는다.
    if (token) {
        config.headers["x-auth-token"] = token;
    }

    // ! payload를 먼저 넣어줘야 config에서 payload를 받을 수 있다
    return axios.post(`/api/user/${payload.userName}/profile`, payload, config);
};

function* editPassword(action) {
    try {
        // 에러가 안나면
        const result = yield call(editPasswordApi, action.payload);
        console.log(result, "edit password result");
        yield put({
            type: PASSWORD_EDIT_UPLOADING_SUCCESS,
            payload: result, // ! 에러났었음
            // ! authRecuer에서 아예 풀어서 썼는데
        });
        yield put(push("/"));
    } catch (err) {
        yield put({
            type: PASSWORD_EDIT_UPLOADING_FAILURE,
            payload: err.response,
        });
    }
}

function* watchEditPassword() {
    yield takeEvery(PASSWORD_EDIT_UPLOADING_REQUEST, editPassword);
}

export default function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogout),
        fork(watchRegisterUser),
        fork(watchClearError),
        fork(watchUserLoading),
        fork(watchEditPassword),
    ]);
} // index.js에서
