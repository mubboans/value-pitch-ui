/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import axiosInstance from '../helper/axios_helper';
import { getValue } from '../helper/helperFn';

const MyUser = () => {
    const [relations, setRelations] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [relationForm, setRelationForm] = useState({ userid: '', relationtype: 0 });
    const [selectedRelation, setSelectedRelation] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const toast = React.useRef(null);

    useEffect(() => {
        fetchRelations();

    }, []);

    const fetchRelations = async () => {
        try {
            const response = await axiosInstance.get('relation');
            let newUserMap = response.data.data.map((x) => ({
                ...x,
                user: x.user ? x.user : x.client,
            }));
            setRelations(newUserMap);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch relations' });
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get(`/user`);
            // console.log("response", response.data.data);
            const options = response?.data?.data?.map((elem) => {
                return {
                    label: `${elem?.firstname + " " + elem?.lastname} - (${elem?.role})`,
                    value: elem?.id
                }
            })
            setUserOptions(options)


        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const editUser = (rowData) => {
        fetchUsers()
        setSelectedRelation(rowData);
        // setRelationForm({
        //     userid: rowData.userid,
        //     relationtype: rowData.relationtype,
        // });
        setEditModalVisible(true);
    };

    const deleteUser = async (rowData) => {
        try {
            await axiosInstance.delete(`/relation?id=${rowData.id}`);
            fetchRelations();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Relation deleted successfully' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete relation' });
        }
    };

    console.log("selectedRelation", selectedRelation, relationForm?.relationtype);

    const handleEditRelation = async () => {
        const payload = {
            "userid": relationForm?.relationtype == 1 || relationForm?.relationtype == 2 ? relationForm?.userid : null,
            "clientid": relationForm?.relationtype < 1 ? relationForm?.userid : null,
            "adminid": relationForm?.relationtype < 2 ? JSON.parse(localStorage?.getItem("userdetail"))?.id : null,
            "relationtype": relationForm?.relationtype,
            "createdDate": selectedRelation?.createdDate,
            "createdAt": selectedRelation?.createdAt,
            "updatedAt": selectedRelation?.updatedAt,
            "id": selectedRelation?.id
        }
        try {
            await axiosInstance.put('/relation', payload);
            setEditModalVisible(false);
            fetchRelations();
            // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Relation updated successfully' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update relation' });
        }
    };

    const handleAddRelation = async () => {
        const payload = {
            "userid": relationForm?.relationtype == 1 || relationForm?.relationtype == 2 ? relationForm?.userid : null,
            "clientid": relationForm?.relationtype < 1 ? relationForm?.userid : null,
            "adminid": relationForm?.relationtype < 2 ? JSON.parse(localStorage?.getItem("userdetail"))?.id : null,
            "relationtype": relationForm?.relationtype,
        }

        try {
            await axiosInstance.post('relation', payload);
            fetchRelations();
            setAddModalVisible(false);
            // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Relation added successfully' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add relation' });
        }
    };

    const relationTypeTemplate = (rowData) => {
        if (rowData.relationtype === 0) return 'Admin added Client User';
        if (rowData.relationtype === 1) return 'Admin added User';
        if (rowData.relationtype === 2) return 'Client added User';
        return 'Unknown';
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="p-flex">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteUser(rowData)} />
            </div>
        );
    };

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="p-d" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: '15px' }}>
                    <h3>User Relations</h3>
                    <Button label="Add Users" icon="pi pi-plus" className="p-button-rounded p-button-success p-button-sm" onClick={() => {
                        setAddModalVisible(true);
                        fetchUsers();
                    }} />
                </div>
                <DataTable value={relations} responsiveLayout="scroll">
                    <Column field="id" header="ID" />
                    <Column field="user.firstname" header="First Name" />
                    <Column field="user.lastname" header="Last Name" />
                    <Column field="user.createdAt" header="Created On" />
                    <Column field="relationtype" header="Relation Type" body={relationTypeTemplate} />
                    <Column header="Actions" body={actionTemplate} />
                </DataTable>

                {/* Edit Relation Modal */}
                <Dialog visible={editModalVisible} onHide={() => setEditModalVisible(false)} header="Edit Relation" style={{ maxWidth: "400px", width: "100%" }}>
                    <div className="p-col-6 p-md-6" >

                        <div className="p-field">
                            <div>
                                <label htmlFor="userid">User ID</label>
                            </div>
                            <Dropdown
                                style={{ width: "100%" }}
                                id="userid"
                                value={relationForm.userid}
                                options={userOptions}
                                onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })}
                            />

                            {/* <InputText id="userid" style={{width:"100%"}} value={relationForm.userid} onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })} /> */}

                        </div>
                        <div className="p-field" style={{ marginTop: "10px" }}>
                            <div>
                                <label htmlFor="relationtype">Relation Type</label>
                            </div>
                            <Dropdown
                                style={{ width: "100%" }}
                                id="relationtype"
                                value={relationForm.relationtype}
                                options={getValue('userdetail')?.role == "admin" ?
                                    [
                                        { label: 'Admin added Client', value: 0 },
                                        { label: 'Admin added User', value: 1 },
                                    ]

                                    : getValue('userdetail')?.role == 'client' ?
                                        [
                                            { label: 'Client added User', value: 2 },
                                        ] :
                                        [
                                            { label: 'Admin added Client', value: 0 },
                                            { label: 'Admin added User', value: 1 },
                                            { label: 'Client added User', value: 2 },
                                        ]}
                                onChange={(e) => setRelationForm({ ...relationForm, relationtype: e.value })}
                            />

                        </div>
                    </div>
                    <Button label="Save" icon="pi pi-check" onClick={handleEditRelation} style={{ margin: "20px 0 0 120px" }} />
                </Dialog>

                {/* Add Relation Modal */}
                <Dialog visible={addModalVisible} onHide={() => setAddModalVisible(false)} header="Add New Relation" style={{ maxWidth: "400px", width: "100%" }}>
                    <div className="p-col-6 p-md-6" >

                        <div className="p-field">
                            <div>
                                <label htmlFor="userid">User ID</label>
                            </div>
                            <Dropdown
                                style={{ width: "100%" }}
                                id="userid"
                                value={relationForm.userid}
                                options={userOptions}
                                onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })}
                            />

                            {/* <InputText id="userid" style={{width:"100%"}} value={relationForm.userid} onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })} /> */}

                        </div>
                        <div className="p-field" style={{ marginTop: "10px" }}>
                            <div>
                                <label htmlFor="relationtype">Relation Type</label>
                            </div>
                            <Dropdown
                                style={{ width: "100%" }}
                                id="relationtype"
                                value={relationForm.relationtype}
                                options={getValue('userdetail')?.role == "admin" ?
                                    [
                                        { label: 'Admin added Client', value: 0 },
                                        { label: 'Admin added User', value: 1 },
                                    ]

                                    : getValue('userdetail')?.role == 'client' ?
                                        [
                                            { label: 'Client added User', value: 2 },
                                        ] :
                                        [
                                            { label: 'Admin added Client', value: 0 },
                                            { label: 'Admin added User', value: 1 },
                                            { label: 'Client added User', value: 2 },
                                        ]}
                                onChange={(e) => setRelationForm({ ...relationForm, relationtype: e.value })}
                            />

                        </div>
                    </div>
                    <Button label="Save" icon="pi pi-check" onClick={handleAddRelation} style={{ margin: "20px 0 0 120px" }} />
                </Dialog>
            </div>
        </div>
    );
};

export default MyUser;