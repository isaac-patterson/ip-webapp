import { Switch, Route, HashRouter } from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../..//aws-exports';
import { Provider } from 'react-redux'
import store from '../../redux/store'
import { BITE_DRAWER } from "../../constants/RouteConstants";

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <HashRouter>
                <Switch>
                    {/* {Object.keys(routes).map(key => addRoute(key))} */}
                    <Route
                        path={BITE_DRAWER.path}
                        exact={true}
                        component={BITE_DRAWER.component}
                    />
                </Switch>
            </HashRouter>
        </Provider>
    )
}

export default App;
