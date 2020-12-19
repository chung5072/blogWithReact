import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, FormGroup, Input, Row } from "reactstrap";
import {
    COMMENT_LOADING_REQUEST,
    COMMENT_UPLOADING_REQUEST,
} from "../../redux/types";

// ! 에러를 해결하는 부분에서는 redux를 켜보고 제대로 넘어오는지 확인하는 것도 중요
// ! console.log를 통해서 값이 넘어오는지도 확인을 할 수가 있다
const Comments = ({ id, userId, userName }) => {
    // * {}를 이용해서 넘어오는 props의 이름으로 값을 사용할 수 있다
    const dispatch = useDispatch();
    const [form, setValues] = useState({ contents: "" });

    const onSubmit = async (e) => {
        await e.preventDefault();
        const { contents } = form;
        const token = localStorage.getItem("token"); // * 오로지 인증된 사람만 댓글을 달 수 있도록
        const body = {
            contents,
            token,
            id,
            userId,
            userName,
        };

        dispatch({
            type: COMMENT_UPLOADING_REQUEST,
            payload: body,
        });

        // * resetValue가 현재 있는 곳에(input) value를 빈 값으로 해줘랴
        resetValue.current.value = "";
        setValues("");
    };

    // * 댓글을 달아서 submit을 눌렀을 때 값이 변하지 않아서 사용
    /**react useRef
     * * 전 생애주기를 통해 유지
     * * 직접 dumb?에 접근을 하기 위해서 또는 생애주기에 관계없이 접근하기 위해서 사용
     * * useEffect 같은 경우에는 바깥에 변수를 가지고 뭔가 접근을 할 때 일반적으로 사용할 수가 없다?
     * * useEffect 안에 반영을 시켜주기 위해서는 useRef를 통해서만 접근이 가능하다
     */
    // * 댓글 창의 내용애 대해 submit을 보내고 나서 입력된 값(state)을 초기화시켜줘야
    // * input에서 관여
    const resetValue = useRef(null);

    // ! input을 사용하려면 onChange가 있어야 한다.
    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value,
        });
        console.log("change input value: ", form.contents);
    };

    useEffect(() => {
        // * dispatch와 id값이 바뀔 때마다 useEffect 함수가 실행된다
        dispatch({
            type: COMMENT_LOADING_REQUEST,
            payload: id, // ! post의 id값
        });
    }, [dispatch, id]);
    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Row className="p-2">
                        <div className="font-weight-bold m-1">Make Comment</div>
                        <div className="my-1"></div>
                        <Input
                            innerRef={resetValue}
                            type="textarea"
                            name="contents"
                            id="contents"
                            onChange={onChange}
                            placeholder="Comment"
                        />
                        {/* react strap은 한 줄을 12칸으로 그중에서 2칸을 차지 
                        offset은 해당 버튼의 시작 위치를 지정*/}
                        <Button
                            color="primary"
                            block
                            className="mt-2 offset-md-10 col-md-2"
                        >
                            Submit
                        </Button>
                    </Row>
                </FormGroup>
            </Form>
        </Fragment>
    );
};

export default Comments;
