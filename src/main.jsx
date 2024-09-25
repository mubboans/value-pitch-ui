
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <Provider store={store}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>

    </Provider>
  </BrowserRouter>

)
