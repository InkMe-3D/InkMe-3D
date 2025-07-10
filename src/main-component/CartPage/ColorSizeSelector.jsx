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

    // Enhanced Color Detection System
    const getColorFromName = (colorName) => {
        if (!colorName) return '#cccccc';

        const name = colorName.toLowerCase().trim();

        // Extended color mapping with variations
        const colorMap = {
            // Tiếng Việt - Xanh dương variants
            'xanh dương': '#3b82f6',
            'xanh dương đậm': '#1d4ed8',
            'xanh dương nhạt': '#60a5fa',
            'xanh dương sáng': '#3b82f6',
            'xanh dương tối': '#1e40af',
            'xanh dương navy': '#1e3a8a',
            'xanh dương royal': '#2563eb',

            // Tiếng Việt - Xanh lá variants  
            'xanh lá': '#22c55e',
            'xanh lá đậm': '#16a34a',
            'xanh lá nhạt': '#4ade80',
            'xanh lá sáng': '#22c55e',
            'xanh lá tối': '#166534',
            'xanh lá olive': '#84cc16',
            'xanh lá cây': '#22c55e',

            // Tiếng Việt - Xanh lam variants
            'xanh lam': '#06b6d4',
            'xanh lam đậm': '#0891b2',
            'xanh lam nhạt': '#22d3ee',
            'xanh lam sáng': '#06b6d4',
            'xanh lam tối': '#164e63',
            'xanh ngọc': '#14b8a6',
            'xanh biển': '#0ea5e9',

            // Tiếng Việt - Đỏ variants
            'đỏ': '#ef4444',
            'đỏ đậm': '#dc2626',
            'đỏ nhạt': '#f87171',
            'đỏ sáng': '#ef4444',
            'đỏ tối': '#991b1b',
            'đỏ cherry': '#dc2626',
            'đỏ hồng': '#f43f5e',
            'đỏ cam': '#f97316',

            // Tiếng Việt - Vàng variants
            'vàng': '#fbbf24',
            'vàng đậm': '#f59e0b',
            'vàng nhạt': '#fde047',
            'vàng sáng': '#fbbf24',
            'vàng tối': '#d97706',
            'vàng chanh': '#eab308',
            'vàng cam': '#f59e0b',
            'vàng gold': '#fbbf24',

            // Tiếng Việt - Tím variants
            'tím': '#a855f7',
            'tím đậm': '#9333ea',
            'tím nhạt': '#c084fc',
            'tím sáng': '#a855f7',
            'tím tối': '#7c3aed',
            'tím violet': '#8b5cf6',
            'tím lavender': '#c084fc',

            // Tiếng Việt - Hồng variants
            'hồng': '#ec4899',
            'hồng đậm': '#db2777',
            'hồng nhạt': '#f472b6',
            'hồng sáng': '#ec4899',
            'hồng tối': '#be185d',
            'hồng rose': '#f43f5e',
            'hồng pastel': '#f9a8d4',

            // Tiếng Việt - Cam variants
            'cam': '#f97316',
            'cam đậm': '#ea580c',
            'cam nhạt': '#fb923c',
            'cam sáng': '#f97316',
            'cam tối': '#c2410c',
            'cam đỏ': '#dc2626',

            // Tiếng Việt - Basic colors
            'đen': '#1f2937',
            'trắng': '#ffffff',
            'xám': '#9ca3af',
            'xám đậm': '#6b7280',
            'xám nhạt': '#d1d5db',
            'xám tối': '#374151',
            'nâu': '#a3a3a3',
            'nâu đậm': '#78716c',
            'nâu nhạt': '#d6d3d1',
            'bạc': '#e5e7eb',

            // English variants
            'blue': '#3b82f6',
            'dark blue': '#1d4ed8',
            'light blue': '#60a5fa',
            'navy blue': '#1e3a8a',
            'royal blue': '#2563eb',
            'sky blue': '#0ea5e9',
            'cyan': '#06b6d4',
            'turquoise': '#14b8a6',

            'green': '#22c55e',
            'dark green': '#16a34a',
            'light green': '#4ade80',
            'lime green': '#84cc16',
            'emerald': '#10b981',
            'forest green': '#166534',

            'red': '#ef4444',
            'dark red': '#dc2626',
            'light red': '#f87171',
            'crimson': '#dc143c',
            'cherry red': '#dc2626',

            'yellow': '#fbbf24',
            'dark yellow': '#f59e0b',
            'light yellow': '#fde047',
            'golden': '#ffd700',
            'amber': '#f59e0b',

            'purple': '#a855f7',
            'dark purple': '#9333ea',
            'light purple': '#c084fc',
            'violet': '#8b5cf6',
            'lavender': '#c084fc',
            'indigo': '#6366f1',

            'pink': '#ec4899',
            'dark pink': '#db2777',
            'light pink': '#f472b6',
            'rose': '#f43f5e',
            'magenta': '#d946ef',

            'orange': '#f97316',
            'dark orange': '#ea580c',
            'light orange': '#fb923c',

            'black': '#1f2937',
            'white': '#ffffff',
            'gray': '#9ca3af',
            'grey': '#9ca3af',
            'dark gray': '#6b7280',
            'light gray': '#d1d5db',
            'brown': '#a3a3a3',
            'silver': '#e5e7eb',
            'gold': '#ffd700'
        };

        // Direct match
        if (colorMap[name]) {
            return colorMap[name];
        }

        // Fuzzy matching for complex color names
        const fuzzyMatch = (input, target) => {
            return input.includes(target) || target.includes(input);
        };

        // Try to find partial matches
        for (const [key, value] of Object.entries(colorMap)) {
            if (fuzzyMatch(name, key)) {
                return value;
            }
        }

        // Advanced pattern matching
        const patterns = [
            // Xanh patterns
            { pattern: /(xanh|blue).*?(dương|navy|royal)/, color: '#1e40af' },
            { pattern: /(xanh|green).*?(lá|lime|forest)/, color: '#22c55e' },
            { pattern: /(xanh|cyan|turquoise).*?(lam|biển)/, color: '#06b6d4' },

            // Đỏ patterns  
            { pattern: /(đỏ|red).*?(đậm|dark|cherry)/, color: '#dc2626' },
            { pattern: /(đỏ|red).*?(nhạt|light|pink)/, color: '#f87171' },

            // Vàng patterns
            { pattern: /(vàng|yellow).*?(đậm|dark|gold)/, color: '#f59e0b' },
            { pattern: /(vàng|yellow).*?(nhạt|light|pale)/, color: '#fde047' },

            // Tím patterns
            { pattern: /(tím|purple).*?(đậm|dark|deep)/, color: '#9333ea' },
            { pattern: /(tím|purple).*?(nhạt|light|lavender)/, color: '#c084fc' },

            // Intensity modifiers
            { pattern: /đậm|dark|deep|tối/, color: null, modifier: 'darken' },
            { pattern: /nhạt|light|pale|sáng/, color: null, modifier: 'lighten' },
        ];

        for (const { pattern, color, modifier } of patterns) {
            if (pattern.test(name)) {
                if (color) return color;

                // Apply modifier to base color
                if (modifier && name.includes('xanh dương')) {
                    return modifier === 'darken' ? '#1d4ed8' : '#60a5fa';
                }
                if (modifier && name.includes('đỏ')) {
                    return modifier === 'darken' ? '#dc2626' : '#f87171';
                }
                // Add more modifier logic as needed
            }
        }

        // Color name extraction
        const colorKeywords = ['xanh', 'đỏ', 'vàng', 'tím', 'hồng', 'cam', 'đen', 'trắng', 'xám', 'nâu',
            'blue', 'red', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'gray', 'brown'];

        for (const keyword of colorKeywords) {
            if (name.includes(keyword)) {
                return colorMap[keyword] || '#cccccc';
            }
        }

        // Fallback: return a default color
        console.warn(`Unknown color: ${colorName}, using default gray`);
        return '#cccccc';
    };

    if (loading) {
        return <div className="spinner-border spinner-border-sm" role="status"></div>;
    }

    return (
        <div className="color-size-selector">
            {type === 'color' ? (
                // Chỉ hiển thị màu mà không có dropdown
                <div className="d-flex align-items-center">
                    {currentValue && (
                        <>
                            <div
                                className="color-preview me-2"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: getColorFromName(currentValue),
                                    borderRadius: '50%',
                                    border: '1px solid #ddd',
                                    display: 'inline-block',
                                    position: 'relative'
                                }}
                                title={currentValue}
                            >
                                {/* White border for light colors */}
                                {(() => {
                                    const lightColors = ['trắng', 'white', 'vàng', 'yellow', 'vàng nhạt', 'light yellow', 'vàng sáng', 'cream', 'beige'];
                                    const colorLower = currentValue.toLowerCase();
                                    const isLightColor = lightColors.some(lightColor => colorLower.includes(lightColor));
                                    return isLightColor && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                inset: '2px',
                                                borderRadius: '50%',
                                                border: '1px solid #d1d5db'
                                            }}
                                        />
                                    );
                                })()}
                            </div>
                            <span className='color-name' style={{ fontSize: '14px' }}>{currentValue}</span>
                        </>
                    )}
                    {!currentValue && (
                        <span style={{ fontSize: '14px', color: '#999' }}>Không có màu</span>
                    )}
                </div>
            ) : (
                // Hiển thị dropdown cho size
                <select
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={loading}
                    className="form-select form-select-sm size-selector"
                    style={{ fontSize: '14px', padding: '4px 8px' }}
                >
                    <option value="" >
                        Chọn size
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default ColorSizeSelector; 