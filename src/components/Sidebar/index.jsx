import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { FaBell, FaCartArrowDown, FaProductHunt } from 'react-icons/fa6';
import { IoIosSettings, IoMdLogOut } from 'react-icons/io';
import { MdMessage } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';

const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleMenu, setIsToggleMenu] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const context = useContext(MyContext);
    const history = useNavigate();

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleMenu(!isToggleMenu);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !== null && token !== "" && token !== undefined && token !== "undefined") {
            setIsLogin(true);
        } else {
            // Chỉ redirect đến login nếu không có token và không có URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token');

            if (!urlToken) {
                history('/login');
            }
        }
    }, []);

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"><RxDashboard /></span>
                                Quản Lý
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleMenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)} >
                            <span className="icon"><FaProductHunt /></span>
                            Sản Phẩm
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleMenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/products">Danh Sách Sản Phẩm</Link></li>
                                {/* <li><Link to="/product/details">View Sản Phẩm</Link></li> */}
                                <li><Link to="/product/upload">Thêm Sản Phẩm</Link></li>
                                {/* <li><Link to="/productRams/add">Thêm Rams sản phẩm</Link></li>
                                <li><Link to="/productSize/add">Thêm kích thước sản phẩm</Link></li> */}
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 6 && isToggleMenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)} >
                            <span className="icon"><FaProductHunt /></span>
                            Phân loại
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 6 && isToggleMenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/category">Danh sách danh mục</Link></li>
                                <li><Link to="/subCategory">Danh sách danh mục con</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/orders">
                            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className="icon"><FaCartArrowDown /></span>
                                Quản lý đơn hàng
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className="icon"><MdMessage /></span>
                                Messages
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/homeBanner">
                            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className="icon"><MdMessage /></span>
                                Ảnh Banner
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className="icon"><FaBell /></span>
                                Notifications
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>

                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                <span className="icon"><IoIosSettings /></span>
                                Settings
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                </ul>

                <br />

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant='contained'><IoMdLogOut /> Logout</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar