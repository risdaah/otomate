import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react"
import InputText from '../../../../components/Input/InputText';
import ErrorText from '../../../../components/Typography/ErrorText';
import { showNotification } from "../../../common/headerSlice";
import { editSupply } from '../supplySlice';
import { RFQDATA } from '../index';

function EditModalBodySupply({ closeModal, id_pesanan }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [supplyObj, setSupplyObj] = useState(RFQDATA);

    useEffect(() => {
        const supply = RFQDATA.find((c) => c.id === id_pesanan);
        console.log("Supply found:", supply);
        if (supply) {
            setSupplyObj(supply);
        }
    }, [id_pesanan]);

    const saveEditSupply = () => {
        const editSupplyObj = {
            id: id_pesanan,
            ...supplyObj,
        };
            
        dispatch(editSupply(editSupplyObj));    
        dispatch(showNotification({ message: "Edit Supply Success!", status: 1 }));   
        closeModal();
    };
  

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setSupplyObj({ ...supplyObj, [updateType]: value });
    };    

    return (
        <>
            <InputText
                type="text"
                value={supplyObj.nama}
                onChange={(e) =>
                    setSupplyObj({
                        ...supplyObj,
                        nama: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Nama Produk" 
                placeholder={supplyObj.nama}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={supplyObj.total}
                onChange={(e) =>
                    setSupplyObj({
                        ...supplyObj,
                        total: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Total Produk" 
                placeholder={supplyObj.total}
                updateFormValue={updateFormValue} 
            />


            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={saveEditSupply}>Save</button>
            </div>
        </>
    );
}

export default EditModalBodySupply;
