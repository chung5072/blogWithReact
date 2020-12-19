import store from "../../store";
import { USER_LOADING_REQUEST } from "../../redux/types";

/**어디에 달아주느냐
 * 매번 로그인을 하는 방식에서는 App.js에서 useEffect를 사용하거나?
 * index.js에서 <App />앞에 달아주는 방식?이 있다
 * 그 중에서 맨 앞에 달아주는게 속도가 그나마 빠르다
 */
const LoadUser = () => {
    try {
        store.dispatch({
            type: USER_LOADING_REQUEST,
            payload: localStorage.getItem("token"),
        });
    } catch (err) {
        console.log(err);
    }
};

export default LoadUser;
