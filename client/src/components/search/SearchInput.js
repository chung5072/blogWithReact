import React, { Fragment, useRef, useState } from "react";
import { Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { SEARCH_REQUEST } from "../../redux/types";

const SearchInput = () => {
    const dispatch = useDispatch();

    const [form, setValues] = useState({ searchBy: "" });

    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value,
        });
        console.log("onchange form: ", form);
    };

    const onSubmit = async (e) => {
        await e.preventDefault();
        const { searchBy } = form;

        dispatch({
            type: SEARCH_REQUEST,
            payload: searchBy,
        });

        console.log("검색어_searchBy: ", searchBy);
        resetValue.current.value = ""; // * resetValue에 현재(currnet) 들어가 있는 값(value)을 빈 값으로 해줘라
    };

    // ! 검색어를 입력한 다음에 다시 검색어를 창에서 지워주는 기능
    const resetValue = useRef(null);

    return (
        <Fragment>
            <Form onSubmit={onSubmit} className="col mt-2">
                <Input
                    name="searchBy"
                    onChange={onChange}
                    innerRef={resetValue}
                />
            </Form>
        </Fragment>
    );
};

export default SearchInput;
