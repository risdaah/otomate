// import { useEffect, useState } from "react";
// import { RFQDATA } from "../index";
// import ErrorText from "../../../../components/Typography/ErrorText";

// function ViewModalBodySupply({ closeModal, id_pesanan }) {
//     const [supplyObj, setSupplyObj] = useState(null);
//     const [errorMessage, setErrorMessage] = useState("");

//     useEffect(() => {
//         const supply = RFQDATA.find((c) => c.id === id_pesanan);
//         if (supply) {
//             setSupplyObj(supply);
//         } else {
//             setErrorMessage("Supply not found.");
//         }
//     }, [id_pesanan]);

//     if (!supplyObj) {
//         return <p className="text-center text-gray-500">Loading...</p>;
//     }

//     return (
//         <>
//             <div className="mt-4">
//                 <div className="flex items-center bg-gray-200 rounded-lg p-3">
//                     <label className="block text-sm font-bold w-1/4">Supplier</label>
//                     <p className="w-3/4">{supplyObj.id_supplier}</p>
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <div className="flex items-center rounded-lg p-3">
//                     <label className="block text-sm font-bold w-1/4">Nama Produk</label>
//                     <p className="w-3/4">{supplyObj.nama}</p>
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <div className="flex items-center bg-gray-200 rounded-lg p-3">
//                     <label className="block text-sm font-bold w-1/4">Total</label>
//                     <p className="w-3/4">{supplyObj.total}</p>
//                 </div>
//             </div>
//             <div className="mt-4">
//                 <div className="flex items-center rounded-lg p-3">
//                     <label className="block text-sm font-bold w-1/4">Pembayaran</label>
//                     <p className="w-3/4">{supplyObj.status}</p>
//                 </div>
//             </div>  

//             {errorMessage && <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>}
//             <div className="modal-action">                
//             <button className="btn btn-primary px-6" onClick={() => closeModal()}>OK</button>
//             </div>
//         </>
//     );
// }

// export default ViewModalBodySupply;

import moment from "moment";
import ErrorText from "../../../../components/Typography/ErrorText";


function ViewModalBodySupply({ closeModal, extraObject }) {
    if (!extraObject) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    // RUPIAH FORMAT
    const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
    };

    const {
        id_pesanan,
        nama_supplier,
        total,
        status,
        catatan,
        created_at,
        detail_pesanan = []
    } = extraObject;

    return (
        <>
            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">ID Pesanan</label>
                    <p className="w-3/4">{id_pesanan}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Supplier</label>
                    <p className="w-3/4">{nama_supplier}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Total</label>
                    <p className="w-3/4">Rp {total}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Status</label>
                    <p className="w-3/4 capitalize">{status}</p>
                </div>
            </div>

                        <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Catatan</label>
                    <p className="w-3/4 capitalize">{catatan}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center bg-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-bold w-1/4">Tanggal</label>
                    <p className="w-3/4">{moment(created_at).format("YYYY-MM-DD")}</p>
                </div>
            </div>

            {/* Detail Produk */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Detail Produk</h3>
                {detail_pesanan.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table w-full table-auto border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2 border">Nama Produk</th>
                                    <th className="px-3 py-2 border">Jumlah</th>
                                    <th className="px-3 py-2 border">Harga</th>
                                    <th className="px-3 py-2 border">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail_pesanan.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-3 py-2 border">{item.nama_produk}</td>
                                        <td className="px-3 py-2 border">{item.jumlah}</td>
                                        <td className="text-center">{formatRupiah(item.harga)}</td>
                                        <td className="px-3 py-2 border">
                                            {moment(item.created_at).format("YYYY-MM-DD")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Tidak ada detail produk.</p>
                )}
            </div>

            <div className="modal-action mt-6">
                <button className="btn btn-primary px-6" onClick={() => closeModal()}>
                    OK
                </button>
            </div>
        </>
    );
}

export default ViewModalBodySupply;

