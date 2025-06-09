import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Supply from '../../features/supply/allRFQ'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Semua Supply"}))
      }, [])


    return(
        < Supply />
    )
}

export default InternalPage