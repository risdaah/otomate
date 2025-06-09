import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CreateSupply from '../../features/supply/createRFQ'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Create Supply"}))
      }, [])


    return(
        < CreateSupply />
    )
}

export default InternalPage