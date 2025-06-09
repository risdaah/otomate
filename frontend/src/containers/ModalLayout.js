import { useEffect } from 'react'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'

// Added 
import CreateModalBodyProduct from '../features/product/allProduct/components/CreateModalBodyProduct'
import EditModalBodyProduct from '../features/product/allProduct/components/EditModalBodyProduct'
import ViewModalBodyProduct from '../features/product/allProduct/components/ViewModalBodyProduct'

import CreateModalBodyCategory from '../features/product/category/components/CreateModalBodyCategory'
import EditModalBodyCategory from '../features/product/category/components/EditModalBodyCategory'

import EditModalBodySupply from '../features/supply/allRFQ/components/EditModalBodyRFQ'
import ViewModalBodySupply from '../features/supply/allRFQ/components/ViewModalBodyRFQ'

import CreateModalBodySupplier from '../features/supplier/components/CreateModalBodySupplier'
import EditModalBodySupplier from '../features/supplier/components/EditModalBodySupplier'
import ViewModalBodySupplier from '../features/supplier/components/ViewModalBodySupplier'

import CreateModalBodyPeople from '../features/people/components/CreateModalBodyPeople'
import EditModalBodyPeople from '../features/people/components/EditModalBodyPeople'
import ViewModalBodyPeople from '../features/people/components/ViewModalBodyPeople'

function ModalLayout(){


    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }



    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             // DEFAULT
                             [MODAL_BODY_TYPES.LEAD_ADD_NEW] : <AddLeadModalBody closeModal={close} extraObject={extraObject}/>,
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>,
                             
                             // PRODUCT
                             [MODAL_BODY_TYPES.PRODUCT_ADD_NEW] : <CreateModalBodyProduct extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.PRODUCT_EDIT] : <EditModalBodyProduct extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.PRODUCT_VIEW] : <ViewModalBodyProduct extraObject={extraObject} closeModal={close}/>,

                             // CATEGORY
                             [MODAL_BODY_TYPES.CATEGORY_ADD_NEW] : <CreateModalBodyCategory extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.CATEGORY_EDIT] : <EditModalBodyCategory extraObject={extraObject} closeModal={close}/>,

                             // SUPPLY 
                             [MODAL_BODY_TYPES.SUPPLY_EDIT] : <EditModalBodySupply extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.SUPPLY_VIEW] : <ViewModalBodySupply extraObject={extraObject} closeModal={close}/>,
                    
                             // SUPPLIER
                             [MODAL_BODY_TYPES.SUPPLIER_ADD_NEW] : <CreateModalBodySupplier extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.SUPPLIER_EDIT] : <EditModalBodySupplier extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.SUPPLIER_VIEW] : <ViewModalBodySupplier extraObject={extraObject} closeModal={close}/>,

                             // PEOPLE
                             [MODAL_BODY_TYPES.USER_ADD_NEW] : <CreateModalBodyPeople extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.USER_EDIT] : <EditModalBodyPeople extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.USER_VIEW] : <ViewModalBodyPeople extraObject={extraObject} closeModal={close}/>,

                            }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout