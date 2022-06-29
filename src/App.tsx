import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch, useHistory } from "react-router-dom";

import { history } from "store";
import { Route as IRoute, routes } from "helpers/routes";

import { Footer, Header, ScrollToTop, Toast, TopBanner } from "components";
import { useAppDispatch, useAppSelector } from "hooks";
import { initPageGlobalState, selectToast, setToast } from "store/global";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Redirect } from "react-router";
import "react-loading-skeleton/dist/skeleton.css";
import { PostLoginHandlerWrapper } from "./hooks/useLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const RequireAuthRoute = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Redirect to={"/"} />
      </UnauthenticatedTemplate>
    </>
  );
};

const renderRoute = (route: IRoute) => (
  <Route
    key={route.path}
    exact={route.exact}
    path={route.path}
    render={() =>
      route.requireAuth ? (
        <RequireAuthRoute>
          <route.component />
        </RequireAuthRoute>
      ) : (
        <route.component />
      )
    }
  />
);

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    dispatch(initPageGlobalState());
  }, [dispatch]);

  console.log("bam");
  console.log(process.env.SENTRY_DSN);
  console.log(process.env.REACT_APP_SENTRY_DSN);

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectedRouter history={history}>
        <PostLoginHandlerWrapper>
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

              <Switch>
                {/* https://stackoverflow.com/a/66114844 */}
                <Route
                  path="/refresh"
                  exact={true}
                  component={() => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const history = useHistory();
                    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
                    useEffect(() => history.goBack(), []);
                    return <></>;
                  }}
                />
                {routes.map(renderRoute)}
              </Switch>
            </main>
            <Footer />
          </ScrollToTop>
        </PostLoginHandlerWrapper>
      </ConnectedRouter>
    </QueryClientProvider>
  );
}

export default App;
