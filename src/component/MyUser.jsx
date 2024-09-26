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

const MyUser = () => {
    const [relations, setRelations] = useState([]);
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

    const editUser = (rowData) => {
        setSelectedRelation(rowData);
        setRelationForm({
            userid: rowData.userid,
            relationtype: rowData.relationtype,
        });
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

    const handleEditRelation = async () => {
        try {
            await axiosInstance.put('/relation', {
                ...selectedRelation,
                userid: relationForm.userid,
                relationtype: relationForm.relationtype,
            });
            fetchRelations();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Relation updated successfully' });
            setEditModalVisible(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update relation' });
        }
    };

    const handleAddRelation = async () => {
        try {
            await axiosInstance.post('relation', relationForm);
            fetchRelations();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Relation added successfully' });
            setAddModalVisible(false);
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
        <div className="p-grid p-fluid">
            <div className="p-col-12">
                <div className="p-d-flex justify-content-center align-items-center">
                    <div>
                        <h3>User Relations</h3>
                    </div>
                    <div>
                        <Button label="Add Users" icon="pi pi-plus" className="p-button-rounded p-button-success p-button-sm" onClick={() => setAddModalVisible(true)} />
                    </div>
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
                <Dialog visible={editModalVisible} onHide={() => setEditModalVisible(false)} header="Edit Relation">
                    <div className="p-field">
                        <label htmlFor="userid">User ID</label>
                        <InputText id="userid" value={relationForm.userid} onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="relationtype">Relation Type</label>
                        <Dropdown
                            id="relationtype"
                            value={relationForm.relationtype}
                            options={[
                                { label: 'Admin added Client', value: 0 },
                                { label: 'Admin added User', value: 1 },
                                { label: 'Client added User', value: 2 },
                            ]}
                            onChange={(e) => setRelationForm({ ...relationForm, relationtype: e.value })}
                        />
                    </div>
                    <Button label="Save" icon="pi pi-check" onClick={handleEditRelation} />
                </Dialog>

                {/* Add Relation Modal */}
                <Dialog visible={addModalVisible} onHide={() => setAddModalVisible(false)} header="Add New Relation">
                    <div className="p-field">
                        <label htmlFor="userid">User ID</label>
                        <InputText id="userid" value={relationForm.userid} onChange={(e) => setRelationForm({ ...relationForm, userid: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="relationtype">Relation Type</label>
                        <Dropdown
                            id="relationtype"
                            value={relationForm.relationtype}
                            options={[
                                { label: 'Admin added Client', value: 0 },
                                { label: 'Admin added User', value: 1 },
                                { label: 'Client added User', value: 2 },
                            ]}
                            onChange={(e) => setRelationForm({ ...relationForm, relationtype: e.value })}
                        />
                    </div>
                    <Button label="Add" icon="pi pi-check" onClick={handleAddRelation} />
                </Dialog>
            </div>
        </div>
    );
};

export default MyUser;
