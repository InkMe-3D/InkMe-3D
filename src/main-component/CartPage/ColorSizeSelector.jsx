import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../utils/api';

const ColorSizeSelector = ({ item, onUpdate, loading, type }) => {
    const [options, setOptions] = useState([]);
    const [currentValue, setCurrentValue] = useState('');

    // Get current value from cart item
    useEffect(() => {
        if (type === 'color' && item.productColor) {
            setCurrentValue(item.productColor);
        } else if (type === 'size' && item.productSize) {
            setCurrentValue(item.productSize);
        }
    }, [item.productColor, item.productSize, type]);

    // Fetch product options when component mounts
    useEffect(() => {
        const fetchProductOptions = async () => {
            try {
                const productData = await fetchDataFromApi(`/api/products/${item.productId}`);
                if (productData) {
                    if (type === 'color') {
                        setOptions(productData.productColor || []);
                    } else if (type === 'size') {
                        setOptions(productData.productSize || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching product options:', error);
            }
        };

        if (item.productId) {
            fetchProductOptions();
        }
    }, [item.productId, type]);

    const handleChange = (newValue) => {
        setCurrentValue(newValue);

        // Create update object with current values from cart item
        const updateData = {
            color: type === 'color' ? newValue : item.productColor,
            size: type === 'size' ? newValue : item.productSize
        };

        onUpdate(item, updateData);
    };

    // Color mapping for display
    const colorMap = {
        'Xám': '#9ca3af',
        'Xanh dương': '#3b82f6',
        'Xanh lá': '#22c55e',
        'Vàng': '#fbbf24',
        'Tím': '#a855f7',
        'Đỏ': '#ef4444',
        'Đen': '#1f2937',
        'Trắng': '#f9fafb',
        'Hồng': '#ec4899',
        'Cam': '#f97316',
        'Nâu': '#a3a3a3',
        'Xanh lam': '#06b6d4',
        'Gray': '#9ca3af',
        'Blue': '#3b82f6',
        'Green': '#22c55e',
        'Yellow': '#fbbf24',
        'Purple': '#a855f7',
        'Red': '#ef4444',
        'Black': '#1f2937',
        'White': '#f9fafb',
        'Pink': '#ec4899',
        'Orange': '#f97316',
        'Brown': '#a3a3a3',
        'Cyan': '#06b6d4'
    };

    if (loading) {
        return <div className="spinner-border spinner-border-sm" role="status"></div>;
    }

    return (
        <div className="color-size-selector">
            <select
                value={currentValue}
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
                className="form-select form-select-sm"
                style={{ fontSize: '14px', padding: '4px 8px' }}
            >
                <option value="">
                    {type === 'color' ? 'Chọn màu' : 'Chọn size'}
                </option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            {type === 'color' && currentValue && (
                <div
                    className="color-preview mt-1"
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: colorMap[currentValue] || '#cccccc',
                        borderRadius: '50%',
                        border: '1px solid #ddd',
                        display: 'inline-block'
                    }}
                    title={currentValue}
                />
            )}
        </div>
    );
};

export default ColorSizeSelector; 