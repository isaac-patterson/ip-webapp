import React, { Fragment, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from "react-router-dom";
import { BITE_DRAWER, ORDERS_PAGE } from "../../constants/RouteConstants";

import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { BiteCircularProgress } from "../../components/BiteCircularProgress"
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

import { snackBarMessages } from '../../constants/UIStringConstants';
import { BiteButton } from '../../components/BiteButton';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        root: {
            width: '100%',
            backgroundColor: '#FFFFFF',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            fontSize: "calc(10px + 5vmin)",
            minHeight: '100vh',
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
        Modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    })
));

const LandingPage: React.FC = () => {
    useEffect(() => {
        Auth.currentSession().then(response => {
            if (response.isValid()) {
                history.push(BITE_DRAWER.path);

            } else { console.log("Not logged in") }
        }).catch(() => { console.log("Not logged in") })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const history = useHistory();
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)
    const [failedLoginSnackBar, setFailedLoginSnackBar] = useState<boolean>(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async (username, password) => {
        setIsLoading(true)
        try {
            await Auth.signIn(username, password)
            history.push(`${BITE_DRAWER.path}/${ORDERS_PAGE.path}`)

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
                onClose={() => setFailureSnackBar(!failureSnackBar)}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#e84141' }}
                    message={snackBarMessages.LOGIN_FAILED}
                />
            </Snackbar>

            <Snackbar
                open={failedLoginSnackBar}
                onClose={() => setFailedLoginSnackBar(!failedLoginSnackBar)}
                autoHideDuration={3000}
            >
                <SnackbarContent style={{ backgroundColor: '#e84141' }}
                    message={snackBarMessages.INCORRECT_CREDITIALS}
                />
            </Snackbar>
        </Fragment>
    )

    return (
        <div>
            {popups}

            <div className={classes.root}>
                <h2>Bite</h2>
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
            </div>
        </div>
    );
};

export default LandingPage;