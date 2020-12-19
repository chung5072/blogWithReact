import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

// * 기존의 Component와 나머지 것을 모두 받아와서
// * userId와 creatorId를 가져온다고 하면
// * 기본적으로는 모든 나머지 것들을 고대로 가져오지만
// * 조건으로 userId와 creatorId가 같다고 하면
// * 있는 그대로 Component를 렌더링하고
// * 그렇지 않으면 redirect를 이용해서 home로 보내줌
// ! 이런 방법으로 주소창에서 직접 접근을 하더라도 userId와 creatorId가 다르면 홈으로 보낼 수 있다
export const EditProtectedRoute = ({ component: Component, ...rest }) => {
    // 로그인한 user의 id와 글을 작성한 creator의 id가 같을 경우에만
    // post의 고유 id 뒤에 /edit를 붙여서 접속이 가능하도록
    const { userId } = useSelector((state) => state.auth);
    const { creatorId } = useSelector((state) => state.post);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (userId === creatorId) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    // * 위치 상태를 가져옴
                                    // * 주소를 props의 location이라는 곳에서 받아온다.
                                    // * redux에서 주소를 변환하는 것은 location이라는 history(redux의 history)에서 주소를 받아와서
                                    // * 새로고침 없이 안에 구성요소가 바뀌면서 화면을 보여주는 것
                                    // * 이 때 사용하는 것이 history 아니면 location
                                    from: props.location,
                                },
                            }}
                        />
                    );
                }
            }}
        />
    );
};

// * 비밀번호 변경
// 주소창에서 임의로 주소를 입력을 했을 때
// 해당하는 사람 외에는 접근을 못하도록 하기 위해서
export const ProfileProtectedRoute = ({ component: Component, ...rest }) => {
    const { userName } = useSelector((state) => state.auth); // * 현재 로그인한 사람의 이름
    console.log(userName);
    return (
        <Route
            {...rest}
            render={(props) => {
                // 주소창에서 넘겨져오는 params의 userName이
                // state.auth 부분에서 가져온 userName이 같다고 하면
                // Component, Profile 컴포넌트를 받을 것인데
                // ...props == 내용을 그대로 보내주고
                if (props.match.params.userName === userName) {
                    return <Component {...props} />;
                } else {
                    return (
                        // params의 userName과 로그인한 사람의 userName이 다를경우
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location,
                                },
                            }}
                        />
                    );
                }
            }}
        />
    );
};
