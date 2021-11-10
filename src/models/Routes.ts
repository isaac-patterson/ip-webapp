import { RouteProps } from "react-router";
import { NOT_FOUND, LANDING_PAGE, BITE_DRAWER } from "../constants/RouteConstants";

interface RoutePropsMap {
    [key: string]: RouteProps;
}

const routes: RoutePropsMap = {
    landingPage: {
        path: LANDING_PAGE.path,
        exact: LANDING_PAGE.exact,
        component: LANDING_PAGE.component,
    },
    biteDrawer: {
        path: BITE_DRAWER.path,
        exact: BITE_DRAWER.exact,
        component: BITE_DRAWER.component,

    },
    notFound: {
        component: NOT_FOUND.component,
    }
};

export default routes;