import React from 'react'
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axiosInstance from './../helper/axios_helper';
import { showToast } from '../helper/helperFn';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const MyProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ // State for new user form
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        countrycode: '+91', // Default value as in curl
        type: 'user', // Default value as in curl
        industry: 'IT', // Default value as in curl
        role: '',
        otherdetail: 'sample detail' // Default value as in curl
    });

    const fetchData = async (userId) => {
        try {
            const response = await axiosInstance.get(`/user?id=${userId}`);
            // console.log("response", response.data.data);

            setUserData(
                { // State for new user form
                    ...response.data.data[0],
                    firstname: response.data.data[0]?.firstname,
                    lastname: response.data.data[0]?.lastname,
                    email: response.data.data[0]?.email,
                    contact: response.data.data[0]?.contact,
                    countrycode: response.data.data[0]?.countrycode, // Default value as in curl
                    type: response.data.data[0]?.type, // Default value as in curl
                    industry: response.data.data[0]?.industry, // Default value as in curl
                    role: response.data.data[0]?.role,
                    otherdetail: response.data.data[0]?.otherdetail // Default value as in curl
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axiosInstance.put(`/user`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': JSON.parse(localStorage?.getItem('token')),
                },
            });
            // setShowEditModal(false);
            navigate("/dashboard");
            // fetchData();
            showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' });
        } catch (error) {
            showToast(dispatch, { showtoast: true, message: error?.response?.data?.message, summary: error?.response?.data?.status, type: 'error' });
            console.error('Error updating user:', error);
        }
    };

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('userdetail'))?.id;

        fetchData(userId)
    }, [])

    const onNewUserInputChange = (e, field) => {
        setUserData(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };
    return (
        <>
            <h2>My Profile</h2>
            <div className='form-container' style={{ display: "flex", alignItems: "center", minHeight: "50vh" }}>
                <div className="p-grid p-fluid">
                    <div className="p-col-6 p-md-6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="p-field" style={{ margin: "0 15px", flex: "1" }}>
                            <label htmlFor="firstname">First Name</label>
                            <InputText
                                style={{ width: "100%" }}
                                id="firstname"
                                required
                                value={userData.firstname}
                                onChange={(e) => onNewUserInputChange(e, 'firstname')}
                                placeholder="First Name"
                            />
                        </div>
                        <div className="p-field" style={{ margin: "0 15px", flex: "1" }}>
                            <label htmlFor="lastname">Last Name</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="lastname"
                                value={userData.lastname}
                                onChange={(e) => onNewUserInputChange(e, 'lastname')}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>
                    <div className="p-col-6 p-md-6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="countrycode">Country Code</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="countrycode"
                                value={userData.countrycode}
                                onChange={(e) => onNewUserInputChange(e, 'countrycode')}
                                placeholder="Country Code"
                            />
                        </div>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="contact">Contact</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="contact"
                                value={userData.contact}
                                onChange={(e) => onNewUserInputChange(e, 'contact')}
                                placeholder="Contact"
                            />
                        </div>

                    </div>
                    <div className="p-col-6 p-md-6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="email">Email</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="email"
                                type='email'
                                required
                                value={userData.email}
                                onChange={(e) => onNewUserInputChange(e, 'email')}
                                placeholder="Email"
                            />
                        </div>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="industry">Industry</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="industry"
                                value={userData.industry}
                                onChange={(e) => onNewUserInputChange(e, 'industry')}
                                placeholder="Industry"
                            />
                        </div>
                    </div>
                    <div className="p-col-6 p-md-6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="type">Type</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="type"
                                value={userData.type}
                                onChange={(e) => onNewUserInputChange(e, 'type')}
                                placeholder="Type"
                                disabled={true}
                            />
                        </div>
                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="role">Role</label>
                            <InputText
                                style={{ width: "100%" }}

                                id="role"
                                value={userData.role}
                                onChange={(e) => onNewUserInputChange(e, 'role')}
                                placeholder="Role"
                                disabled={true}

                            />
                        </div>

                    </div>
                    {/* <div className="p-col-6 p-md-6" style={{display:"flex", justifyContent:"space-between", maxWidth:"600px", width:"100%"}}>
            
        </div> */}
                    <div className="p-col-6 p-md-6" style={{ display: "flex", justifyContent: "space-between" }}>

                        <div className="p-field" style={{ margin: "10px 15px", flex: "1" }}>
                            <label htmlFor="otherdetail">Other Detail</label>
                            <InputText
                                style={{ width: "100%" }}
                                id="otherdetail"
                                value={userData.otherdetail}
                                onChange={(e) => onNewUserInputChange(e, 'otherdetail')}
                                placeholder="Other Detail"
                            />
                        </div>
                    </div>
                    {/* <div className="p-col-6 p-md-6" style={{display:"flex", justifyContent:"space-between", maxWidth:"600px", width:"100%"}}>
            
        </div> */}
                </div>

            </div>
            <div style={{ margin: "0 30px 0 300px" }}>
                <Button
                    label="Save"
                    icon="pi pi-check"
                    className="p-button-success p-mr-2"
                    onClick={handleEditSubmit}
                />
            </div>
        </>
    )
}

export default MyProfile