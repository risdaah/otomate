import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react"
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { editSupplier } from '../supplierSlice';
import { SUPPLIERDATA } from '../index';

function EditModalBodySupplier({ closeModal, is_supplier }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [supplierObj, setSupplierObj] = useState(SUPPLIERDATA);

    useEffect(() => {
        const supplier = SUPPLIERDATA.find((c) => c.id === is_supplier);
        console.log("Supplier found:", supplier);
        if (supplier) {
            setSupplierObj(supplier);
        }
    }, [is_supplier]);

    const saveEditSupplier = () => {
        const editSupplierObj = {
            id: is_supplier,
            ...supplierObj,
        };
     
        dispatch(editSupplier(editSupplierObj));    
        dispatch(showNotification({ message: "Edit Supplier Success!", status: 1 }));   
        closeModal();
    };
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setSupplierObj({ ...supplierObj, [updateType]: value });
    };    

    return (
        <>
            <InputText
                type="text"
                value={supplierObj.nama_supplier}
                onChange={(e) =>
                    setSupplierObj({
                        ...supplierObj,
                        nama_supplier: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Nama Supplier" 
                placeholder={supplierObj.nama_supplier}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={supplierObj.tipe_mobil}
                onChange={(e) =>
                    setSupplierObj({
                        ...supplierObj,
                        tipe_mobil: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Tipe Mobil" 
                placeholder={supplierObj.tipe_mobil}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={supplierObj.telp}
                onChange={(e) =>
                    setSupplierObj({
                        ...supplierObj,
                        telp: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Telepon Supplier" 
                placeholder={supplierObj.telp}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={supplierObj.alamat_supplier}
                onChange={(e) =>
                    setSupplierObj({
                        ...supplierObj,
                        alamat_supplier: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Alamat Supplier" 
                placeholder={supplierObj.alamat_supplier}
                updateFormValue={updateFormValue} 
            />

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={saveEditSupplier}>Save</button>
            </div>
        </>
    );
}

export default EditModalBodySupplier;
