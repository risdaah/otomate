import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react"
import InputText from '../../../../components/Input/InputText';
import ErrorText from '../../../../components/Typography/ErrorText';
import { showNotification } from "../../../common/headerSlice";
import { editProduct } from '../productSlice';
import { PRODUCTDATA } from '../index';

function EditModalBodyProduct({ closeModal, id_produk }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productObj, setProductObj] = useState(PRODUCTDATA);

    useEffect(() => {
        const product = PRODUCTDATA.find((c) => c.id === id_produk);
        console.log("Product found:", product);
        if (product) {
            setProductObj(product);
        }
    }, [id_produk]);

    const saveEditProduct = () => {
        const editProductObj = {
            id: id_produk,
            ...productObj,
        };
        
        if (editProductObj.gambar && editProductObj.gambar.startsWith("blob:")) {
            editProductObj.gambar = null;
        }
    
        dispatch(editProduct(editProductObj));    
        dispatch(showNotification({ message: "Edit Product Success!", status: 1 }));   
        closeModal();
    };
    
    
    
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setProductObj({ ...productObj, gambar: fileURL }); 
        } else {
            setFileName(""); 
        }
    };    
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setProductObj({ ...productObj, [updateType]: value });
    };    

    return (
        <>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center rounded-lg p-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 mx-5 my-2">
                            <img src={productObj.gambar} alt="Profile" />
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
                value={productObj.nama}
                onChange={(e) =>
                    setProductObj({
                        ...productObj,
                        nama: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Nama Produk" 
                placeholder={productObj.nama}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={productObj.stok}
                onChange={(e) =>
                    setProductObj({
                        ...productObj,
                        stok: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Stok Produk" 
                placeholder={productObj.stok}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={productObj.harga}
                onChange={(e) =>
                    setProductObj({
                        ...productObj,
                        harga: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Harga Produk" 
                placeholder={productObj.harga}
                updateFormValue={updateFormValue} 
            />

                <div className="form-control mt-3">
                    <label htmlFor="kategori" className="ml-1">
                        Kategori
                    </label>
                <select
                    id="kategori"
                    value={productObj.kategori} 
                    onChange={(e) =>
                        setProductObj({
                            ...productObj,
                            kategori: e.target.value,
                        })
                    }
                    className="select select-bordered mt-1"
                >
                    <option value="" disabled>
                        Select Kategori                    
                    </option>
                    <option value="Admin">NON STOK</option>
                    <option value="Manager">STOK BENGKEL</option>
                </select>
            </div>

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={saveEditProduct}>Save</button>
            </div>
        </>
    );
}

export default EditModalBodyProduct;
