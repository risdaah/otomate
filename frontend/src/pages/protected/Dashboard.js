import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import {showNotification} from '../../features/common/headerSlice'
import Dashboard from '../../features/dashboard/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(showNotification({message : "Welcome to Dashboard Bengkel Nugraha Jaya", status : 1}))
        dispatch(setPageTitle({ title : "Dashboard"}))
      }, [])


    return(
        <Dashboard />
    )
}

export default InternalPage