import React from "react";
// redux와 store를 불러옴
import { Provider } from "react-redux";
// router를 연결해줌
import { ConnectedRouter } from "connected-react-router";
// store, history
import store, { history } from "./store";
// 만든 라우터
import MyRouter from "./routes/Router";
// bootstrap - css framework
import "bootstrap/dist/css/bootstrap.min.css";
// scss
import "./assets/custom.scss";

/**맨 위에 store로 감싸는 이유는 우리 앱에 모든 상태 관리는 오로지 store 한 군데에서 들어갔다 나오게 된다
 * 가장 최상위에 store를 달아준다
 * 상태 관리는 한 쪽으로 몰아준다
 * 대부분 맨 위는 Provider로 이름을 달아준다
 * 그리고 history를 이용해서 router를 작동시키기 위해서
 * redux를 이용한 ConnectedRouter를 이용
 * 그리고 내부에 생성한 MyRouter를 달아준다
 */
const App = () => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <MyRouter />
            </ConnectedRouter>
        </Provider>
    );
};

export default App;
