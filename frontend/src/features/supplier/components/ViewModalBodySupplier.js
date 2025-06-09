import { useEffect, useState } from "react";
import { SUPPLIERDATA } from "../index";
import ErrorText from "../../../components/Typography/ErrorText";

function ViewModalBodySupplier({ closeModal, id_supplier }) {
    const [supplierObj, setSupplierObj] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const supplier = SUPPLIERDATA.find((c) => c.id === id_supplier);
        if (supplier) {
            setSupplierObj(supplier);
        } else {
            setErrorMessage("Supplier not found.");
        }
    }, [id_supplier]);

    if (!supplierObj) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Nama Supplier</label>
                    <p className="w-3/4">{supplierObj.nama_supplier}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Tipe Mobil</label>
                    <p className="w-3/4">{supplierObj.tipe_mobil}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Telepon</label>
                    <p className="w-3/4">{supplierObj.telp}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Alamat</label>
                    <p className="w-3/4">{supplierObj.alamat_supplier}</p>
                </div>
            </div>  

            {errorMessage && <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>}
            <div className="modal-action">                
            <button className="btn btn-primary px-6" onClick={() => closeModal()}>OK</button>
            </div>
        </>
    );
}

export default ViewModalBodySupplier;
