import React, { ComponentType } from "react";

export interface Route {
  path: string;
  exact: boolean;
  name?: string;
  component: ComponentType;
}

const routes: Route[] = [
  {
    path: "/:lang?/order",
    exact: true,
    component: React.lazy(() => import("pages/BuyPage/BuyPage")),
  },
  {
    path: "/:lang?/order-review",
    exact: true,
    component: React.lazy(
      () => import("pages/OrderReviewPage/OrderReviewPage")
    ),
  },
  {
    path: "/:lang?/order-result",
    exact: true,
    component: React.lazy(
      () => import("pages/OrderResultPage/OrderResultPage")
    ),
  },
  {
    path: "/:lang?/vop",
    exact: true,
    component: React.lazy(() => import("pages/VOPPage/VOPPage")),
  },
  {
    path: "/:lang?/gdpr",
    exact: true,
    component: React.lazy(() => import("pages/GDPRPage/GDPRPage")),
  },
  {
    path: "/:lang?",
    exact: true,
    component: React.lazy(() => import("pages/LandingPage/LandingPage")),
  },
];

const headerlessRoutes: Route[] = [];

export { routes, headerlessRoutes };
