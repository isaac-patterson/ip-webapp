import ErrorNotFound from "../pages/ErrorNotFound/ErrorNotFound";
import BiteDrawer from "../pages/Drawer/Drawer"


export const BITE_DRAWER = {
    name: "biteDrawer",
    label: "Bite Drawer",
    path: "/",
    exact: true,
    component: BiteDrawer,
}

export const NOT_FOUND = {
    component: ErrorNotFound,
}

const exports = {
    BITE_DRAWER, NOT_FOUND
}

export default exports