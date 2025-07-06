import React, { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";

const QuantityBox = ({ value, onQuantityChange, loading }) => {
    const [inputValue, setInputValue] = useState(value || 1);
    const [isEditing, setIsEditing] = useState(false);

    // Cập nhật giá trị khi `value` thay đổi từ props
    useEffect(() => {
        if (value !== undefined && value !== null && value !== '') {
            setInputValue(parseInt(value));
        }
    }, [value]);

    // Hàm cập nhật số lượng và gọi API nếu thay đổi
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        setInputValue(newQuantity);
        if (!isEditing) {
            onQuantityChange(newQuantity);
        }
    };

    // Xử lý khi người dùng thay đổi số lượng bằng cách nhập trực tiếp
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) { // Chỉ cho phép nhập số
            setInputValue(newValue);
        }
    };

    // Khi nhấn Enter hoặc mất focus, cập nhật giỏ hàng
    const handleInputBlur = () => {
        setIsEditing(false);
        const newQuantity = parseInt(inputValue) || 1;
        if (newQuantity !== value) {
            onQuantityChange(newQuantity);
        }
    };

    const handleInputFocus = () => {
        setIsEditing(true);
    };

    // Xử lý khi nhấn Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
    };

    const minus = () => {
        if (inputValue > 1) {
            handleQuantityChange(inputValue - 1);
        }
    };

    const plus = () => {
        handleQuantityChange(inputValue + 1);
    };

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button
                onClick={minus}
                disabled={loading || inputValue <= 1}
                className="quantity-btn"
            >
                {loading ? <CircularProgress size={20} /> : <FaMinus />}
            </Button>
            <input 
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
                className="quantity-input"
                disabled={loading}
                style={{ width: '50px', color: 'black', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}
            />
            <Button
                onClick={plus}
                disabled={loading}
                className="quantity-btn"
            >
                {loading ? <CircularProgress size={20} /> : <FaPlus />}
            </Button>
        </div>
    );
};

export default QuantityBox;