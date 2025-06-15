import routes from '../routes/sidebar'
import { NavLink, Link, useLocation } from 'react-router-dom'
import SidebarSubmenu from './SidebarSubmenu';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { useDispatch } from 'react-redux'

function LeftSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()

  const close = () => {
    document.getElementById('left-sidebar-drawer').click()
  }

  const role = localStorage.getItem("role") // Ambil role dari localStorage

  // Filter routes berdasarkan role
  const filteredRoutes = routes
    .filter((route) => {
      if (!route.roles) return true
      return route.roles.includes(role)
    })
    .map((route) => {
      if (route.submenu) {
        const filteredSubmenu = route.submenu.filter((sub) => {
          if (!sub.roles) return true
          return sub.roles.includes(role)
        })
        // Jika tidak ada submenu yang cocok dengan role, skip route ini
        if (filteredSubmenu.length === 0) return null
        return { ...route, submenu: filteredSubmenu }
      }
      return route
    })
    .filter(Boolean) // buang yang null karena submenu kosong

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={close}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link to={'/app/dashboard'}>
            <img
              className="mask mask-squircle w-10"
              src="/logo192.png"
              alt="Otomate Logo"
            />
            Otomate
          </Link>
        </li>

        {filteredRoutes.map((route, k) => (
          <li key={k}>
            {route.submenu ? (
              <SidebarSubmenu {...route} />
            ) : (
              <NavLink
                end
                to={route.path}
                className={({ isActive }) =>
                  `${isActive ? 'font-semibold bg-base-200' : 'font-normal'}`
                }
              >
                {route.icon} {route.name}
                {location.pathname === route.path ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeftSidebar
