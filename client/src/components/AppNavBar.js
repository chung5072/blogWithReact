import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
    Navbar,
    Container,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    Form,
    Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT_REQUEST, POSTS_WRITE_REQUEST } from "../redux/types";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";
import SearchInput from "./search/SearchInput";

/**기능에 대한 설명
 * * Collapse안에 useState를 넣어서 상태 관리를 해줄 예정
 * TODO true, false // isOpen에서 state를 넣어서 상태관리를 해줄 예정
 * TODO authLInk, guestLink // 위의 true, false를 통해 다른 컴포넌트를 보여줄 예정
 */
const AppNavBar = () => {
    // login이 성공했을 때에 관한 state
    // navbar의 Collapse가 열고 닫는 것을 작업
    // * Collapse는 모바일 형태와 같이 가로의 길이가 짧아졌을 때 navbar에서 나타나는 햄버거 모양같이 짝대기 3개, 三
    // * 그 三을 누를 때 나타나는, drop-down으로 나타나는 메뉴의 내용들?
    // 그 왜 정처기 할 때 3번 모양이던가 상단 메뉴 누르면 아래로 메뉴의 내용들이 나타나는거 그거
    const [isOpen, setIsOpen] = useState(false);

    // ! state에서 auth를 불러옴 - reducers/authReducer.js의 isAuthenticated
    // userRole은 사이트를 개발한 개발자만 글을 작성할 수 있도록 정해주는 것
    // 일반 사람들은 댓글만 달 수 있도록
    const { isAuthenticated, user, userRole } = useSelector(
        (state) => state.auth
    );
    console.log(userRole, "userRole"); // User userRole

    const dispatch = useDispatch();

    // ! FRONT 부분에서는 REQUEST를 보내게 된다
    const onLogout = useCallback(() => {
        // useEffect와 매우 비슷, 최적화시켜주는 성능이 있다
        // useCallback will return a memoized version of the callback that only changes if one of the inputs has changed.
        // inputs의 값중 하나가 변한다면 바뀐 변화면 callback을 해준다?
        // react 사이트 // memoization된 콜백을 반환한다
        // * useEffect와 구조가 비슷한데 useEffect는 []안의 값을 변화되면 매번 새롭게 그려주는데
        // * useCallback은 기존의 값을 저장하고 있다가 값이 변화되어 차이가 나는 부분만 다시 그려준다
        dispatch({
            // 값을 보내준다
            type: LOGOUT_REQUEST,
        });
    }, [dispatch]);

    useEffect(() => {
        // 새로 작동을 하게 되느냐 // user의 값이 변했을 때
        // * setIsOpen은 Collapse를 열고 닫을 때 사용하는 state
        // ! user가 바뀌면 == user가 새롭게 들어오게 된다면
        // ! Collapse == 메뉴가 드롭다운으로 나타나는게 보일 필요가 없다.
        setIsOpen(false);
    }, [user]);

    const handleToggle = () => {
        setIsOpen(!isOpen); // 열렸든 닫혔든 무조건 toggle을 작동하게 된다면 Collapse를 닫아주도록
    };

    const addPostClick = () => {
        dispatch({
            type: POSTS_WRITE_REQUEST,
        });
    };

    const authLink = (
        <Fragment>
            <NavItem>
                {/* userRole이 MainJuin일 때만 글을 작성할 수 있게 버튼을 만들어주고 */}
                {userRole === "MainJuin" ? (
                    <Form className="col mt-2">
                        <Link
                            to="/post"
                            className="btn btn-success block text-white px-3"
                            onClick={addPostClick}
                        >
                            {/* 화면 이동 기능인 듯 - react-router-dom은 바로 화면에서 이동 
                    bootstrap, reactstrap 같이 이용할 수 있다.
                    block은 칸을 다 채우는 효과
                    px-3: padding x padding을 x축으로, 즉 양 옆
                    py이라면 y축으로, 즉 위 아래 */}
                            Add Post
                        </Link>
                    </Form>
                ) : (
                    ""
                )}
            </NavItem>
            <NavItem className="d-flex justify-content-center">
                {/* 여기는 MainJuin이든 일반 유저든 보일 수 있는 화면을 작성 */}
                <Form className="col mt-2">
                    {/* react store에서 auth라는 곳에서 user를 가져올 것 
                    먼저 user && user.name에서 user.name만 적어주게 되면
                    react는 처음에 한번 user에 빈 값을 넣고 랜더링을 하고
                    값을 가져온 다음에 다시 랜더링을 하기 땜시롱 
                    그러면 바로 에러를 발생하게 된다.
                    그래서 분명 값을 가져왔는데 undefined를 나타내면 아래와 같이 조건문을 적어서 값이 있는지 확인을 하자
                    */}
                    {user && user.name ? (
                        <Link to={`/user/${user.name}/profile`}>
                            <Button
                                outline
                                color="light"
                                className="px-3"
                                block
                            >
                                {/* outline은 내용물이 채워지지 않고 테두리만 색을 넣어준다 */}
                                <strong>
                                    {user ? `Welcome ${user.name}` : ""}
                                </strong>
                            </Button>
                        </Link>
                    ) : (
                        <Button outline color="light" className="px-3" block>
                            {/* outline은 내용물이 채워지지 않고 테두리만 색을 넣어준다 */}
                            <strong>"유저를 찾을 수 없습니다."</strong>
                        </Button>
                    )}
                </Form>
            </NavItem>
            <NavItem>
                {/* 로그 아웃 버튼 */}
                <Form className="col">
                    <Link onClick={onLogout} to="#" className="">
                        <Button outline color="light" className="mt-2" block>
                            LOGOUT
                        </Button>
                    </Link>
                </Form>
            </NavItem>
        </Fragment>
    );

    const guestLink = (
        <Fragment>
            <NavItem>
                <RegisterModal />
            </NavItem>
            <NavItem>
                <LoginModal />
            </NavItem>
        </Fragment>
    );

    return (
        <Fragment>
            <Navbar color="dark" dark expand="lg" className="sticky-top">
                <Container>
                    <Link to="/" className="text-white text-decoration-none">
                        블로그
                    </Link>
                    <NavbarToggler onClick={handleToggle} />
                    <Collapse isOpen={isOpen} navbar>
                        {/* isOpen은 모바일 화면에서 접히는 부분이 나오는데 처음에는 open으로 놓아야 한다 */}
                        <SearchInput isOpen={isOpen} />
                        <Nav
                            className="ml-auto d-flex justify-content-around"
                            navbar
                        >
                            {/* 인증이 되었는지 안되었는지에 따라서  */}
                            {/* 인증이 되면 authLink라는 글씨가 나오고 */}
                            {/* 인증이 안되면 LoginModal이 나오도록 */}
                            {isAuthenticated ? authLink : guestLink}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
};

export default AppNavBar;
