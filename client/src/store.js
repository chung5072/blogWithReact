// 리덕스 세팅
import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
// 만든 파일 불러옴
import createRootReducer from "./redux/reducers/index";
import rootSaga from "./redux/sagas";

// history를 밖으로 내보낼 수 있도록
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const initialState = {};

/**향후에 미들웨어를 추가한다면 배열 안에 하나씩 추가를 해주면 된다
 * connectedReactRouter를 쓰지 않으면 sagaMiddleware만 적어주게 된다.
 */
const middlewares = [sagaMiddleware, routerMiddleware(history)];

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

/**개발자 도구일 때랑 배포일 때
 * 배포환경에서는 redux devtools가 보이면 웹이 어떻게 작동하는지 드러내는 일
 * 반드시 배포단계에서는 개발자 도구를 삭제해줘야 혹은 안보이도록
 */
const composeEnhancer =
    process.env.NODE_ENV === "production" ? compose : devtools || compose;

/**store를 만들어라
 * createRootReducer와 initialState와 composeEnhancer를 가지고
 */
const store = createStore(
    createRootReducer(history),
    // 웹에 모든 상태를 담고있는 초기값
    // memo 확인 - iniialState
    initialState,
    composeEnhancer(applyMiddleware(...middlewares))
);

// saga 미들웨어로 작동해라
sagaMiddleware.run(rootSaga);

export default store;
