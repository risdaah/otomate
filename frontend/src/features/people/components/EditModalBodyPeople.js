import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { updateSupplierUser, getUsersContent } from '../peopleSlice';

function EditModalBodyPeople({ closeModal }) {
  const dispatch = useDispatch();

  // Ambil data user yang dikirim dari modal
  const { extraObject: selectedUser } = useSelector((state) => state.modal);

  const [errorMessage, setErrorMessage] = useState("");
  const [userObj, setUserObj] = useState({
    id_user: "",
    nama: "",
    email: "",
    status: "Active",
    telp: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setUserObj({
        id_user: selectedUser.User?.id_user ?? selectedUser.id_user,
        nama: selectedUser.User?.nama ?? "",
        email: selectedUser.User?.email ?? "",
        status: selectedUser.User?.status ?? "Active",
        telp: selectedUser?.telp ?? "",
      });
    }
  }, [selectedUser]);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  const saveEditUser = async () => {
    try {
      if (!userObj.nama?.trim() || !userObj.email?.trim()) {
        return setErrorMessage("Nama dan Email wajib diisi");
      }

      const payload = {
        nama: userObj.nama,
        email: userObj.email,
        status: userObj.status,
        telp: userObj.telp,
      };

      await dispatch(updateSupplierUser({ id_user: userObj.id_user, data: payload }));

      // Refresh data
    await dispatch(getUsersContent()); 

      dispatch(showNotification({ message: "Edit User Success!", status: 1 }));
      
      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMessage("Gagal menyimpan perubahan.");
    }
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={userObj.nama}
        updateType="nama"
        labelTitle="Nama Supplier"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={userObj.email}
        updateType="email"
        labelTitle="Email"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={userObj.telp}
        updateType="telp"
        labelTitle="No Telepon"
        updateFormValue={updateFormValue}
      />

      <div className="form-control mt-3">
        <label htmlFor="status" className="ml-1">
          Status
        </label>
        <select
          id="status"
          value={userObj.status}
          onChange={(e) => updateFormValue({ updateType: "status", value: e.target.value })}
          className="select select-bordered mt-1"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary px-6" onClick={saveEditUser}>Save</button>
      </div>
    </>
  );
}

export default EditModalBodyPeople;
