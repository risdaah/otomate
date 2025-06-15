import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Pesanan from '../../features/pesanan';
import { setPageTitle } from '../../features/common/headerSlice';

function InternalPage(){
  const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Semua Pesanan"}))
      }, [])


    return(
        < Pesanan />
    )
}

export default InternalPage
