// import { Outlet } from 'react-router';
import Navbar from './../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';
import { Outlet } from 'react-router-dom';


const Root = () => {

  
    return (
        <div className=''>
            <Navbar></Navbar>
            <Outlet />
            <Footer />

    
        
        </div>
    );
};

export default Root;