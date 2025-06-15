// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))

// Added
const AllProduct = lazy(() => import('../pages/protected/AllProduct'))
const Category = lazy(() => import('../pages/protected/Category'))
const Supply = lazy(() => import('../pages/protected/Supply'))
const CreateSupply = lazy(() => import('../pages/protected/CreateSupply'))
const Supplier = lazy(() => import('../pages/protected/Supplier'))
const People = lazy(() => import('../pages/protected/People'))

// Supplier
const DashboardSupplier = lazy(() => import('../pages/protected/DashboardSupplier'))
const Invoice = lazy(() => import('../pages/protected/Invoice'))
const Pesanan = lazy(() => import('../pages/protected/Pesanan'))

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/dashboard-supplier',
    component: DashboardSupplier,
    allowedRoles: ['supplier'],
  },
  {
    path: '/welcome',
    component: Welcome,
    allowedRoles: ['supplier', 'bengkel'],
  },
  {
    path: '/leads',
    component: Leads,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/settings-team',
    component: Team,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/calendar',
    component: Calendar,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/transactions',
    component: Transactions,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/settings-billing',
    component: Bills,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/getting-started',
    component: GettingStarted,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/features',
    component: DocFeatures,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/components',
    component: DocComponents,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/integration',
    component: Integration,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/charts',
    component: Charts,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/404',
    component: Page404,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/blank',
    component: Blank,
    allowedRoles: ['bengkel', 'supplier'],
  },
  {
    path: '/all-product',
    component: AllProduct,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/category',
    component: Category,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/supply',
    component: Supply,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/create-supply',
    component: CreateSupply,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/supplier',
    component: Supplier,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/people',
    component: People,
    allowedRoles: ['bengkel'],
  },
  {
    path: '/invoice',
    component: Invoice,
    allowedRoles: ['supplier'],
  },
  {
    path: '/pesanan',
    component: Pesanan,
    allowedRoles: ['supplier'],
  },
]

export default routes
