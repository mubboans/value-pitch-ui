import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axiosInstance from './../helper/axios_helper';
import { showToast } from '../helper/helperFn';
import { useDispatch } from 'react-redux';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false); // State for Add User Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({ // State for new user form
        firstname: '',
        lastname: '',
        password: '',
        email: '',
        contact: '',
        countrycode: '+91', // Default value as in curl
        type: 'user', // Default value as in curl
        industry: 'IT', // Default value as in curl
        role: '',
        otherdetail: 'sample detail' // Default value as in curl
    });

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/user');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/user?id=${userId}`);
            fetchData();
            showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' });
        } catch (error) {
            showToast(dispatch, { showtoast: true, message: error?.response?.data?.message, summary: error?.response?.data?.status, type: 'error' });
            console.error('Error deleting user:', error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axiosInstance.put(`/user`, selectedUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_TOKEN_HERE',
                },
            });
            setShowEditModal(false);
            fetchData();
            showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' });
        } catch (error) {
            showToast(dispatch, { showtoast: true, message: error?.response?.data?.message, summary: error?.response?.data?.status, type: 'error' });
            console.error('Error updating user:', error);
        }
    };

    const handleAddSubmit = async () => {
        try {
            const response = await axiosInstance.post('/user', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setShowAddModal(false);
            fetchData();
            showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' });
        } catch (error) {
            showToast(dispatch, { showtoast: true, message: error?.response?.data?.message, summary: error?.response?.data?.status, type: 'error' });
            console.error('Error adding user:', error);
        }
    };

    const onInputChange = (e, field) => {
        setSelectedUser(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    const onNewUserInputChange = (e, field) => {
        setNewUser(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    const editFooterContent = (
        <div>
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-success p-mr-2"
                onClick={handleEditSubmit}
            />
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-mr-2 p-button-secondary"
                onClick={() => setShowEditModal(false)}
            />
        </div>
    );

    const addFooterContent = (
        <div>
            <Button
                label="Add"
                icon="pi pi-check"
                className="p-button-success p-mr-2"
                onClick={handleAddSubmit}
            />
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-mr-2 p-button-secondary"
                onClick={() => setShowAddModal(false)}
            />
        </div>
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
            <div className="text-center">
                <div className="mt-6 mb-3 font-bold text-6xl text-900">Dashboard</div>
                <p className="text-700 text-3xl mt-0 mb-6">User Information</p>
            </div>
            <div className="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">
                <div className="w-full">
                    <Button
                        label="Add User"
                        icon="pi pi-plus"
                        className="p-button-success mb-4"
                        onClick={() => setShowAddModal(true)}
                    />
                    <DataTable value={data} paginator rows={5} className="p-datatable-customers">
                        <Column field="id" header="ID" />
                        <Column field="firstname" header="First Name" />
                        <Column field="lastname" header="Last Name" />
                        <Column field="email" header="Email" />
                        <Column field="contact" header="Contact" />
                        <Column field="status" header="Status" />
                        <Column field="role" header="Role" />
                        <Column field="createdDate" header="Created Date" />
                        <Column
                            body={(rowData) => (
                                <div>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning mr-2"
                                        onClick={() => handleEdit(rowData)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger"
                                        onClick={() => handleDelete(rowData.id)}
                                    />
                                </div>
                            )}
                            header="Actions"
                            bodyStyle={{ textAlign: 'center' }}
                        />
                    </DataTable>
                </div>
            </div>

            {/* Edit User Modal */}
            <Dialog
                header="Edit User"
                visible={showEditModal}
                style={{ width: '90vw', maxWidth: '600px' }}
                onHide={() => setShowEditModal(false)}
                footer={editFooterContent}
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
                className="p-fluid"
            >
                {selectedUser && (
                    <div className="p-grid p-fluid">
                        <div className="p-col-12 p-md-10">
                            <div className="p-field">
                                <label htmlFor="firstname">First Name</label>
                                <InputText
                                    id="firstname"
                                    value={selectedUser.firstname}
                                    onChange={(e) => onInputChange(e, 'firstname')}
                                    placeholder="First Name"
                                />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <label htmlFor="lastname">Last Name</label>
                                <InputText
                                    id="lastname"
                                    value={selectedUser.lastname}
                                    onChange={(e) => onInputChange(e, 'lastname')}
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    value={selectedUser.email}
                                    onChange={(e) => onInputChange(e, 'email')}
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <label htmlFor="contact">Contact</label>
                                <InputText
                                    id="contact"
                                    value={selectedUser.contact}
                                    onChange={(e) => onInputChange(e, 'contact')}
                                    placeholder="Contact"
                                />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <label htmlFor="status">Status</label>
                                <InputText
                                    id="status"
                                    value={selectedUser.status}
                                    onChange={(e) => onInputChange(e, 'status')}
                                    placeholder="Status"
                                />
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <label htmlFor="role">Role</label>
                                <InputText
                                    id="role"
                                    value={selectedUser.role}
                                    onChange={(e) => onInputChange(e, 'role')}
                                    placeholder="Role"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Add User Modal */}
            <Dialog
                header="Add User"
                visible={showAddModal}
                style={{ width: '90vw', maxWidth: '600px' }}
                onHide={() => setShowAddModal(false)}
                footer={addFooterContent}
                breakpoints={{ '960px': '75vw', '640px': '90vw' }}
                className="p-fluid"
            >
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-md-10">
                        <div className="p-field">
                            <label htmlFor="firstname">First Name</label>
                            <InputText
                                id="firstname"
                                required
                                value={newUser.firstname}
                                onChange={(e) => onNewUserInputChange(e, 'firstname')}
                                placeholder="First Name"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="lastname">Last Name</label>
                            <InputText
                                id="lastname"
                                value={newUser.lastname}
                                onChange={(e) => onNewUserInputChange(e, 'lastname')}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="password">Password</label>
                            <InputText
                                id="password"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => onNewUserInputChange(e, 'password')}
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type='email'
                                required
                                value={newUser.email}
                                onChange={(e) => onNewUserInputChange(e, 'email')}
                                placeholder="Email"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="contact">Contact</label>
                            <InputText
                                id="contact"
                                value={newUser.contact}
                                onChange={(e) => onNewUserInputChange(e, 'contact')}
                                placeholder="Contact"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="countrycode">Country Code</label>
                            <InputText
                                id="countrycode"
                                value={newUser.countrycode}
                                onChange={(e) => onNewUserInputChange(e, 'countrycode')}
                                placeholder="Country Code"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="type">Type</label>
                            <InputText
                                id="type"
                                value={newUser.type}
                                onChange={(e) => onNewUserInputChange(e, 'type')}
                                placeholder="Type"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="industry">Industry</label>
                            <InputText
                                id="industry"
                                value={newUser.industry}
                                onChange={(e) => onNewUserInputChange(e, 'industry')}
                                placeholder="Industry"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="role">Role</label>
                            <InputText
                                id="role"
                                value={newUser.role}
                                onChange={(e) => onNewUserInputChange(e, 'role')}
                                placeholder="Role"
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-md-6">
                        <div className="p-field">
                            <label htmlFor="otherdetail">Other Detail</label>
                            <InputText
                                id="otherdetail"
                                value={newUser.otherdetail}
                                onChange={(e) => onNewUserInputChange(e, 'otherdetail')}
                                placeholder="Other Detail"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Dashboard;
