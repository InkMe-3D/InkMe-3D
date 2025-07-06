import React from 'react';
import { Link } from 'react-router-dom';
import RangeBarCustom from './RangeBarCustom';
import FilterSize from './handleCheckboxChange';
import FilterStarRating from './FilterStarRating';
import { getCategorys } from '../../services/ShopServices';
import { useEffect, useState } from 'react';

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const ShopSidebar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory,
   }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await getCategorys();
            setCategories(response.categoryList);
        };
        fetchCategory();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="shop-main-sidebar">
            <div className="single-sidebar-widget">
                <div className="wid-title">
                    <h4>Tìm kiếm sản phẩm</h4>
                </div>
                <div className="search_widget">
                    <form action="#">
                        <input type="text" placeholder="Tìm kiếm sản phẩm" value={searchTerm} onChange={handleSearchChange} className="search-input" style={{ textTransform: 'none' }} />
                        <button type="submit" className="search-button"><i className="fal fa-search"></i></button>
                    </form>
                </div>
            </div>
            <div className="single-sidebar-widget">
                <div className="wid-title">
                    <h4>Danh mục</h4>
                </div>
                <div className="shop-catagory-items">
                    <ul className="category-list">
                        {categories.map((category, index) => (
                            <li key={index} onClick={() => handleCategorySelect(category._id)} className={`category-item ${selectedCategory === category._id ? 'active' : ''}`} style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px', backgroundColor: selectedCategory === category._id ? '#f0f0f0' : 'transparent' }}>
                                <i className="fa-regular fa-chevron-left"></i>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* <div className="single-sidebar-widget">
                <div className="wid-title">
                    <h4>Lọc theo giá</h4>
                </div>
            </div> */}
            {/* <div className="single-sidebar-widget">
                <div className="wid-title">
                    <h4>Lọc theo kích thước</h4>
                </div>
                <FilterSize />
            </div> */}
            {/* <div className="single-sidebar-widget">
                <div className="wid-title">
                    <h4>Lọc theo đánh giá</h4>
                </div>
                <FilterStarRating/>
            </div> */}
            
            
        </div>
    );
};

export default ShopSidebar;