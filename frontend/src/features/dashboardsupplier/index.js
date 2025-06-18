import DashboardStats from './components/DashboardStats'
import AmountStats from './components/AmountStats'
import PageStats from './components/PageStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
import UserChannels from './components/UserChannels'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import DashboardTopBar from './components/DashboardTopBar'
import { useDispatch } from 'react-redux'
import {showNotification} from '../common/headerSlice'
import DoughnutChart from './components/DoughnutChart'
import { useState, useEffect } from 'react'

function DashboardSupplier(){

    const dispatch = useDispatch()

    const [statsData, setStatsData] = useState([
        {title : "Total Revenue", value : "Loading...", icon : <UserGroupIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Total Pemesanan", value : "Loading...", icon : <CreditCardIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Pesanan Diterima", value : "Loading...", icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Invoice Pesanan", value : "Loading...", icon : <UsersIcon className='w-8 h-8'/>, description : "Current month"},
    ])

    useEffect(() => {
        async function fetchStats() {
            try {
                // Get user from localStorage each time fetchStats runs
                const user = JSON.parse(localStorage.getItem('user'))
                const supplierId = user?.detail?.id_supplier || 1

                const [revenueRes, pesananRes, acceptedPesananRes, invoiceRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/pesanan-total-revenue/${supplierId}`),
                    fetch(`http://localhost:5000/api/pesanan-count/${supplierId}`),
                    fetch(`http://localhost:5000/api/pesanan-count-accepted/${supplierId}`),
                    fetch(`http://localhost:5000/api/invoice-count/${supplierId}`)
                ])

                const revenueData = await revenueRes.json()
                const pesananData = await pesananRes.json()
                const acceptedPesananData = await acceptedPesananRes.json()
                const invoiceData = await invoiceRes.json()

                setStatsData([
                    {title : "Total Revenue", value : `Rp.${revenueData.totalRevenue?.toLocaleString() || 0}`, description : "Current month"},
                    {title : "Total Seluruh Permintaan", value : `${pesananData.count || 0} Pesanan`, icon : <CreditCardIcon className='w-8 h-8'/>, description : "Current month"},
                    {title : "Supply Selesai", value : `${acceptedPesananData.count || 0} Terkirim`, icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current month"},
                    {title : "Invoice Pesanan", value : `${invoiceData.count || 0} Invoice`, icon : <UsersIcon className='w-8 h-8'/>, description : "Current month"},
                ])
            } catch (error) {
                dispatch(showNotification({message : `Failed to load dashboard stats: ${error.message}`, status : 0}))
                setStatsData([
                    {title : "Total Revenue", value : "Error", description : "Current"},
                    {title : "Total Pemesanan", value : "Error", icon : <CreditCardIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Pesanan Diterima", value : "Error", icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Invoice Pesanan", value : "Error", icon : <UsersIcon className='w-8 h-8'/>, description : "Current month"},
                ])
            }
        }
        fetchStats()
    }, [dispatch])

    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        dispatch(showNotification({message : `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status : 1}))
    }

    return(
        <>
        {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>

        {/** ---------------------- Different charts ------------------------- */}
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div>
            
        {/** ---------------------- Different stats content 2 ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div> */}

        {/** ---------------------- User source channels table  ------------------------- */}
        
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <UserChannels />
                <DoughnutChart />
            </div> */}
        </>
    )
 }

export default DashboardSupplier
