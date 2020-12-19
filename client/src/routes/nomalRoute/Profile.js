import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    CLEAR_ERROR_REQUEST,
    PASSWORD_EDIT_UPLOADING_REQUEST,
} from "../../redux/types";
import Helmet from "react-helmet";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";

const Profile = () => {
    const { userId, errorMsg, successMsg, previousMatchMsg } = useSelector(
        (state) => state.auth
    );
    const { userName } = useParams();
    const [form, setValues] = useState({
        previousPassword: "", // 이전 비밀번호
        password: "", // 새 비밀번호
        rePassword: "", // 새 비밀번호 확인
    });

    const dispatch = useDispatch();

    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        await e.preventDefault();
        const { previousPassword, password, rePassword } = form;
        const token = localStorage.getItem("token");

        const body = {
            password,
            token,
            previousPassword,
            rePassword,
            userId,
            userName,
        };

        // * 입력하다가 에러가 날 수 있기 때문에 먼저 에러를 날려줌
        dispatch({
            type: CLEAR_ERROR_REQUEST,
        });

        dispatch({
            type: PASSWORD_EDIT_UPLOADING_REQUEST,
            payload: body,
        });
    };
    return (
        <Fragment>
            <Helmet title={`Profile | ${userName}님의 프로필`} />
            {/* reactstrap은 한 칸을 12칸으로 나눔 */}
            {/* 그래서 sm은 보통 모바일 화면을 위해서 > 가장 작은 창일 때 */}
            {/* offset은 시작 위치 */}
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Card>
                    <CardHeader>
                        <strong>Edit password</strong>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={onSubmit}>
                            <FormGroup>
                                <Label for="title">기존 비밀번호</Label>
                                <Input
                                    type="password"
                                    name="previousPassword"
                                    id="previousPassword"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                {
                                    // * 기존 비밀번호와 일치하는지 서버에서 온 메세지를 보여줄 것
                                    previousMatchMsg ? (
                                        <Alert color="danger">
                                            {previousMatchMsg}
                                        </Alert>
                                    ) : (
                                        ""
                                    )
                                }
                            </FormGroup>
                            <FormGroup>
                                <Label for="title">새로운 비밀번호</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    onChange={onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="title">비밀번호 확인</Label>
                                <Input
                                    type="password"
                                    name="rePassword"
                                    id="rePassword"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                {
                                    // * errorMsg가 있으면 해당 메세지를 보여줌
                                    errorMsg ? (
                                        <Alert color="danger">{errorMsg}</Alert>
                                    ) : (
                                        ""
                                    )
                                }
                            </FormGroup>
                            <Button
                                color="success"
                                block
                                className="mt-4 mb-4 col-md-3 offset-9"
                            >
                                제출하기
                            </Button>
                            {
                                // * errorMsg가 있으면 해당 메세지를 보여줌
                                successMsg ? (
                                    <Alert color="success">{successMsg}</Alert>
                                ) : (
                                    ""
                                )
                            }
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Profile;
