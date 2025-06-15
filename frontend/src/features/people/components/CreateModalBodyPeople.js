import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { registerNewSupplier, getUsersContent } from '../peopleSlice';

const INITIAL_SUPPLIER_OBJ = {
  nama: "",
  email: "",
  password: "",
  telp: ""
};

function CreateModalBodyUser({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [supplierObj, setSupplierObj] = useState(INITIAL_SUPPLIER_OBJ);

  const saveNewSupplier = async () => {
    if (supplierObj.nama.trim() === "")
      return setErrorMessage("Nama supplier wajib diisi!");
    if (supplierObj.email.trim() === "")
      return setErrorMessage("Email wajib diisi!");
    if (supplierObj.password.trim() === "")
      return setErrorMessage("Password wajib diisi!");
    if (supplierObj.telp.trim() === "")
      return setErrorMessage("No Telepon wajib diisi!");

    try {
      setLoading(true);
      await dispatch(registerNewSupplier(supplierObj)).unwrap();
      // Refresh data
      await dispatch(getUsersContent()); 
      dispatch(showNotification({ message: "Supplier berhasil ditambahkan!", status: 1 }));
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || "Gagal menambahkan supplier");
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setSupplierObj({ ...supplierObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={supplierObj.nama}
        updateType="nama"
        labelTitle="Nama Supplier"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={supplierObj.email}
        updateType="email"
        labelTitle="Email"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={supplierObj.password}
        updateType="password"
        labelTitle="Password"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={supplierObj.telp}
        updateType="telp"
        labelTitle="No Telepon"
        updateFormValue={updateFormValue}
      />

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button className={`btn btn-primary px-6 ${loading ? "loading" : ""}`} onClick={saveNewSupplier}>
          Save
        </button>
      </div>
    </>
  );
}

export default CreateModalBodyUser;
