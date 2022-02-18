import ErrorNotFound from "../pages/ErrorNotFound/ErrorNotFound";
import PhotosPage from "../pages/Photos/PhotosPage";
import WritingPage from "../pages/Writing/WritingPage";

export const WRITING_PAGE = {
    name: "writingPage",
    label: "Writing",
    path: "writing",
    exact: true,
    component: WritingPage,
}

export const PHOTOS_PAGE = {
    name: "photosPage",
    label: "Photos",
    path: "photos",
    exact: true,
    component: PhotosPage,
}

export const NOT_FOUND = {
    component: ErrorNotFound,
}

const exports = {
    WRITING_PAGE, NOT_FOUND, PHOTOS_PAGE
}

export default exports