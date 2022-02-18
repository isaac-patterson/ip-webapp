import React, { useState } from 'react';

import { createStyles, makeStyles } from '@mui/styles';
import { Grid, Paper, TextField, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { Auth } from 'aws-amplify';
import { BiteButton } from '../../../components/BiteButton';

const useStyles = makeStyles((theme: Theme) => (
    createStyles({
        button: {
            cursor: 'pointer',
            '&:hover': {
                color: "#78BDEB",
            },
        },
        ModalContent: {
            width: '80%',
            height: '50%',
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

const LoginLogout: React.FC = () => {
    const classes = useStyles()
    let navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [failureSnackBar, setFailureSnackBar] = useState<boolean>(false)

    const signIn = async (username, password) => {
        setIsLoading(true)
        // try {
        //     await Auth.signIn(username, password)
        // } catch (error) {
        //     // if (
        //     //     error.code === "InvalidParameterException" ||
        //     //     error.code === "NotAuthorizedException" ||
        //     //     (username === "" && password === "")
        //     // ) setFailedLoginSnackBar(true)
        //     // else setFailureSnackBar(true)
        //     console.log('error signing in', error);
        // }
        setIsLoading(false)
    }

    const signOut = async () => {
        setIsLoading(true)

        // try {
        //     await Auth.signOut({ global: true });
        //     navigate("/")
        //     window.location.reload()

        // } catch (error) {
        //     console.log(error)
        //     setFailureSnackBar(true)
        // }
    }

    return (
        <div>
            <Paper elevation={6} square className={classes.ModalContent}>
                <Grid container alignItems="center" direction="column" justifyContent="center" spacing={2} className={classes.Modal}>
                    <Grid item >
                        <TextField className={classes.TextField}
                            id="outlined-basic"
                            label="Email"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </Grid>

                    <Grid item >
                        <TextField className={classes.TextField}
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item >
                        <BiteButton className={classes.Button}
                            variant="contained"
                            onClick={() => { signIn(username, password) }}
                        >
                            Sign In
                        </BiteButton>
                    </Grid>

                    <Grid item >
                        <BiteButton
                            onClick={() => signOut()}
                            variant="contained"
                        >
                            Sign Out
                        </BiteButton>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default LoginLogout;