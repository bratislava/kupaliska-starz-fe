import React, { ComponentType } from "react";

export interface Route {
  path: string;
  exact: boolean;
  name?: string;
  component: ComponentType;
}

const routes: Route[] = [
  {
    path: "/order",
    exact: true,
    component: React.lazy(() => import("pages/BuyPage/BuyPage")),
  },
  {
    path: "/order-review",
    exact: true,
    component: React.lazy(
      () => import("pages/OrderReviewPage/OrderReviewPage")
    ),
  },
  {
    path: "/order-result",
    exact: true,
    component: React.lazy(
      () => import("pages/OrderResultPage/OrderResultPage")
    ),
  },
  {
    path: "/vop",
    exact: true,
    component: React.lazy(() => import("pages/VOPPage/VOPPage")),
  },
  {
    path: "/gdpr",
    exact: true,
    component: React.lazy(() => import("pages/GDPRPage/GDPRPage")),
  },
  {
    path: "",
    exact: true,
    component: React.lazy(() => import("pages/LandingPage/LandingPage")),
  },
];

const headerlessRoutes: Route[] = [];

export { routes, headerlessRoutes };
