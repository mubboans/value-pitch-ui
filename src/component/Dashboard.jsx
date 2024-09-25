import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';  // theme
import 'primereact/resources/primereact.min.css';           // core css
import 'primeicons/primeicons.css';                         // icons
import axiosInstance from './../helper/axios_helper';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (

        <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
            <div className="text-center lg:text-right">
                <div className="mt-6 mb-3 font-bold text-6xl text-900">Dashboard</div>
                <p className="text-700 text-3xl mt-0 mb-6">User Information</p>
            </div>
            <div className="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">

                <div className="w-full">
                    <DataTable value={data} paginator rows={5} className="p-datatable-customers">
                        <Column field="id" header="ID" />
                        <Column field="firstname" header="First Name" />
                        <Column field="lastname" header="Last Name" />
                        <Column field="email" header="Email" />
                        <Column field="contact" header="Contact" />
                        <Column field="status" header="Status" />
                        <Column field="role" header="Role" />
                        <Column field="createdDate" header="Created Date" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
