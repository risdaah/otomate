import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import {showNotification} from '../../features/common/headerSlice'
import DashboardSupplier from '../../features/dashboardsupplier'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(showNotification({message : "Welcome to Dashboard Supplier", status : 1}))
        dispatch(setPageTitle({ title : "Dashboard Supplier"}))
      }, [])


    return(
        <DashboardSupplier />
    )
}

export default InternalPage