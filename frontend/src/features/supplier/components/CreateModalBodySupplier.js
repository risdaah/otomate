import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewSupplier } from '../supplierSlice';

const INITIAL_SUPPLIER_OBJ = {  
    nama_supplier: "", 
    tipe_mobil: "", 
    telp: "", 
    alamat_supplier: ""
} 

function CreateModalBodySupplier({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [SupplierObj, setSupplierObj] = useState(INITIAL_SUPPLIER_OBJ)
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setSupplierObj({ ...SupplierObj, gambar: fileURL }); 
        } else {
            setFileName(""); 
        }
    };   


    const saveNewSupplier = () => {
        if(SupplierObj.nama_supplier.trim() === "") return setErrorMessage("Nama Supplier is required!")
        else {
            let newSupplierObj = {
                "id_supplier": 1, 
                "is_user": 1, 
                "nama_supplier": SupplierObj.nama_supplier, 
                "tipe_mobil": SupplierObj.tipe_mobil,
                "alamat_supplier": SupplierObj.alamat_supplier,
            }
            console.log('Dispatching addNewSupplier', newSupplierObj);
            dispatch(addNewSupplier({ newSupplierObj }));

            dispatch(showNotification({ message: "New Supplier Added!", status: 1 }))
            closeModal()
        }
    }
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setSupplierObj({ ...SupplierObj, [updateType]: value });
    };    

    return(
        <>
            <InputText 
                type="text" 
                defaultValue={SupplierObj.nama_supplier} 
                updateType="nama_supplier" 
                labelTitle="Nama Supplier" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={SupplierObj.tipe_mobil} 
                updateType="tipe_mobil" 
                labelTitle="Tipe Mobil" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={SupplierObj.telp} 
                updateType="telp" 
                labelTitle="Telpon SUpplier" 
                updateFormValue={updateFormValue} 
            />

            <TextAreaInput 
                type="text" 
                defaultValue={SupplierObj.alamat_supplier} 
                updateType="alamat_supplier" 
                labelTitle="Alamat Supplier" 
                updateFormValue={updateFormValue} 
            />

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewSupplier()}>Save</button>
            </div>
        </>
    )
}

export default CreateModalBodySupplier
