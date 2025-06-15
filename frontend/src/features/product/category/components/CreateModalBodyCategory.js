import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../../components/Input/InputText'
import ErrorText from '../../../../components/Typography/ErrorText'
import { showNotification } from "../../../common/headerSlice"
import { createCategory } from '../categorySlice';
import { getCategories } from '../categorySlice';

const INITIAL_CATEGORY_OBJ = {  
    nama_kategori: "",
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


    const saveNewCategory = async () => {
    if (CategoryObj.nama_kategori.trim() === "") {
        return setErrorMessage("Nama is required!");
    }

    try {
        setLoading(true);

        const newCategoryObj = {
        nama_kategori: CategoryObj.nama_kategori, // Sesuaikan dengan backend
        };

        await dispatch(createCategory(newCategoryObj)).unwrap(); // Kirim ke backend

        // ✅ Ambil ulang semua kategori dari server agar data fresh
        await dispatch(getCategories());


        dispatch(showNotification({ message: "Kategori berhasil ditambahkan!", status: 1 }));
        closeModal();
    } catch (error) {
        setErrorMessage(error.message || "Terjadi kesalahan saat menambahkan kategori");
    } finally {
        setLoading(false);
    }
    };



    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setCategoryObj({ ...CategoryObj, [updateType]: value });
    };    

    return(
        <>
            <InputText 
                type="text" 
                defaultValue={CategoryObj.nama_kategori} 
                updateType="nama_kategori" 
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
