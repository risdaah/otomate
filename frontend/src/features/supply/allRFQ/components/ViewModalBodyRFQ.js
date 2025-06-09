import { useEffect, useState } from "react";
import { RFQDATA } from "../index";
import ErrorText from "../../../../components/Typography/ErrorText";

function ViewModalBodySupply({ closeModal, id_pesanan }) {
    const [supplyObj, setSupplyObj] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const supply = RFQDATA.find((c) => c.id === id_pesanan);
        if (supply) {
            setSupplyObj(supply);
        } else {
            setErrorMessage("Supply not found.");
        }
    }, [id_pesanan]);

    if (!supplyObj) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Supplier</label>
                    <p className="w-3/4">{supplyObj.id_supplier}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Nama Produk</label>
                    <p className="w-3/4">{supplyObj.nama}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Total</label>
                    <p className="w-3/4">{supplyObj.total}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Pembayaran</label>
                    <p className="w-3/4">{supplyObj.status}</p>
                </div>
            </div>  

            {errorMessage && <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>}
            <div className="modal-action">                
            <button className="btn btn-primary px-6" onClick={() => closeModal()}>OK</button>
            </div>
        </>
    );
}

export default ViewModalBodySupply;
