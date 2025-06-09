import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Supplier from '../../features/supplier'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Semua Supply"}))
      }, [])


    return(
        < Supplier />
    )
}

export default InternalPage