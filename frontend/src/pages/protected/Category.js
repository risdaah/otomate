import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Category from '../../features/product/category'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Semua Kategori"}))
      }, [])


    return(
        < Category />
    )
}

export default InternalPage