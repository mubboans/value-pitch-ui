export const getValue = (name) => {
    const value = localStorage.getItem(name);
    const storedValue = value ? value : "{}";
    return JSON.parse(storedValue);
}


export const setValue = (name, value) => {
    const data = JSON.stringify(value);
    localStorage.setItem(name, data);
}

export const isUserLogined = () => {
    return !!localStorage.getItem('token');
}

export function LogoutUser() {
    console.log('logouting users');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetail');
    localStorage.clear();
    // ChangeUserState(dispatch, "userState", false)
}

export function showToast(dispatch, obj) {
    console.log(obj, 'check obj');

    dispatch({
        type: "showToast",
        payload: obj
    });
}