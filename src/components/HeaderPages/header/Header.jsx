import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { connect } from "react-redux";
import { removeFromCart } from "../../../store/actions/action";
import HeaderTopbar from '../HeaderTopbar/HeaderTopbar';
import { Avatar } from "@mui/material";
import { getUserById } from "../../../services/UserServices";
import avatarDefault from "../../../img/avatar_defaut.jpg";
// import Logo from '../../img/logo/black-logo.svg';
import Logo from '../../../img/logo/inkme-logo-gradient.png';
import Home1 from '../../../img/header/home-1.jpg';
import Home2 from '../../../img/header/home-2.jpg';
import Home3 from '../../../img/header/home-3.jpg';
import SearchComponent from './search';
import MobileMenu from '../../MobileMenu/MobileMenu';
import { useMyContext } from '../../../context/MyContext';


const Header = (props) => {

    const { userId, logout } = useMyContext();
    const [userInfo, setUserInfo] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const { carts } = props;

    const user = JSON.parse(localStorage.getItem('user'));

    const [isSticky, setIsSticky] = useState(false);

    const { cartData, showHeader } = useMyContext();

    const totalQuantity = cartData.length;

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserById(userId);
            if (res) setUserInfo(res);
        };
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setUserInfo(null);
        logout();
        navigate("/");
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleProfileClick = () => {
        navigate("/user/profile");
        setShowDropdown(false);
    };

    return (
        <>
            {showHeader && (
                <header className={props.hclass}>
                    <HeaderTopbar />
                    <div id="header-sticky" className={isSticky ? 'sticky' : 'header-1'}>
                        <div className="container-fluid">
                            <div className="mega-menu-wrapper">
                                <div className="header-main">
                                    <div className="header-left">
                                        <div className="logo">
                                            <Link onClick={ClickHandler} to="/" className="header-logo">
                                                <img src={Logo} alt="logo-img" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mean__menu-wrapper">
                                        <div className="main-menu">
                                            <nav id="mobile-menu">
                                                <ul>
                                                    <li className="has-dropdown active menu-thumb">
                                                        <Link onClick={ClickHandler} to="/home">
                                                            Trang chủ
                                                        </Link>
                                                        <ul className="submenu has-homemenu">
                                                            <li>
                                                                <div className="homemenu-items">
                                                                    <div className="homemenu">
                                                                        <div className="homemenu-thumb">
                                                                            <img src={Home1} alt="img" />
                                                                            <div className="demo-button">
                                                                                <Link onClick={ClickHandler} to="/home" className="theme-btn">
                                                                                    Demo Page
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <div className="homemenu-content text-center">
                                                                            <h4 className="homemenu-title">
                                                                                Home 01
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="homemenu">
                                                                        <div className="homemenu-thumb mb-15">
                                                                            <img src={Home2} alt="img" />
                                                                            <div className="demo-button">
                                                                                <Link onClick={ClickHandler} to="/home-2" className="theme-btn">
                                                                                    Demo Page
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <div className="homemenu-content text-center">
                                                                            <h4 className="homemenu-title">
                                                                                Home 02
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <div className="homemenu">
                                                                        <div className="homemenu-thumb mb-15">
                                                                            <img src={Home3} alt="img" />
                                                                            <div className="demo-button">
                                                                                <Link onClick={ClickHandler} to="/home-3" className="theme-btn">
                                                                                    Demo Page
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <div className="homemenu-content text-center">
                                                                            <h4 className="homemenu-title">
                                                                                Home 03
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li className="has-dropdown active d-xl-none">
                                                        <Link onClick={ClickHandler} to="/team" className="border-none">
                                                            Home
                                                        </Link>
                                                        <ul className="submenu">
                                                            <li><Link onClick={ClickHandler} to="/home">Home 01</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/home-2">Home 02</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/home-3">Home 03</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <Link onClick={ClickHandler} to="/about">Về chúng tôi</Link>
                                                    </li>
                                                    <li>
                                                        <Link onClick={ClickHandler} to="/service-details/Sticker-printing">Dịch vụ</Link>
                                                    </li>
                                                    {/* <li>
                                                        <Link onClick={ClickHandler} to="#">
                                                            Dịch vụ
                                                        </Link>
                                                        <ul className="submenu">
                                                            <li><Link onClick={ClickHandler} to="/service">Dịch vụ</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/service-details/Sticker-printing">Chi tiết dịch vụ</Link></li>
                                                        </ul>
                                                    </li> */}
                                                    <li className="has-dropdown">
                                                        <Link onClick={ClickHandler} to="#">
                                                            Dự án
                                                        </Link>
                                                        <ul className="submenu">
                                                            <li><Link onClick={ClickHandler} to="/project">Dự án</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/project-details/3d-Genareted-Cate">Chi tiết dự án</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/404">404 Page</Link></li>
                                                        </ul>
                                                    </li>
                                                    {/* <li>
                                                        <Link onClick={ClickHandler} to="#">
                                                            Cửa hàng
                                                        </Link>
                                                        <ul className="submenu">
                                                            <li><Link onClick={ClickHandler} to="/shop">Cửa hàng</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/shop-details/Calendar-printing-design">Chi tiết cửa hàng</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/shop-cart">Giỏ hàng</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/checkout">Thanh toán</Link></li>
                                                        </ul>
                                                    </li> */}
                                                    <li>
                                                        <Link onClick={ClickHandler} to="#">
                                                            Tin tức
                                                        </Link>
                                                        <ul className="submenu">
                                                            <li><Link onClick={ClickHandler} to="/news">Tin tức</Link></li>
                                                            <li><Link onClick={ClickHandler} to="/blog-single/How-To-Teach-Kids-Ramadan-Isn't-About-Food">Chi tiết tin tức</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <Link onClick={ClickHandler} to="/contact">Liên hệ</Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    <div className="header-right d-flex justify-content-end align-items-center">
                                        <SearchComponent />
                                        <h5 className="cart-title">
                                            <Link
                                                onClick={ClickHandler}
                                                to={user ? `/shop-cart/${user.userId}` : "/login"}
                                            >
                                                Giỏ hàng <span className='cart-count'>{totalQuantity}</span>
                                            </Link>
                                        </h5>
                                        <div
                                            ref={dropdownRef}
                                            style={{
                                                position: "relative",
                                                marginLeft: "20px",
                                            }}
                                        >
                                            {userInfo ? (
                                                <>
                                                    <div
                                                        onClick={toggleDropdown}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            cursor: "pointer",
                                                            padding: "5px 10px",
                                                            borderRadius: "25px",
                                                            transition: "background-color 0.3s ease",
                                                            backgroundColor: showDropdown ? "#f0f0f0" : "transparent"
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = showDropdown ? "#f0f0f0" : "transparent"}
                                                    >
                                                        <Avatar
                                                            alt={userInfo?.name}
                                                            src={
                                                                Array.isArray(userInfo.images) &&
                                                                    userInfo.images.length > 0 &&
                                                                    userInfo.images[0]
                                                                    ? userInfo.images[0]
                                                                    : avatarDefault
                                                            }
                                                            sx={{ width: 35, height: 35 }}
                                                        />
                                                        {/* <span style={{
                                                            fontSize: "14px",
                                                            color: "#333",
                                                            fontWeight: "500"
                                                        }}>
                                                            {userInfo?.name}
                                                        </span> */}
                                                        <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}
                                                            style={{ fontSize: "12px", color: "#666" }}></i>
                                                    </div>

                                                    {showDropdown && (
                                                        <div style={{
                                                            position: "absolute",
                                                            top: "100%",
                                                            right: "0",
                                                            marginTop: "10px",
                                                            backgroundColor: "white",
                                                            border: "1px solid #e0e0e0",
                                                            borderRadius: "8px",
                                                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                                            minWidth: "200px",
                                                            zIndex: 1000,
                                                            overflow: "hidden"
                                                        }}>
                                                            <div style={{
                                                                padding: "15px",
                                                                borderBottom: "1px solid #f0f0f0",
                                                                backgroundColor: "#f8f9fa"
                                                            }}>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "10px"
                                                                }}>
                                                                    <Avatar
                                                                        alt={userInfo?.name}
                                                                        src={
                                                                            Array.isArray(userInfo.images) &&
                                                                                userInfo.images.length > 0 &&
                                                                                userInfo.images[0]
                                                                                ? userInfo.images[0]
                                                                                : avatarDefault
                                                                        }
                                                                        sx={{ width: 40, height: 40 }}
                                                                    />
                                                                    {/* <div>
                                                                        <div style={{
                                                                            fontWeight: "600",
                                                                            fontSize: "14px",
                                                                            color: "#333"
                                                                        }}>
                                                                            {userInfo?.name}
                                                                        </div>
                                                                        <div style={{
                                                                            fontSize: "12px",
                                                                            color: "#666"
                                                                        }}>
                                                                            {userInfo?.email}
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                            </div>

                                                            <div style={{ padding: "8px 0" }}>
                                                                <div
                                                                    onClick={handleProfileClick}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "12px",
                                                                        padding: "12px 15px",
                                                                        cursor: "pointer",
                                                                        transition: "background-color 0.2s ease",
                                                                        fontSize: "14px",
                                                                        color: "#333"
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                                                >
                                                                    <i className="fas fa-user" style={{ width: "16px", color: "#666" }}></i>
                                                                    Thông tin cá nhân
                                                                </div>

                                                                <div
                                                                    onClick={() => navigate("/user/orders")}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "12px",
                                                                        padding: "12px 15px",
                                                                        cursor: "pointer",
                                                                        transition: "background-color 0.2s ease",
                                                                        fontSize: "14px",
                                                                        color: "#333"
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                                                >
                                                                    <i className="fas fa-shopping-bag" style={{ width: "16px", color: "#666" }}></i>
                                                                    Đơn hàng của tôi
                                                                </div>

                                                                <div
                                                                    onClick={() => navigate("/user/address")}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "12px",
                                                                        padding: "12px 15px",
                                                                        cursor: "pointer",
                                                                        transition: "background-color 0.2s ease",
                                                                        fontSize: "14px",
                                                                        color: "#333"
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                                                >
                                                                    <i className="fas fa-map-marker-alt" style={{ width: "16px", color: "#666" }}></i>
                                                                    Địa chỉ
                                                                </div>

                                                                <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #f0f0f0" }} />

                                                                <div
                                                                    onClick={handleLogout}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "12px",
                                                                        padding: "12px 15px",
                                                                        cursor: "pointer",
                                                                        transition: "background-color 0.2s ease",
                                                                        fontSize: "14px",
                                                                        color: "#dc3545"
                                                                    }}
                                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                                                >
                                                                    <i className="fas fa-sign-out-alt" style={{ width: "16px", color: "#dc3545" }}></i>
                                                                    Đăng xuất
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div
                                                    onClick={() => navigate("/login")}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        padding: "8px 15px",
                                                        backgroundColor: "#007bff",
                                                        color: "white",
                                                        borderRadius: "20px",
                                                        cursor: "pointer",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                        transition: "background-color 0.3s ease",
                                                        border: "none"
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
                                                >
                                                    <i className="fas fa-user" style={{ fontSize: "12px" }}></i>
                                                    Đăng nhập
                                                </div>
                                            )}
                                        </div>
                                        <div className="header__hamburger d-xl-none my-auto">
                                            <div className="sidebar__toggle">
                                                <MobileMenu />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        carts: state.cartList.cart,
    };
};


export default connect(mapStateToProps, { removeFromCart })(Header);









