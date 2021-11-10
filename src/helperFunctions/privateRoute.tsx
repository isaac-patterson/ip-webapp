import { Auth } from "aws-amplify"
import React from "react";
import { useEffect, useState } from "react";
import { Route, useHistory } from "react-router-dom"
import { LANDING_PAGE } from "../constants/RouteConstants";

export const PrivateRoute = ({ children, ...rest }) => {
    const history = useHistory();
    const [auth, setAuth] = useState(false);

    const isAuthenticated = () => {
        setAuth(false);

        Auth.currentSession().then( response => {
            if(response.isValid()) {
                setAuth(true);
            } else {
                redirectToLogin();
            }
        }).catch(() => {
            redirectToLogin();
        });
    } 

    const redirectToLogin = () => {
        history.push(LANDING_PAGE.path);
        
    }

    useEffect(() => {
        isAuthenticated();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Route {...rest}>
            { auth ? children : null }
        </Route>
    )
}

export default PrivateRoute ;