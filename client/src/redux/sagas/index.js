import { all, fork } from "redux-saga/effects";
import axios from "axios";

import authSaga from "./authSaga";
import postSaga from "./postSaga";
import commentSaga from "./commentSaga";
import dotenv from "dotenv";
/**authSaga에서 axios.post('api/auth', loginData, config) 이런 식으로 적어줬는데
 * * api/auth 앞에 서버 주소를 적어줘야 한다.
 */
dotenv.config();
// * 기본 url: http://localhost:7000
axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// TODO 향후에 []안에 여러가지 saga를 넣게된다.
export default function* rootSaga() {
    yield all([fork(authSaga), fork(postSaga), fork(commentSaga)]);
}
