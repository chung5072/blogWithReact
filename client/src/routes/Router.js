import React, { Fragment } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AppNavbar from "../components/AppNavBar";
import { Container } from "reactstrap";
import { Switch, Route, Redirect } from "react-router-dom";
import PostCardList from "./nomalRoute/PostCardList";
import PostWrite from "./nomalRoute/PostWrite";
import PostDetail from "./nomalRoute/PostDetail";
import Search from "./nomalRoute/Search";
import CategoryResult from "./nomalRoute/CategoryResult";
import PostEdit from "./nomalRoute/PostEdit";
import Profile from "./nomalRoute/Profile";
import {
    EditProtectedRoute,
    ProfileProtectedRoute,
} from "./protectedRoute/ProtectedRoute";

const MyRouter = () => (
    <Fragment>
        <AppNavbar />
        <Header />
        <Container id="main-body">
            <Switch>
                <Route path="/" exact component={PostCardList} />
                <Route path="/post" exact component={PostWrite} />
                <Route path="/post/:id" exact component={PostDetail} />
                <EditProtectedRoute
                    path="/post/:id/edit"
                    exact
                    component={PostEdit}
                />
                <Route
                    path="/post/category/:categoryName"
                    exact
                    component={CategoryResult}
                />
                <Route path="/search/:searchTerm" exact component={Search} />
                <ProfileProtectedRoute
                    path="/user/:userName/profile"
                    exact
                    component={Profile}
                />
                <Redirect from="*" to="/" />
            </Switch>
        </Container>
        <Footer />
    </Fragment>
);

export default MyRouter;
