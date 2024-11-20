import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ControlSidebar from './ControlSidebar';
import { FloatButton } from 'antd';

function BackOffice(props) {
    return <>
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className='content-wrapper p-3'>
                {props.children}
            </div>
            <Footer />
            <FloatButton.BackTop shape='square' type='default' />
            <ControlSidebar />
        </div>
    </>
}

export default BackOffice;