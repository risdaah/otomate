/** Icons are imported separatly to reduce build time */
import BellIcon from '@heroicons/react/24/outline/BellIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import InboxStackIcon from '@heroicons/react/24/outline/InboxStackIcon'
import FolderIcon from '@heroicons/react/24/outline/FolderIcon'
import TruckIcon from '@heroicons/react/24/outline/TruckIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
    roles: ['bengkel'],
  },

  {
    path: "", //no url needed as this has submenu
    icon: <FolderIcon className={`${iconClasses} inline`} />, // icon component
    name: "Product", // name that appear in Sidebar
    roles: ['bengkel'],
    submenu: [
      {
        path: "/app/all-product",
        name: "Semua Produk",
        roles: ['bengkel'],
      },     
      {
        path: "/app/category", //url
        name: "Kategori", // name that appear in Sidebar
        roles: ['bengkel'],
      },
    ],
  },

  {
    path: "", //no url needed as this has submenu
    icon: <InboxStackIcon className={`${iconClasses} inline`} />, // icon component
    name: "Supply", // name that appear in Sidebar
    roles: ['bengkel'],
    submenu: [
      {
        path: '/app/supply',
        name: 'All RFQ',
        roles: ['bengkel'],
      },
      {
        path: '/app/create-supply',
        name: 'Create RFQ',
        roles: ['bengkel'],
      },
    ],
  },
  {
    path: '/app/people',
    icon: <UsersIcon className={iconClasses}/>, 
    name: 'User',
    roles: ['bengkel'],
  },

  // supplier menu routes
  {
  path: "/app/dashboard-supplier",
  icon: <TruckIcon className={iconClasses} />,
  name: "Dashboard Supplier",
  roles: ['supplier'],
  },
  {
    path: "/app/invoice",
    icon: <DocumentIcon className={iconClasses} />,
    name: "Invoice",
    roles: ['supplier'],
  },
  {
    path: "/app/pesanan",
    icon: <InboxArrowDownIcon className={iconClasses} />,
    name: "Pesanan",
    roles: ['supplier'],
  },

]

export default routes
