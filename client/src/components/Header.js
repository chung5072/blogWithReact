import React from "react";
import { Row, Col } from "reactstrap";

//* reactstrap을 참고하면서 하길 권장 - https://reactstrap.github.io/

const Header = () => {
    return (
        <div id="page-header" className="mb-3">
            <Row>
                <Col md="6" sm="auto" className="text-center m-auto">
                    <h1>Read My Blog</h1>
                    <p>취미 블로그</p>
                </Col>
            </Row>
        </div>
    );
};

export default Header;
