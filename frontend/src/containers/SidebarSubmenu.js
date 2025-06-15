import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function SidebarSubmenu({ submenu = [], name, icon }) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)

  // Buka otomatis jika halaman aktif berada dalam salah satu submenu
  useEffect(() => {
    if (submenu.some((item) => item.path === location.pathname)) {
      setIsExpanded(true)
    }
  }, [location.pathname, submenu])

  return (
    <div className="flex flex-col">
      {/* Judul dan ikon menu utama */}
      <div
        className="w-full block cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {icon} {name}
        <ChevronDownIcon
          className={
            'w-5 h-5 mt-1 float-right transition-all duration-300 ' +
            (isExpanded ? 'rotate-180' : '')
          }
        />
      </div>

      {/* Daftar submenu */}
      {isExpanded && submenu.length > 0 && (
        <div className="w-full">
          <ul className="menu menu-compact">
            {submenu.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                  {item.icon} {item.name}
                  {location.pathname === item.path && (
                    <span
                      className="absolute mt-1 mb-1 inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SidebarSubmenu
