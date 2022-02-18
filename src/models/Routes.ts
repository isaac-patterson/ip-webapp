import { RouteProps } from "react-router";
import { NOT_FOUND, WRITING_PAGE, PHOTOS_PAGE } from "../constants/RouteConstants";

interface RoutePropsMap {
    [key: string]: RouteProps;
}

const routes: RoutePropsMap = {
    writingPage: {
        path: WRITING_PAGE.path,
        exact: WRITING_PAGE.exact,
        component: WRITING_PAGE.component,
    },
    photosPage: {
        path: PHOTOS_PAGE.path,
        exact: PHOTOS_PAGE.exact,
        component: PHOTOS_PAGE.component,
    },
    notFound: {
        component: NOT_FOUND.component,
    }
};

export default routes;