import LandingPage from "../pages/LandingPage/LandingPage";
import ErrorNotFound from "../pages/ErrorNotFound/ErrorNotFound";
import BiteDrawer from "../pages/Drawer/Drawer"

export const LANDING_PAGE = {
    name: "landingPage",
    label: "Landing Page",
    path: "/",
    exact: true,
    component: LandingPage,
}

export const BITE_DRAWER = {
    name: "biteDrawer",
    label: "Bite Drawer",
    path: "/menu",
    exact: true,
    component: BiteDrawer,
}

export const NOT_FOUND = {
    component: ErrorNotFound,

}

const exports = {
    BITE_DRAWER, LANDING_PAGE, NOT_FOUND
}

export default exports