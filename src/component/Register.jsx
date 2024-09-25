import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setValue, showToast } from '../helper/helperFn';
import axiosInstance from './../helper/axios_helper';
import { useNavigate } from 'react-router-dom';
// Import your showToast function

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Formik form validation schema using Yup
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            password: '',
            email: '',
            contact: '',
            countrycode: '',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            contact: Yup.string().required('Contact is required'),
            countrycode: Yup.string().required('Country Code is required'),
        }),
        onSubmit: async (values) => {
            try {
                // const response = await axios.post('http://localhost:8008/valuepitch/auth/register', values, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // });
                // console.log(response.data);
                const response = await axiosInstance.post('/auth/register', values, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data && response.data) {
                    // localStorage.setItem('token', response.data.accesstoken);
                    setValue('token', response.data.data.accesstoken);
                    setValue('userdetail', response.data.data)
                    navigate("/dashboard");
                    dispatch({
                        type: "userSession",
                        payload: true
                    });
                    showToast(dispatch, { showtoast: true, message: response.data.message, type: 'success' })
                    // dispatch(showToast({
                    //     showtoast: true,
                    //     message: 'Login Successful',
                    //     type: 'success'
                    // }));
                    // console.log('Login successful, token stored.');
                    // toast.current.show({ severity: 'success', summary: 'Login Successful', detail: 'Welcome!', life: 3000 });

                }
                // showToast(dispatch, { showtoast: true, message: response.data.data.message, type: 'success' });
            } catch (error) {
                console.error('Error during registration:', error);
                showToast(dispatch, { showtoast: true, message: 'Registration failed', type: 'error' });
            }
        },
    });

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4">
            <div className="card w-full md:w-8 lg:w-6 p-4 md:p-5 lg:p-6">
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={formik.handleSubmit} className="p-fluid">
                    {/* First Name */}
                    <div className="field mb-3">
                        <label htmlFor="firstname">First Name</label>
                        <InputText
                            id="firstname"
                            name="firstname"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.firstname && formik.errors.firstname ? 'p-invalid' : ''}`}
                            placeholder="First Name"
                        />
                        {formik.touched.firstname && formik.errors.firstname ? (
                            <small className="p-error">{formik.errors.firstname}</small>
                        ) : null}
                    </div>

                    {/* Last Name */}
                    <div className="field mb-3">
                        <label htmlFor="lastname">Last Name</label>
                        <InputText
                            id="lastname"
                            name="lastname"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.lastname && formik.errors.lastname ? 'p-invalid' : ''}`}
                            placeholder="Last Name"
                        />
                        {formik.touched.lastname && formik.errors.lastname ? (
                            <small className="p-error">{formik.errors.lastname}</small>
                        ) : null}
                    </div>

                    {/* Email */}
                    <div className="field mb-3">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.email && formik.errors.email ? 'p-invalid' : ''}`}
                            placeholder="Email"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <small className="p-error">{formik.errors.email}</small>
                        ) : null}
                    </div>

                    {/* Password */}
                    <div className="field mb-3">
                        <label htmlFor="password">Password</label>
                        <InputText
                            id="password"
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.password && formik.errors.password ? 'p-invalid' : ''}`}
                            placeholder="Password"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <small className="p-error">{formik.errors.password}</small>
                        ) : null}
                    </div>

                    {/* Contact */}
                    <div className="field mb-3">
                        <label htmlFor="contact">Contact</label>
                        <InputText
                            id="contact"
                            name="contact"
                            value={formik.values.contact}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.contact && formik.errors.contact ? 'p-invalid' : ''}`}
                            placeholder="Contact"
                        />
                        {formik.touched.contact && formik.errors.contact ? (
                            <small className="p-error">{formik.errors.contact}</small>
                        ) : null}
                    </div>

                    {/* Country Code */}
                    <div className="field mb-3">
                        <label htmlFor="countrycode">Country Code</label>
                        <InputText
                            id="countrycode"
                            name="countrycode"
                            value={formik.values.countrycode}
                            onChange={formik.handleChange}
                            className={`w-full ${formik.touched.countrycode && formik.errors.countrycode ? 'p-invalid' : ''}`}
                            placeholder="+91"
                        />
                        {formik.touched.countrycode && formik.errors.countrycode ? (
                            <small className="p-error">{formik.errors.countrycode}</small>
                        ) : null}
                    </div>

                    <Divider />

                    <div className="flex justify-content-center mt-4">
                        <Button type="submit" label="Register" icon="pi pi-user-plus" className="w-full sm:w-10rem" />
                    </div>
                </form>
                <div className="flex justify-content-center py-3">
                    <Button label="Login" icon="pi pi-user-plus" className="w-full" onClick={() => {
                        navigate("/login");
                    }}></Button>
                </div>

            </div>
        </div>
    );
}
