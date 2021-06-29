import React, { useEffect } from "react";

import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";

import { history } from "store";
import { routes, Route as IRoute } from "helpers/routes";

import { Header, TopBanner, Footer, Toast, ScrollToTop } from "components";
import { useAppDispatch, useAppSelector } from "hooks";
import { initPageGlobalState, selectToast, setToast } from "store/global";

const renderRoute = (route: IRoute) => (
    <Route
        key={route.path}
        exact={route.exact}
        path={route.path}
        render={() => <route.component />}
    />
);

function App() {
    const dispatch = useAppDispatch();
    const toast = useAppSelector(selectToast);
    useEffect(() => {
        dispatch(initPageGlobalState());
    }, [dispatch]);
    return (
        <ConnectedRouter history={history}>
            <ScrollToTop>
                <Toast
                    open={toast !== undefined}
                    type={toast?.type}
                    text={toast?.message}
                    onClose={() => {
                        dispatch(setToast(undefined));
                    }}
                    timeToClose={toast?.type === "success" ? 3000 : undefined}
                    closeButton={toast?.type !== "success"}
                />
                <TopBanner />
                <main className="relative flex flex-col" style={{ flex: 1 }}>
                    <Header />

                    <Switch>{routes.map(renderRoute)}</Switch>
                </main>
                <Footer />
            </ScrollToTop>
        </ConnectedRouter>
    );
}

export default App;
