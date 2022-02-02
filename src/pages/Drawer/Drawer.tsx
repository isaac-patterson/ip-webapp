import React, { Fragment, useState } from 'react';
import "./Drawer.css";
import { Switch, useRouteMatch, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify"

import { createStyles, makeStyles } from '@mui/styles';
import { TextField, Theme } from '@mui/material';
import { BiteButton } from '../../components/BiteButton'
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

import { snackBarMessages } from '../../constants/UIStringConstants';

const drawerWidth = 240;

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
            // backgroundColor: theme.palette.background.default,
            padding: 3,
        },
        signOutButton: {
            position: "fixed",
            bottom: 0,
            textAlign: "center",
            paddingBottom: 10,
            padding: 10,
        },
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        TextField: {
            width: "15%",
            margin: "1%"
        },

        Button: {
            width: "15%",
            margin: "1%",
        },
    })));

const BiteDrawer: React.FC = () => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)
    // const secondSectionItems = [EDIT_RESTAURANT_PAGE];

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    let history = useHistory();
    let { url } = useRouteMatch();

    const signIn = async (username, password) => {
        setIsLoading(true)
        try {
            await Auth.signIn(username, password)
        } catch (error) {
            // if (
            //     error.code === "InvalidParameterException" ||
            //     error.code === "NotAuthorizedException" ||
            //     (username === "" && password === "")
            // ) setFailedLoginSnackBar(true)
            // else setFailureSnackBar(true)
            console.log('error signing in', error);
        }
        setIsLoading(false)
    }

    const signOut = async () => {
        setIsLoading(true)

        try {
            await Auth.signOut({ global: true });
            history.push("/")
            window.location.reload()

        } catch (error) {
            console.log(error)
            setFailureSnackBar(true)
        }
    }

    const addSideBarItems = (sectionList) => {
        return (sectionList.map(({ name, label, path }, index) => (
            <ListItem button
                key={name}
                onClick={() => {
                    history.push(`${url}/${path}`);
                }}>
                <ListItemText primary={label} />
            </ListItem>
        ))
        )
    }

    const popups = (
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

    return (

        <div>
            {popups}

            <div className={classes.container}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                 

                    <Divider />

                    {/* <List>
                        {addSideBarItems(firstSectionItems)}
                    </List>

                    <Divider />

                    <List>
                        {addSideBarItems(secondSectionItems)}
                    </List> */}

                <h2>Isaac Patterson</h2>

                
                <TextField className={classes.TextField}
                    id="outlined-basic"
                    label="Email"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />

                <TextField className={classes.TextField}
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <BiteButton className={classes.Button}
                    variant="contained"
                    onClick={() => { signIn(username, password) }}
                >
                    Sign In
                </BiteButton>

                    <div className={classes.signOutButton}>
                        <BiteButton
                            onClick={() => signOut()}
                            variant="contained"
                        >
                            Sign Out
                        </BiteButton>
                    </div>
                </Drawer>

                <main className={classes.content}>
                    <Switch>
                        {/* <PrivateRoute
                            path={`${url}/${ORDERS_PAGE.path}`}
                            component={ORDERS_PAGE.component}
                            children={null}
                        />
                        <PrivateRoute
                            path={`${url}/${EDIT_RESTAURANT_PAGE.path}`}
                            component={EDIT_RESTAURANT_PAGE.component}
                            children={null}
                        /> */}
                    </Switch>
                </main>
            </div>
        </div>

    );
};

export default BiteDrawer;