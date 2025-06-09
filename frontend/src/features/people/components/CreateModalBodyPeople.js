import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewUser } from '../peopleSlice';

const INITIAL_USER_OBJ = {  
    nama: "", 
    email: "", 
    password: "",
    role: "", 
    profilImg: null
} 

function CreateModalBodyUser({closeModal}){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [UserObj, setUserObj] = useState(INITIAL_USER_OBJ)
    const [fileName, setFileName] = useState(""); 
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const fileURL = URL.createObjectURL(file); 
            setUserObj({ ...UserObj, gambar: fileURL }); 
        } else {
            setFileName(""); 
        }
    };   


    const saveNewUser = () => {
        if(UserObj.nama.trim() === "") return setErrorMessage("Nama is required!")
        else if(UserObj.stok.trim() === "") return setErrorMessage("Stok is required!")
        else {
            let newUserObj = {
                "id_user": 4,
                "nama": UserObj.nama, 
                "email": UserObj.email,
                "password": UserObj.password,
                "role": UserObj.role,
                "status": UserObj.status,
            }
            if (newUserObj.profilImg.startsWith("blob:")) {
                newUserObj.profilImg = null;
            }
            console.log('Dispatching addNewUser', newUserObj);
            dispatch(addNewUser({ newUserObj }));

            dispatch(showNotification({ message: "New User Added!", status: 1 }))
            closeModal()
        }
    }
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setUserObj({ ...UserObj, [updateType]: value });
    };    

    return(
        <>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center rounded-lg p-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 mx-5 my-2">
                            <img 
                                src={UserObj.profilImg || "/default.jpeg"} 
                                alt="Gambar" 
                            />
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
                defaultValue={UserObj.nama} 
                updateType="nama" 
                labelTitle="Nama User" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={UserObj.email} 
                updateType="Email" 
                labelTitle="Email" 
                updateFormValue={updateFormValue} 
            />

            <InputText 
                type="text" 
                defaultValue={UserObj.password} 
                updateType="Password" 
                labelTitle="Password" 
                updateFormValue={updateFormValue} 
            />

            <div className="form-control mt-3">
                <label htmlFor="role" className="ml-1">
                    Role
                </label>
                <select
                    id="role"
                    value={UserObj.role} 
                    onChange={(e) => updateFormValue({ updateType: "id_user", value: e.target.value })} 
                    className="select select-bordered mt-2"
                >
                    <option value="" disabled>
                        Pilih Role
                    </option>
                    <option value="Admin">Admin Bengkel</option>
                    <option value="Supplier">Supplier</option>
                </select>
            </div>

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewUser()}>Save</button>
            </div>
        </>
    )
}

export default CreateModalBodyUser
