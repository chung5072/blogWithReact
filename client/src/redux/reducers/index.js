import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import authReducer from "./authReducer";
import postReducer from "./postReducer";
import commentReducer from "./commentReducer";

/**connected-react-router를 사용한 connectRouter를 router라고 명명
 * 향후에 reducer 관련된 것을 불러올 때는 router라고 이름지은 것만 불러온다고 하면
 * connectRouter(history)를 불러올 수가 있다.
 *
 * 앞으로도 router를 만든다고 하면 아래와 같은 방식으로 연결해주는 작업을 통해서
 * 프론트에서 이름만으로 불러오는 과정을 진행하게 된다.
 */
const createRootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        auth: authReducer, // LoginModal.js에서 state.auth로 사용
        post: postReducer,
        comment: commentReducer,
    });

export default createRootReducer;
