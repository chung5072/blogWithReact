// modal = alert창과 같이 자그마한 팝업창 같이 나타나는 창
import React, { useEffect, useState } from "react";
import {
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    Alert,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_ERROR_REQUEST, LOGIN_REQUEST } from "../../redux/types";

/** useState()
 * * react hooks 상태 관리를 기존에 어떤 값이 있다고 하면
 * * 이것을 변화시켜줄 함수와 같이 세트로 묶어줘서 상태를 관리함
 * ! const [modal, setModal] // 상태에 대한 값을 modal에 저장, 변화시켜줄 함수는 setModal()
 *
 * * const [form, setValues] = useState({
 * *     email: "",
 * *     password: ""
 * * }) 같은 경우에는
 *  ! form 형식을 통해서 여러 값을 상태로 넣을 수 있도록 구성
 */
const LoginModal = () => {
    // modal 창이 열려있는지 닫혀있는지를 관리해줄 useState
    // react : 다시 반응 // 이전과 비교를 통해서 변화된 모습만 보여주는 것
    // 상태관리가 가장 중요
    const [modal, setModal] = useState(false); // modal 창이 열리거나 닫힘을 나타냄
    const [localMsg, setLocalMsg] = useState("");
    const [form, setValues] = useState({
        // form 형식
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    // state에서 auth를 불러오고
    // 그 안에서 필요한 값: reducer에서 작성한 errorMsg를 불러옴
    // useSelector를 사용해서 redux의 값을 추가해줘야 하는데
    // auth는 index에서 다시 작업을 해줘야
    // ! state.auth는 index.js의 auth: authReducer이 부분인데 authReduer는 auth관련된 reducer이다.
    // * useSelector를 사용해서 state.auth(즉 reducers/authReducer.js)에서 errorMsg만 불러온다
    // * authReducer에서 정의된 값만 가져올 수가 있다.
    const { errorMsg } = useSelector((state) => state.auth);
    /**useEffect
     * * 뭔가가 변화가 있따고 하면 그 때 useEffect함수 내의 기능을 작동시켜달라
     * * errorMsg를 가져왔다면 setLocalMsg를 통해서 가져온 메세지를 localMsg에 저장하도록
     * * []안에 빈 값을 넣으면 한 번만 작동,
     * * errorMsg를 넣으면 변화가 있거나 할 때, useEffect를 작동시켜라
     * * 그러면 errorMsg가 변화가 있을 때마다 useEffect가 작동할 것이고 없으면 한 번만 하고 마는듯
     */
    useEffect(() => {
        try {
            setLocalMsg(errorMsg);
        } catch (err) {
            console.log(err);
        }
    }, [errorMsg]);

    const handleToggle = () => {
        // ! store에게 dispatch를 통해 객체를 전송
        dispatch({
            // * dispatch를 redux에 있는 타입을 dispatch(보내다)
            type: CLEAR_ERROR_REQUEST,
        });
        setModal(!modal); // modal 값을 false로 만들어서 modal 창을 닫아주게 된다.
    };

    const onChange = (e) => {
        /**react에서는 input을 다루기 위해서는 onChange를 사용해서 작업을 해야한다
         * * setValues 작동 방식이 기존의 값에서 새로 form 입력한 값들을 더해서 저장한다.
         */
        setValues({
            ...form, // 기존 form 형태
            // target은 정해저 있는 값 - email이나 password
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        /**값을 보내준 것을 서버로 보내주기 위해서 */
        e.preventDefault(); // 리액트가 새로고침이 없이 변화된 것만 작업을 해주는 시스템 // 확인 버튼을 눌러도 새로고침 없게
        const { email, password } = form; // form에 입력한 값 중 email과 password만 추출
        const user = { email, password };

        console.log(user);
        dispatch({
            type: LOGIN_REQUEST,
            payload: user,
            // authSaga.js의 function* loginUser() {}에서 const result = yield call(loginUserApi, action.payload);
            // action.payload와 여기 dispatch의 payload 이름을 같게 해줘야 한다.
        });
    };

    /**Modal
     * * isOpen: modal 창의 열림 여부
     * * toggle: modal이 열리거나 닫히는 작업
     * * ModalBody에서 localMsg가 있다고 하면 // errorMsg 가져온 것
     * * ModalBody 내의 Form - FormGroup의 Input에서 name은
     * ! const [form, setValues]에서 useState({email: "", password: ""})이 부분
     * * 이 값은 onChange = (e) => {}에서 setValues({})안의 e.target.name 부분
     * ! 즉 e.target.name == form의 email
     * ! <Input type="email" name="email" id="email" /> 여기에서 name을 통해서
     * ! e.target.name을 한꺼번에 관리 Input의 name에 따라서 email이나 password가 매칭이 된다.
     *
     * ! react는 Input에다가 onChange를 꼭 달아줘야 한다.
     *
     * * Button에서 react의 style을 바로 적용시키려면 style={{}}로 작성하면 가능하다
     * * bootstrap으로 하려면 className=""으로 쓰면 된다
     *
     * ! onSubmit은 Form 태그에 달아줘야 한다.
     */
    return (
        <div>
            <NavLink onClick={handleToggle} href="#">
                Login
            </NavLink>
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>Login</ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="example@example.com"
                                onChange={onChange}
                            />
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="******"
                                onChange={onChange}
                            />
                            <Button
                                color="dark"
                                style={{ marginTop: "2rem" }}
                                block
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default LoginModal;
