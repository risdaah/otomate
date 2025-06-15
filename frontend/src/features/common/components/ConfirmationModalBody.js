import { useDispatch } from 'react-redux'
import { CONFIRMATION_MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteLead } from '../../leads/leadSlice'
import { showNotification } from '../headerSlice'
import { deleteCategoryApi, getCategories } from '../../product/category/categorySlice'
import { deleteProductAsync } from '../../product/allProduct/productSlice'

function ConfirmationModalBody({ extraObject, closeModal}){
  const dispatch = useDispatch()
  const { message, type, index, id_kategori } = extraObject

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
      dispatch(deleteLead({ index }))
      dispatch(showNotification({ message: "Lead Deleted!", status: 1 }))
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.CATEGORY_DELETE) {
      await dispatch(deleteCategoryApi(id_kategori))
      await dispatch(getCategories())
      dispatch(showNotification({ message: "Category Deleted!", status: 1 }))
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.PRODUCT_DELETE) {
      await dispatch(deleteProductAsync(index))
      dispatch(showNotification({ message: "Product Deleted!", status: 1 }))
    }

    closeModal()
  }

  return (
    <>
      <p className='text-xl mt-8 text-center'>
        {message}
      </p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary w-36" onClick={proceedWithYes}>Yes</button>
      </div>
    </>
  )
}

export default ConfirmationModalBody
