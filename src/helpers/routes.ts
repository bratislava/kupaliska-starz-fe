import React, { ComponentType } from "react";

export interface Route {
  path: string;
  exact: boolean;
  name?: string;
  component: ComponentType;
  requireAuth?: boolean;
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
    path: "/:lang?/profile",
    exact: true,
    component: React.lazy(() => import("pages/ProfilePage/ProfilePage")),
    requireAuth: true,
  },
  {
    path: "/:lang?/swimmer/new",
    exact: true,
    component: React.lazy(
      () =>
        import(
          "pages/AssociatedSwimmerEditAddPage/AssociatedSwimmerEditAddPage"
        )
    ),
    requireAuth: true,
  },
  {
    path: "/:lang?/swimmer/:id",
    exact: true,
    component: React.lazy(
      () =>
        import(
          "pages/AssociatedSwimmerEditAddPage/AssociatedSwimmerEditAddPage"
        )
    ),
    requireAuth: true,
  },
  {
    path: "/:lang?/profile/edit",
    exact: true,
    component: React.lazy(
      () => import("components/ProfileEditPage/ProfileEditPage")
    ),
    requireAuth: true,
  },
  {
    path: "/:lang?/tickets",
    exact: true,
    component: React.lazy(
      () => import("pages/TicketsManagementPage/TicketsManagementPage")
    ),
    requireAuth: true,
  },
  {
    path: "/:lang?/tickets-management",
    exact: true,
    component: React.lazy(
      () => import("pages/TicketsManagementPage/TicketsManagementPage")
    ),
  },
  {
    path: "/:lang?",
    exact: true,
    component: React.lazy(() => import("pages/LandingPage/LandingPage")),
  },
];

const headerlessRoutes: Route[] = [];

export { routes, headerlessRoutes };
