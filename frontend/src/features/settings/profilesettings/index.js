import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'

function ProfileSettings(){


    const dispatch = useDispatch()

    // Call API to update profile settings changes
    const updateProfile = () => {
        dispatch(showNotification({message : "Profile Updated", status : 1}))    
    }

    const updateFormValue = ({updateType, value}) => {
        console.log(updateType)
    }

    return(
        <>
            
            <TitleCard title="Profile Settings" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Name" defaultValue="Alex" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Email Id" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Role" defaultValue="Admin" updateFormValue={updateFormValue}/> */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Role</span> </label>
                        <select
                        className="select select-bordered"
                        defaultValue="Admin"
                        onChange={(e) => updateFormValue('role', e.target.value)}>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Guest">Guest</option>
                        </select>
                    </div>             
                    <InputText labelTitle="Password" defaultValue="*********" updateFormValue={updateFormValue}/>
                    {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                <div className="divider" ></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/> */}
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                </div>

                <div className="mt-16"><button className="btn btn-primary float-right" onClick={() => updateProfile()}>Update</button></div>
            </TitleCard>
        </>
    )
}


export default ProfileSettings