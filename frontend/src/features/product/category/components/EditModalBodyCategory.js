import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react"
import InputText from '../../../../components/Input/InputText';
import ErrorText from '../../../../components/Typography/ErrorText';
import { showNotification } from "../../../common/headerSlice";
import { editCategory } from '../categorySlice';
import { CATEGORYDATA } from '../index';

function EditModalBodyCategory({ closeModal, id_kategori }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [categoryObj, setCategoryObj] = useState(CATEGORYDATA);

    useEffect(() => {
        const category = CATEGORYDATA.find((c) => c.id === id_kategori);
        console.log("Category found:", category);
        if (category) {
            setCategoryObj(category);
        }
    }, [id_kategori]);

    const saveEditCategory = () => {
        const editCategoryObj = {
            id: id_kategori,
            ...categoryObj,
        };
            
        dispatch(editCategory(editCategoryObj));    
        dispatch(showNotification({ message: "Edit Category Success!", status: 1 }));   
        closeModal();
    };
  

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setCategoryObj({ ...categoryObj, [updateType]: value });
    };    

    return (
        <>
            <InputText
                type="text"
                value={categoryObj.nama}
                onChange={(e) =>
                    setCategoryObj({
                        ...categoryObj,
                        nama: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Nama Produk" 
                placeholder={categoryObj.nama}
                updateFormValue={updateFormValue} 
            />

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={saveEditCategory}>Save</button>
            </div>
        </>
    );
}

export default EditModalBodyCategory;
