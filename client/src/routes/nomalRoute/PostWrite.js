import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Col,
    Progress,
} from "reactstrap";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import { editorConfiguration } from "../../components/editor/EditorConfig";
import Myinit from "../../components/editor/UploadAdapter";

// dotenv
import dotenv from "dotenv";
import { POST_UPLOADING_REQUEST } from "../../redux/types";
dotenv.config();

// import auth from "../../../../server/middleware/auth";

const PostWrite = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    // 글 작성한 내용들을 state에 저장
    const [form, setValues] = useState({
        title: "",
        contents: "",
        fileUrl: "",
    });
    const dispatch = useDispatch();

    // input에서는 onChange가 꼭 들어간다
    // useState와 짝
    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value, // input의 name에 해당하는 값들을 저장
        });
    };

    // Form에서는 onSubmit도 필요
    const onSubmit = async (e) => {
        await e.preventDefault();
        const { title, contents, fileUrl, category } = form; // state에 저장된 form
        const token = localStorage.getItem("token");
        const body = { title, contents, fileUrl, category, token };
        dispatch({
            type: POST_UPLOADING_REQUEST,
            payload: body,
        });
    };

    // onBlur
    const getDataFromCKEditor = (event, editor) => {
        // console.log("editor");
        // ckeditor의 인스턴스 메모리에 올려져있는 데이터에 직접 접근하기 위해서
        // * 처음에 에디터에서 데이터를 가져옴
        const data = editor.getData();
        // 사진은 올린 사진들 중에서 맨 처음 사진으로 썸네일이 보이도록
        // 썸네일로 이미지를 보여주기 위해서는 이미지를 올릴 때 해당 이미지의 주소를 따로 떼어주어야 한다
        console.log(data); // ! 결과가 html형식으로 나온다. 여기서 이미지 소스만 짤라내야 한다

        // * 이미지가 여러 개라고 하더라도 맨 처음의 이미지만 코드가 작동한다. 위에서 아래로 코드가 흘러가니까
        // * data가 img src로 시작하는 것이 있다고 하면
        if (data && data.match("<img src=")) {
            // * indexOf(): 주어진 값과 일치하는 첫 번째 인덱스를 반환한다.
            // * 찾은 이미지의 위치 == <img src =
            const whereImg_start = data.indexOf("<img src="); // ! 이미지가 시작되는 위치를 잡아냄
            console.log("image src: ", whereImg_start);
            let whereImg_end = ""; // * 끝나는 값
            let ext_name_find = ""; // * 이미지 확장자 - 시작되는 위치
            let result_Img_Url = ""; // * 이미지 url을 저장할 곳을 변수로 만듦

            const ext_name = ["jpeg", "png", "jpg", "gif"]; // * 업로드 되는 이미지의 확장자

            // * 확장자 배열을 쭉 따져봄
            for (let i = 0; i < ext_name.length; i++) {
                if (data.match(ext_name[i])) {
                    // * 확장자 배열에 있는 값을 찾을 때까지 반복을 함 - 이미지 src 주소에서
                    // ! 이미지를 여러 개 찾았다고 하더라도 첫 번째 이미지의 주소값만 가져옴
                    console.log(data.indexOf(`${ext_name[i]}`));
                    ext_name_find = ext_name[i]; // * 찾은 확장자의 위치의 값
                    whereImg_end = data.indexOf(`${ext_name[i]}`); // * 이미지 주소값에서 확장자의 위치(인덱스)를 반환
                }
            }

            console.log("img src index: ", ext_name_find);
            console.log("img src end: ", whereImg_end);

            if (ext_name_find === "jpeg") {
                // * 확장자가 jpeg라면
                result_Img_Url = data.substring(
                    whereImg_start + 10,
                    whereImg_end + 4 // jpeg
                ); // * 처음과 끝의 값을 입력해주면 그 사이(첫번째 인덱스 ~ 마지막 인덱스-1)의 값만 잘라낸다
            } else {
                result_Img_Url = data.substring(
                    whereImg_start + 10,
                    whereImg_end + 3 // png, gif, jpg
                );
            }

            console.log("img url: ", result_Img_Url);
            setValues({
                ...form,
                fileUrl: result_Img_Url,
                contents: data, // ! CKEditor에서 뽑아낸 data // const data = editor.getData();
            });
        } else {
            // * 그림 파일 없는 경우
            setValues({
                ...form,
                // 이미지를 직접 올리고 싶으면 aws s3에다가 저장한 후에 그 주소(그림 파일의 주소)를 붙여도 된다.
                // 위치는 aws s3의 reactblodlec의 upload에서 이미지를 클릭한 다음 객체 URL을 가져오면 된다.
                // 근데 여기다 붙이면 s3의 주소가 노출이 되므로 env에 숨김
                fileUrl: process.env.REACT_APP_BASIC_IMAGE_URL,
                contents: data,
            });
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                // 인증 부분 검토 후 인증이 되었다고 하면
                // ckeditor할 때 글을 많이 안쓰면 onChange도 되는데
                // 블로그 글을 작성하려고 하다보니 onBlur로 쓰는게 맞다
                // onBlur는 글을 작성할 때 해당 글 창에 집중을 하다가(색이 있는 바깥 줄)
                // 글 작성을 마무리하고 다른 곳을 클릭할 때 집중을 안하는 것(색 바깥 줄이 다시 없어지는 현상)
                // onBlur가 되면 CKEditor 내에 적혀있던 글을 한꺼번에 저장하고 값을 넘기도록 처리할 것이다.
                <Form onSubmit={onSubmit}>
                    <FormGroup className="mb-3">
                        <Label for="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            className="form-control"
                            onChange={onChange}
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label for="category">Category</Label>
                        <Input
                            type="text"
                            name="category"
                            id="category"
                            className="form-control"
                            onChange={onChange}
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label for="content">Content</Label>
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfiguration}
                            onInit={Myinit}
                            onBlur={getDataFromCKEditor}
                        />
                        <Button
                            color="success"
                            block
                            className="mt-3 col-md-2 offset-md-10 mb-3"
                        >
                            제출하기
                        </Button>
                    </FormGroup>
                </Form>
            ) : (
                // 아직 인증이 되지 않았다
                <Col width={50} className="p-5 m-5">
                    <Progress animated color="info" value={100} />
                </Col>
            )}
        </div>
    );
};

export default PostWrite;
