import React, { useEffect, useState, useContext } from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Link } from 'react-router-dom';
import { MyContext } from '../../context/MyContext';
import { BsCartFill } from 'react-icons/bs';

const Product = ({ product }) => {
  const context = useContext(MyContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tabError, setTabError] = useState(false);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);

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

  useEffect(() => {
    window.scrollTo(10, 0);
  }, []);

  const handleAddToCart = () => {
    setTabError(false);

    if ((product.color && product.color.length > 0 && !selectedColor) ||
      (product.productSize && product.productSize.length > 0 && !selectedSize)) {
      setTabError(true);
      return;
    }

    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };

    context.addToCart(productToAdd);

    // Reset selections after adding to cart
    setActiveSize(null);
    setActiveColor(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const selectImage = (index) => {
    setSelectedImage(index);
  };

  const selectSize = (size, index) => {
    setSelectedSize(size);
    setActiveSize(index);
    setTabError(false);
  };

  const selectColor = (color, index) => {
    setSelectedColor(color);
    setActiveColor(index);
    setTabError(false);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="row g-5">
      <div className="col-md-6">
        <div className="sliderWrapper pt-3 pb-3 ps-4 pe-4">

          {/* Main Image Display */}
          <div className="main-image mb-3" style={{ position: 'relative' }}>
            {product?.images && product.images.length > 0 ? (
              <>
                <Zoom>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-100"
                    style={{
                      width: '600px',
                      height: '600px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Zoom>

                {/* Navigation Buttons */}
                {product.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={goToPrevious}
                      disabled={selectedImage === 0}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: selectedImage === 0 ? 'not-allowed' : 'pointer',
                        opacity: selectedImage === 0 ? 0.3 : 1,
                        transition: 'all 0.3s ease',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== 0) {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                      }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={goToNext}
                      disabled={selectedImage === product.images.length - 1}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: selectedImage === product.images.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: selectedImage === product.images.length - 1 ? 0.3 : 1,
                        transition: 'all 0.3s ease',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== product.images.length - 1) {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                      }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>

                    {/* Image Counter */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {selectedImage + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="no-image d-flex align-items-center justify-content-center"
                style={{
                  width: '600px',
                  height: '600px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                <span>Không có ảnh</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product?.images && product.images.length > 1 && (
            <div className="thumbnail-images d-flex gap-2 justify-content-center">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => selectImage(index)}
                  style={{
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-6">
        <div className="product-details-content">
          <div className="star pb-4">
            {product.discount && <span className="badge bg-danger me-2">{product.discount}%</span>}
            <span>{product.rating} <i className="fa-solid fa-star text-warning"></i></span>
          </div>
          <h3 className="pb-4 split-text right">{product.name}</h3>
          <p className="mb-4">
            {product.description}
          </p>
          <div className="price-list d-flex align-items-center mb-4">
            <span className="fw-bold fs-4 text-primary me-3">
              {product.price?.toLocaleString('vi-VN')} VND
            </span>
            {product.oldPrice && (
              <del className="text-muted">
                {product.oldPrice?.toLocaleString('vi-VN')} VND
              </del>
            )}
          </div>

          {/* Color Selection */}
          {product.color && product.color.length > 0 && (
            <div className="color-selection mb-3">
              <span className="fw-bold">Màu sắc:</span>
              {selectedColor && (
                <span className="ms-2 text-muted">({selectedColor})</span>
              )}
              <div className={`color-options mt-2 d-flex gap-2 align-items-center ${tabError && !selectedColor ? 'error' : ''}`}>
                {product.color.map((color, index) => {
                  const colorHex = colorMap[color] || '#cccccc';
                  const isSelected = activeColor === index;

                  return (
                    <div
                      key={index}
                      onClick={() => selectColor(color, index)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: colorHex,
                        border: isSelected ? '3px solid #007bff' : tabError && !selectedColor ? '2px solid #dc3545' : '2px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 0 2px rgba(0, 123, 255, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        position: 'relative'
                      }}
                      title={color}
                    >
                      {/* White border for light colors */}
                      {(color === 'Trắng' || color === 'White' || color === 'Vàng' || color === 'Yellow') && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: '2px',
                            borderRadius: '50%',
                            border: '1px solid #d1d5db'
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {tabError && !selectedColor && (
                <small className="text-danger">Vui lòng chọn màu sắc</small>
              )}
            </div>
          )}

          {/* Size Selection */}
          {product.productSize && product.productSize.length > 0 && (
            <div className="size-selection mb-3">
              <span className="fw-bold">Kích thước:</span>
              <div className={`size-options mt-2 ${tabError && !selectedSize ? 'error' : ''}`}>
                {product.productSize.map((size, index) => (
                  <button
                    key={index}
                    className={`btn me-2 mb-2 ${activeSize === index ? 'btn-primary' : 'btn-outline-secondary'} ${tabError && !selectedSize ? 'border-danger' : ''}`}
                    onClick={() => selectSize(size, index)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {tabError && !selectedSize && (
                <small className="text-danger">Vui lòng chọn kích thước</small>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="quantity-selection mb-4">
            <span className="fw-bold">Số lượng:</span>
            <div className="quantity-controls d-flex align-items-center mt-2">
              <button
                className="btn btn-outline-secondary"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="mx-3 fw-bold">{quantity}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="cart-wrp">
            <div className="shop-button d-flex align-items-center">
              <button
                className="theme-btn me-3 btn-lg"
                onClick={handleAddToCart}
                disabled={context.addingInCart}
                style={{
                  opacity: context.addingInCart ? 0.7 : 1,
                  cursor: context.addingInCart ? 'not-allowed' : 'pointer'
                }}
              >
                <BsCartFill className="me-2" />
                {context.addingInCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>
              <Link to="#" className="star-icon">
                <i className="fal fa-star"></i>
              </Link>
            </div>
            {tabError && (
              <small className="text-danger mt-2 d-block">
                Vui lòng chọn đầy đủ thông tin sản phẩm
              </small>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;









