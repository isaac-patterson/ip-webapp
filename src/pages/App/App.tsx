import { Switch, Route, HashRouter } from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../..//aws-exports';
import { Provider } from 'react-redux'
import store from '../../redux/store'
import { BITE_DRAWER, LANDING_PAGE } from "../../constants/RouteConstants";
import PrivateRoute from "../../helperFunctions/privateRoute";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <HashRouter>
                <Switch>
                    {/* {Object.keys(routes).map(key => addRoute(key))} */}
                    <Route
                        path={LANDING_PAGE.path}
                        exact={true}
                        component={LANDING_PAGE.component}
                    />
                    <PrivateRoute
                        path={BITE_DRAWER.path}
                        component={BITE_DRAWER.component}
                        children={null}
                    />
                </Switch>
            </HashRouter>
        </Provider>
    )
}

export default App;
