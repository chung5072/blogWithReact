import React from "react";
import { Row, Col } from "reactstrap";

const Footer = () => {
    // * 들어갈 내용 copyright@년도
    // * 올해 // thisYear 함수를 불러오게 되면 올해 값이 들어간 year를 반환한다
    const thisYear = () => {
        const year = new Date().getFullYear();
        return year;
    };

    // * Row는 맨 아래 한 블럭(얇은 블럭)
    // * reactstrap을 쓸 때 Row 다음에는 Col(column)이 와야한다
    // * <div>에다가 scss에 작성한 내용을 적용한다.
    // * className을 이용해서 css를 적용
    return (
        <div id="main-footer" className="text-center p-2">
            <Row>
                <Col>
                    <p>
                        Copyright &copy; <span>{thisYear()}</span>
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default Footer;
