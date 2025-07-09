import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import ShopSidebar from "./ShopSidebar";
import { trackViewProduct } from "../../utils/analytics";

const ShopProduct = ({ products, addToCartProduct, searchTerm, setSearchTerm,
     selectedCategory, setSelectedCategory}) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    const handleProductClick = (product) => {
        // Google Analytics tracking - Product Click
        trackViewProduct({
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category?.name || 'Custom Print'
        });
    };

    const [sortOption, setSortOption] = useState('1');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const resultsPerPage = 12;
    const totalResultsRef = useRef(0);

    useEffect(() => {
        if (products && products.products) {
            totalResultsRef.current = products.products.length;
            setLoading(false);
        }
    }, [products]);

    const totalPages = Math.ceil(totalResultsRef.current / resultsPerPage);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const startIndex = (currentPage - 1) * resultsPerPage;
    const filteredProducts = products && products.products ? products.products.filter(product =>{
        if(searchTerm){
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if(selectedCategory){
            console.log( selectedCategory);
            return product.category._id === selectedCategory;
        }
       
        return product;
    }
    ) : [];
    const currentProducts = filteredProducts.slice(startIndex, startIndex + resultsPerPage);

    const [activeTab, setActiveTab] = useState('Tab1');
    const openTab = (TabName) => {
        setActiveTab(TabName);
    };

    useEffect(() => {
        openTab('Tab1');
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="shop-page-section fix section-padding section-bg-2">
            <div className="container">
                <div className="row g-4">
                    <div className="col-xl-3 col-lg-4 order-2 order-md-1">
                        <ShopSidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} 
                        setSelectedCategory={setSelectedCategory}/>
                    </div>
                    <div className="col-xl-9 col-lg-8 order-1 order-md-2">
                        <div className="woocommerce-notices-wrapper">
                            <p>Showing <span>{currentProducts.length}</span> of {totalResultsRef.current} Results</p>
                            <div className="form-clt">
                                
                                <div className="icon">
                                    <button
                                        className={`tab ${activeTab === 'Tab1' ? 'active' : ''}`}
                                        onClick={() => openTab('Tab1')}
                                    >
                                        <i className="fas fa-list"></i>
                                    </button>
                                </div>
                                <div className="icon">
                                    <button
                                        className={`tab ${activeTab === 'Tab2' ? 'active' : ''}`}
                                        onClick={() => openTab('Tab2')}
                                    >
                                        <i className="fas fa-th-large"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {currentProducts.map((product) => (
                                <Link 
                                    to={`/shop-details/Calendar-printing-design/${product._id}`} 
                                    key={product._id} 
                                    className="col-lg-4 col-md-6 col-12"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="product-box-items">
                                        <div className="product-image">
                                            <img src={product.images[0]} alt="img" />
                                            <ul className="product-icon d-grid align-items-center">
                                                <li>
                                                    <button onClick={(e) => { e.stopPropagation(); addToCartProduct(product); }}>
                                                        <i className="fa-sharp fa-regular fa-eye"></i>
                                                    </button>
                                                </li>
                                                <li>
                                                    <Link onClick={ClickHandler} to="#"><i className="fa-regular fa-star"></i></Link>
                                                </li>
                                                <li>
                                                    <Link onClick={ClickHandler} to={`/shop-details/${product.slug}`}>
                                                        <i className="fa-regular fa-arrow-up-arrow-down"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                            <div className="shop-btn">
                                                <button onClick={(e) => { e.stopPropagation(); addToCartProduct(product); }} className="theme-btn">
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div className="star">
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="fa-solid fa-star"></i>
                                                <i className="color-2 fa-solid fa-star"></i>
                                            </div>
                                            <h6>
                                                <Link onClick={ClickHandler} to={`/shop-details/${product.slug}`}>
                                                    {product.name}
                                                </Link>
                                            </h6>
                                            <span>{product.price} VND</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="page-nav-wrap mt-5 text-center">
                            <ul>
                                <li>
                                    <button
                                        className="page-numbers"
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fa-solid fa-chevrons-left"></i>
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i}>
                                        <button
                                            className={`page-numbers ${currentPage === i + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className="page-numbers"
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fa-solid fa-chevrons-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopProduct;
