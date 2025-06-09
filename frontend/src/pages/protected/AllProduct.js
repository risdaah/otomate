import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AllProduct from '../../features/product/allProduct'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Semua Barang"}))
      }, [])


    return(
        < AllProduct />
    )
}

export default InternalPage