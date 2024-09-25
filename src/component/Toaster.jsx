import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
// import { hideToast } from '../redux/actions';
import { useEffect, useRef } from 'react'
export default function Toaster() {
    // eslint-disable-next-line no-undef
    const toast = useRef(null);
    const dispatch = useDispatch();
    const { toastConf } = useSelector(state => state.custom) || {};;
    console.log(toastConf, 'check toastConf');

    useEffect(() => {
        if (toastConf?.showtoast) {
            // Show toast based on the type
            console.log('====================================');
            console.log('check toast');
            console.log('====================================');
            toast.current.show({
                severity: toastConf.type, // 'success', 'error', 'warn', 'info'
                summary: toastConf.type.charAt(0).toUpperCase() + toastConf.type.slice(1),
                detail: toastConf.message,
                life: 3000 // You can adjust the life of toast
            });

            // Automatically hide the toast after showing
            setTimeout(() => {

                dispatch({
                    type: "hideToast",
                    payload: { showtoast: false, message: "", type: "" }
                });
                // dispatch(hideToast({ showtoast: false, message: "", type: "" }));
            }, 3000);

        }
    }, [toastConf, dispatch]);
    return <Toast ref={toast} />;
}