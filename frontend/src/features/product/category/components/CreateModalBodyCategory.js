import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../../components/Input/InputText'
import ErrorText from '../../../../components/Typography/ErrorText'
import { showNotification } from "../../../common/headerSlice"
import { addNewCategory } from '../categorySlice';

const INITIAL_CATEGORY_OBJ = {  
    nama: "", 
} 

function CreateModalBodyCategory({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [CategoryObj, setCategoryObj] = useState(INITIAL_CATEGORY_OBJ)
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setCategoryObj({ ...CategoryObj, gambar: fileURL }); 
        } else {
            setFileName(""); 
        }
    };   


    const saveNewCategory = () => {
        if(CategoryObj.nama.trim() === "") return setErrorMessage("Nama is required!")
        else {
            let newCategoryObj = {
                "id_kategori": 3, 
                "nama": CategoryObj.nama, 
            }
            if (newCategoryObj.gambar.startsWith("blob:")) {
                newCategoryObj.gambar = null;
            }
            console.log('Dispatching addNewCategory', newCategoryObj);
            dispatch(addNewCategory({ newCategoryObj }));

            dispatch(showNotification({ message: "New Category Added!", status: 1 }))
            closeModal()
        }
    }
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setCategoryObj({ ...CategoryObj, [updateType]: value });
    };    

    return(
        <>
            <InputText 
                type="text" 
                defaultValue={CategoryObj.nama} 
                updateType="nama" 
                labelTitle="Nama Kategori" 
                updateFormValue={updateFormValue} 
            />

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewCategory()}>Save</button>
            </div>
        </>
    )
}

export default CreateModalBodyCategory
