import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorText from "../../../components/Typography/ErrorText";

function ViewModalBodyPeople({ closeModal, extraObject }) {
  const userObj = extraObject;
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userObj) {
      setErrorMessage("User tidak ditemukan.");
    } else {
      setErrorMessage("");
    }
  }, [userObj]);

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <label className="block text-sm font-bold w-1/4">Nama User</label>
          <p className="w-3/4">{userObj?.User?.nama}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center rounded-lg p-3">
          <label className="block text-sm font-bold w-1/4">Email</label>
          <p className="w-3/4">{userObj?.User?.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center bg-gray-100 rounded-lg p-3">
          <label className="block text-sm font-bold w-1/4">Role</label>
          <p className="w-3/4 capitalize">{userObj?.User?.role}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center rounded-lg p-3">
          <label className="block text-sm font-bold w-1/4">Status</label>
          <p className="w-3/4">{userObj?.User?.status}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center rounded-lg p-3">
          <label className="block text-sm font-bold w-1/4">Telp</label>
          <p className="w-3/4">{userObj?.telp}</p>
        </div>
      </div>

      {errorMessage && <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>}

      <div className="modal-action">
        <button className="btn btn-primary px-6" onClick={closeModal}>
          OK
        </button>
      </div>
    </>
  );
}

export default ViewModalBodyPeople;
