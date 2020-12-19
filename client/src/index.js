import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import LoadUser from "./components/auth/LoadUser";

// react를 렌더링하기 전에 미리 로그인을 확인해준다
// useEffect 같은 경우에는 react에서 렌더링을 한 번 해주고 useEffect를 실행하기때문에
// 아주 살짝 차이가 존재한다.
LoadUser();

ReactDOM.render(<App />, document.getElementById("root"));
