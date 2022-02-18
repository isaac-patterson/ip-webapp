import React, { Fragment, useState } from 'react';
import { PHOTOS_PAGE, WRITING_PAGE } from '../../constants/RouteConstants';
import awsconfig from '../..//aws-exports';
// import Amplify, { Auth } from 'aws-amplify';

import { createStyles, makeStyles } from '@mui/styles';
import { Grid, List, Theme, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import { snackBarMessages } from '../../constants/UIStringConstants';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../redux/store'
import WritingPage from '../Writing/WritingPage';
import PhotosPage from '../Photos/PhotosPage';
import SocialFollowBox from './components/SocialFollowBox';
import LoginLogout from './components/LoginLogout';
import { BiteButton } from '../../components/BiteButton';

const drawerWidth = 240;
// Amplify.configure(awsconfig);
// Auth.configure(awsconfig);

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        container: {
            display: "flex",
            flexGrow: 1,
        },
        root: {
            width: '100%',
            backgroundColor: '#CCC7C4',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            fontSize: "calc(10px + 5vmin)",
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        toolbar: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "35px",
        },
        content: {
            flexGrow: 1,
            padding: 3,
        },

        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        grid: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    })));

const App: React.FC = () => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isShowingLoginLogout, setIsShowingLoginLogout] = useState<boolean>(false)

    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)
    const firstSectionItems = [WRITING_PAGE, PHOTOS_PAGE];

    let navigate = useNavigate();

    const addSideBarItems = (sectionList) => {
        return (sectionList.map(({ name, label, path }, index) => (
            <ListItem button
                key={name}
                onClick={() => {
                    navigate(path);
                }}>
                <ListItemText primary={label} />
            </ListItem>
        ))
        )
    }

    const loadingPopup = (
        <Fragment>
            <Modal
                open={isLoading}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.Modal}
            >
                <BiteCircularProgress size={150} />
            </Modal>

            <Snackbar
                open={failureSnackBar}
                onClose={() => setIsLoading(false)}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#e84141', whiteSpace: "pre-line" }}
                    message={snackBarMessages.LOGOUT_FAILED}
                />
            </Snackbar>
        </Fragment>
    )

    const loginLogoutPopup = (
        <Fragment>
            <Modal
                open={isShowingLoginLogout}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className={classes.Modal}
            >
                <LoginLogout />
            </Modal>
        </Fragment>
    )

    return (
        <Provider store={store}>
            <div>
                {loadingPopup}
                {loginLogoutPopup}

                <div className={classes.container}>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="left"
                    >

                        <Grid container direction="column" spacing={0}>
                            <Grid item xs={2}>
                                <Typography variant="h5">Isaac Patterson</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <SocialFollowBox />
                            </Grid>
                        </Grid>

                        <Divider />

                        <List>
                            {addSideBarItems(firstSectionItems)}
                        </List>

                        <Divider />

                        <BiteButton
                            variant="contained"
                            onClick={() => { setIsShowingLoginLogout(true) }}
                        >
                            Sign In
                        </BiteButton>
                    </Drawer>

                    <main className={classes.content}>
                        <Routes>
                            <Route path="writing" element={<WritingPage />}></Route>
                            <Route path="photos" element={<PhotosPage />}></Route>
                        </Routes>
                    </main>
                </div>
            </div>
        </Provider>
    );
};

export default App;