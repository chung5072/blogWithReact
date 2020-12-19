import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from "../../redux/types";
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

const RegisterModal = () => {
    // modal 창 열고 닫힌 상태 저장 state
    const [modal, setModal] = useState(false);
    // 회원 가입이 정보를 입력한 내용들을 저장하는 state
    const [form, setValues] = useState({
        // input을 사용하는 경우는 거의 form으로 만든 형식을 이용
        name: "",
        email: "",
        password: "",
    });
    // 메세지 저장 state
    const [localMsg, setLocalMsg] = useState("");
    // ! useSelector를 사용해서 state.auth(즉 reducers/authReducer.js)에서 errorMsg만 불러온다
    // *
    /**redux에서 reducers에서 index.js에서
     * const createRootReducer = (history) =>
        combineReducers({
            router: connectRouter(history),
     *       ! auth: authReducer, // LoginModal.js, RegisterModal.js에서 state.auth로 사용
        });
     */
    const { errorMsg } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    // 에러를 없에줄 것?
    const handleToggle = () => {
        dispatch({
            type: CLEAR_ERROR_REQUEST,
        });
        // modal 창 상태 관리
        // isOpen이 true면 false로 변경, false면 true 값으로 변경
        setModal(!modal);
    };

    useEffect(() => {
        /**언제 다시 렌더링을 해주는가
         * * errorMsg가 변할 경우에 바꿔주도록 한다
         * ! setLocalMsg 함수를 통해서 localMsg state 변수에 errorMsg 값을 넣어준다.
         */
        try {
            setLocalMsg(errorMsg);
        } catch (err) {
            console.error(err);
        }
    }, [errorMsg]);

    const onChange = (e) => {
        // ! input의 값이 변하면 해당 값을 저장하기 위해서
        // * input을 사용하면 거의 매번 이용해야
        setValues({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        // * 작성한 form을 server로 보내주는 기능
        e.preventDefault();
        const { name, email, password } = form;
        const newUser = { name, email, password };

        console.log(newUser, "newUser");

        dispatch({
            // store로 값을 보낸다
            type: REGISTER_REQUEST,
            payload: newUser,
        });
    };

    return (
        <div>
            <NavLink onClick={handleToggle} href="#">
                Register
            </NavLink>
            {/* Modal 창 열고 닫을 때 handleToggle을 이용 */}
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>Register</ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            {/* input에서는 onChange를 무조건 달아줘야 한다 */}
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="이름"
                                onChange={onChange}
                            />
                            <Label for="email">Email</Label>
                            {/* input에서는 onChange를 무조건 달아줘야 한다 */}
                            <Input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="example@example.com"
                                onChange={onChange}
                            />
                            <Label for="password">Password</Label>
                            {/* input에서는 onChange를 무조건 달아줘야 한다 */}
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="******"
                                onChange={onChange}
                            />
                            <Button color="dark" className="mt-2" block>
                                Register
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default RegisterModal;
