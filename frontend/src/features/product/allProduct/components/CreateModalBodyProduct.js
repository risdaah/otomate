import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../../components/Input/InputText'
import ErrorText from '../../../../components/Typography/ErrorText'
import { showNotification } from "../../../common/headerSlice"
import { addNewProduct } from '../productSlice';

const INITIAL_PRODUCT_OBJ = {  
    nama: "", 
    stok: "", 
    harga: "", 
    gambar: null
} 

function CreateModalBodyProduct({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [ProductObj, setProductObj] = useState(INITIAL_PRODUCT_OBJ)
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setProductObj({ ...ProductObj, gambar: fileURL }); 
        } else {
            setFileName(""); 
        }
    };   


    const saveNewProduct = () => {
        if(ProductObj.nama.trim() === "") return setErrorMessage("Nama is required!")
        else if(ProductObj.stok.trim() === "") return setErrorMessage("Stok is required!")
        else {
            let newProductObj = {
                "id_produk": 1, 
                "id_kategori": 1, 
                "nama": ProductObj.nama, 
                "stok": ProductObj.stok,
                "harga": ProductObj.harga,
            }
            if (newProductObj.gambar.startsWith("blob:")) {
                newProductObj.gambar = null;
            }
            console.log('Dispatching addNewProduct', newProductObj);
            dispatch(addNewProduct({ newProductObj }));

            dispatch(showNotification({ message: "New Product Added!", status: 1 }))
            closeModal()
        }
    }
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setProductObj({ ...ProductObj, [updateType]: value });
    };    

    return(
        <>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 mx-5 my-2">
                            <img 
                                src={ProductObj.gambar || "/default.jpeg"} 
                                alt="Gambar" 
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="productImage" className="label font-bold">
                        Gambar
                    </label>
                    <input
                        type="file"
                        id="productImage"
                        onChange={handleImageUpload}
                        className="input input-bordered py-2"
                    />
                </div>
            </div>

            <InputText 
                type="text" 
                defaultValue={ProductObj.nama} 
                updateType="nama" 
                labelTitle="Nama Produk" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={ProductObj.stok} 
                updateType="Stok" 
                labelTitle="Stok Produk" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={ProductObj.harga} 
                updateType="Harga" 
                labelTitle="Harga Produk" 
                updateFormValue={updateFormValue} 
            />

            <div className="form-control mt-3">
                <label htmlFor="kategori" className="ml-1">
                    Kategori
                </label>
                <select
                    id="kategori"
                    value={ProductObj.role} 
                    onChange={(e) => updateFormValue({ updateType: "id_kategori", value: e.target.value })} 
                    className="select select-bordered mt-2"
                >
                    <option value="" disabled>
                        Pilih Kategori
                    </option>
                    <option value="Admin">NON STOK</option>
                    <option value="Manager">STOK BENGKEL</option>
                </select>
            </div>

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewProduct()}>Save</button>
            </div>
        </>
    )
}

export default CreateModalBodyProduct
