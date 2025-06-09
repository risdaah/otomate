import { useEffect, useState } from "react";
import { PRODUCTDATA } from "../index";
import ErrorText from "../../../../components/Typography/ErrorText";

function ViewModalBodyProduct({ closeModal, id_produk }) {
    const [productObj, setProductObj] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const product = PRODUCTDATA.find((c) => c.id === id_produk);
        if (product) {
            setProductObj(product);
        } else {
            setErrorMessage("Product not found.");
        }
    }, [id_produk]);

    if (!productObj) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Gambar</label>
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 mr-4">
                            <img src={productObj.gambar} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Nama Produk</label>
                    <p className="w-3/4">{productObj.nama}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Stok Produk</label>
                    <p className="w-3/4">{productObj.stok}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Harga</label>
                    <p className="w-3/4">{productObj.harga}</p>
                </div>
            </div>  

            {errorMessage && <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>}
            <div className="modal-action">                
            <button className="btn btn-primary px-6" onClick={() => closeModal()}>OK</button>
            </div>
        </>
    );
}

export default ViewModalBodyProduct;
