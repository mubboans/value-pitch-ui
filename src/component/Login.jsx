import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
import axiosInstance from '../helper/axios_helper';
import 'primereact/resources/themes/saga-blue/theme.css'; // Import PrimeReact theme
import 'primereact/resources/primereact.min.css'; // Import PrimeReact core
import 'primeicons/primeicons.css'; // Import PrimeIcons
import { setValue, showToast } from '../helper/helperFn';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const toast = React.useRef(null);

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.post('/auth/login', values, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data && response.data) {
                    // localStorage.setItem('token', response.data.accesstoken);
                    setValue('token', response.data.data.accesstoken);
                    setValue('userdetail', response.data.data)
                    navigate("/dashboard");
                    showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' })
                    // dispatch(showToast({
                    //     showtoast: true,
                    //     message: 'Login Successful',
                    //     type: 'success'
                    // }));
                    // console.log('Login successful, token stored.');
                    // toast.current.show({ severity: 'success', summary: 'Login Successful', detail: 'Welcome!', life: 3000 });
                    dispatch({
                        type: "userSession",
                        payload: true
                    });
                }
            } catch (error) {
                console.error('Error during login:', error);
                // dispatch(showToast({
                //     showtoast: true,
                //     message: 'Login Failed',
                //     type: 'error'
                // }));
                // showToast(dispatch, { showtoast: true, message: "An error occurred", type: 'error' });
                showToast(dispatch, { showtoast: true, message: error?.response?.data?.message, summary: error?.response?.data?.status, type: 'error' })
                // toast.current.show({ severity: 'error', summary: error?.response?.data?.status, detail: error?.response?.data?.message, life: 3000 });
            }
        }
    });

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            {/* <Toast ref={toast} /> */}
            <div className="card w-full md:w-6 lg:w-4">
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-column align-items-center gap-4 py-5">
                        <div className="w-full">
                            <label htmlFor="email" className="block text-left mb-2">Email</label>
                            <InputText
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`p-inputtext-lg w-full ${formik.errors.email && formik.touched.email ? 'p-invalid' : ''}`}
                                placeholder="Enter email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <small className="p-error">{formik.errors.email}</small>
                            )}
                        </div>

                        <div className="w-full">
                            <label htmlFor="password" className="block text-left mb-2">Password</label>
                            <InputText
                                id="password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full ${formik.errors.password && formik.touched.password ? 'p-invalid' : ''}`}
                                placeholder="Enter password"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <small className="p-error">{formik.errors.password}</small>
                            )}
                        </div>

                        <Button severity="success" type="submit" label="Login" icon="pi pi-user" className="w-full"></Button>
                    </div>

                    <Divider align="center">
                        <b>OR</b>
                    </Divider>
                </form>
                <div className="flex justify-content-center py-3">
                    <Button label="Sign Up" icon="pi pi-user-plus" severity="success" className="w-full" onClick={() => {
                        navigate("/register");
                    }}></Button>
                </div>

            </div>
        </div>
    );
};

export default Login;
