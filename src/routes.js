// import views
import Dashboard from "views/User/Dashboard";
import Tables from "views/User/Tables";
import Strategies from "views/User/Strategies";
import Billing from "views/User/Billing";
import Profile from "views/User/Profile";
import Flow from "views/User/Flow";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import { AddIcon } from '@chakra-ui/icons';

export const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      }
    ],
  },
];

export const userRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: <HomeIcon color="inherit" />,
        component: Dashboard,
        layout: "/user",
    },
    {
        path: "/flow/:mode/:id",
        name: "Flow",
        icon: <AddIcon color="inherit" />,
        component: Flow,
        layout: "/user",
    },
    {
        path: "/strategies",
        name: "Strategies",
        icon: <StatsIcon color="inherit" />,
        component: Strategies,
        layout: "/user",
    },
    {
        path: "/billing",
        name: "Billing",
        icon: <CreditIcon color="inherit" />,
        component: Billing,
        layout: "/user",
    },
    {
        name: "ACCOUNT PAGES",
        category: "account",
        state: "pageCollapse",
        views: [
            {
                path: "/profile",
                name: "Profile",
                icon: <PersonIcon color="inherit" />,
                secondaryNavbar: true,
                component: Profile,
                layout: "/user",
            }
        ],
    },
];

export const authRoutes = [
    {
        path: "/signin",
        name: "Sign In",
        //icon: <HomeIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
    },
    {
        path: "/signup",
        name: "Sign Up",
        //icon: <HomeIcon color="inherit" />,
        component: SignUp,
        layout: "/auth",
    },
];
