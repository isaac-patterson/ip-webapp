import React, { Fragment, useState } from 'react';
import "./Drawer.css";
import { PrivateRoute } from '../../helperFunctions/privateRoute';
import { Switch, useRouteMatch, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify"

import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import { BiteButton } from '../../components/BiteButton'
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
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
    })));

const BiteDrawer: React.FC = () => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)
    // const firstSectionItems = [ORDERS_PAGE];
    // const secondSectionItems = [EDIT_RESTAURANT_PAGE];

    let history = useHistory();
    let { url } = useRouteMatch();

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