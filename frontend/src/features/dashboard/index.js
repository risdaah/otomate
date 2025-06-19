import DashboardStats from './components/DashboardStats'
import AmountStats from './components/AmountStats'
import PageStats from './components/PageStats'

import UserGroupIcon  from '@heroicons/react/24/outline/UserGroupIcon'
import UsersIcon  from '@heroicons/react/24/outline/UsersIcon'
import CircleStackIcon  from '@heroicons/react/24/outline/CircleStackIcon'
import SwatchIcon  from '@heroicons/react/24/outline/SwatchIcon'
import CreditCardIcon  from '@heroicons/react/24/outline/CreditCardIcon'
import UserChannels from './components/UserChannels'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import DashboardTopBar from './components/DashboardTopBar'
import { useDispatch } from 'react-redux'
import {showNotification} from '../common/headerSlice'
import DoughnutChart from './components/DoughnutChart'
import { useState, useEffect } from 'react'

function Dashboard(){

    const dispatch = useDispatch()

    const [statsData, setStatsData] = useState([
        {title : "Total Cost", value : "Loading...", icon : <CreditCardIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Produk", value : "Loading...", icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Kategori", value : "Loading...", icon : <SwatchIcon className='w-8 h-8'/>, description : "Current month"},
        {title : "Supplier", value : "Loading...", icon : <UserGroupIcon className='w-8 h-8'/>, description : "Current period"},
    ])

    useEffect(() => {
        async function fetchStats() {
            try {
                const [produkRes, kategoriRes, supplierRes, costRes] = await Promise.all([
                    fetch('http://localhost:5000/api/produk-count'),
                    fetch('http://localhost:5000/api/kategori-count'),
                    fetch('http://localhost:5000/api/supplier-count'),
                    fetch('http://localhost:5000/api/total-count')
                ])

                const produkData = await produkRes.json()
                const kategoriData = await kategoriRes.json()
                const supplierData = await supplierRes.json()
                const costData = await costRes.json()

                setStatsData([
                    {title : "Total Cost", value : `Rp${costData.totalCost.toLocaleString()}`, description : "Current"},
                    {title : "Produk", value : `${produkData.totalProduk} Item`, icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Kategori", value : `${kategoriData.totalKategori} Jenis`, icon : <SwatchIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Supplier", value : `${supplierData.totalSuppliers} Supplier`, icon : <UserGroupIcon className='w-8 h-8'/>, description : "Current period"},
                ])
            } catch (error) {
                dispatch(showNotification({message : `Failed to load dashboard stats: ${error.message}`, status : 0}))
                setStatsData([
                    {title : "Total Cost", value : "Error", description : "Current"},
                    {title : "Produk", value : "Error", icon : <CircleStackIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Kategori", value : "Error", icon : <SwatchIcon className='w-8 h-8'/>, description : "Current"},
                    {title : "Supplier", value : "Error", icon : <UserGroupIcon className='w-8 h-8'/>, description : "Current period"},
                ])
            }
        }
        fetchStats()
    }, [dispatch])

    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        // dispatch(showNotification({message : `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status : 1}))
    }

    return(
        <>
        {/** ---------------------- Select Period Content ------------------------- */}
            {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/> */}
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-10 md:grid-cols-2 grid-cols-1 gap-6">
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

export default Dashboard
