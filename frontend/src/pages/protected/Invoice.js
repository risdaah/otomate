import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import Invoice from '../../features/invoice';
import { setPageTitle } from '../../features/common/headerSlice';

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(setPageTitle({title: "Invoice Pesanan"}))
    }, [])

    return(
        <Invoice />
    )
}

export default InternalPage
