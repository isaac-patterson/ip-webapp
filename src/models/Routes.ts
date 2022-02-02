import { RouteProps } from "react-router";
import { NOT_FOUND, BITE_DRAWER } from "../constants/RouteConstants";

interface RoutePropsMap {
    [key: string]: RouteProps;
}

const routes: RoutePropsMap = {

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