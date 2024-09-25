

import { Menubar } from 'primereact/menubar';
// import { useEffect } from 'react';
import { isUserLogined, LogoutUser } from '../helper/helperFn';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { session } = useSelector(state => state.custom) || {};
    const [login, setLogin] = useState(isUserLogined());
    useEffect(() => {
        setLogin(session);
    }, [session])
    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/dashboard'
        },
        {
            label: 'MyUsers',
            icon: 'pi pi-star'
        },
        {
            label: 'Profile',
            icon: 'pi pi-search',
        },
        {
            label: 'Logout',
            icon: 'pi pi-envelope',
            command: () => {
                console.log('====================================');
                console.log('item click');
                console.log('====================================');
                LogoutUser();
                navigate('/login')
                // setLogin(false)
                dispatch({
                    type: "userSession",
                    payload: false
                });
                // login = false;
            }

        }
    ];

    return (
        login ?
            <div className="card">
                <Menubar model={items} />
            </div>
            : null
    )
}
