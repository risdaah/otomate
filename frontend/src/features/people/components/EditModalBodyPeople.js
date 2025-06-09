import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react"
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { editUser } from '../peopleSlice';
import { USERDATA } from '../index';

function EditModalBodyUser({ closeModal, id_user }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userObj, setUserObj] = useState(USERDATA);

    useEffect(() => {
        const user = USERDATA.find((c) => c.id === id_user);
        console.log("User found:", user);
        if (user) {
            setUserObj(user);
        }
    }, [id_user]);

    const saveEditUser = () => {
        const editUserObj = {
            id: id_user,
            ...userObj,
        };
        
        if (editUserObj.profilImg && editUserObj.gambar.startsWith("blob:")) {
            editUserObj.profilImg = null;
        }
    
        dispatch(editUser(editUserObj));    
        dispatch(showNotification({ message: "Edit User Success!", status: 1 }));   
        closeModal();
    };
    
    
    
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setUserObj({ ...userObj, profilImg: fileURL }); 
        } else {
            setFileName(""); 
        }
    };    
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setUserObj({ ...userObj, [updateType]: value });
    };    

    return (
        <>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center rounded-lg p-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 mx-5 my-2">
                            <img src={userObj.profilImg} alt="Profile" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="userImage" className="label font-bold">
                        Gambar
                    </label>
                    <input
                        type="file"
                        id="userImage"
                        onChange={handleImageUpload}
                        className="input input-bordered py-2"
                    />
                </div>
            </div>

            <InputText
                type="text"
                value={userObj.nama}
                onChange={(e) =>
                    setUserObj({
                        ...userObj,
                        nama: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Nama User" 
                placeholder={userObj.nama}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={userObj.email}
                onChange={(e) =>
                    setUserObj({
                        ...userObj,
                        email: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Email User" 
                placeholder={userObj.email}
                updateFormValue={updateFormValue} 
            />

            <InputText
                type="text"
                value={userObj.role}
                onChange={(e) =>
                    setUserObj({
                        ...userObj,
                        role: e.target.value,
                    })
                }
                className="input input-bordered w-full mt-4"
                labelTitle="Role" 
                placeholder={userObj.role}
                updateFormValue={updateFormValue} 
            />

                <div className="form-control mt-3">
                    <label htmlFor="status" className="ml-1">
                        Status
                    </label>
                <select
                    id="status"
                    value={userObj.status} 
                    onChange={(e) =>
                        setUserObj({
                            ...userObj,
                            status: e.target.value,
                        })
                    }
                    className="select select-bordered mt-1"
                >
                    <option value="" disabled>
                        Select Status                    
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={saveEditUser}>Save</button>
            </div>
        </>
    );
}

export default EditModalBodyUser;
