import React, { Fragment, useContext, useEffect, useState, useCallback } from "react";
import NavbarS2 from '../../components/NavbarPages/NavbarS2/NavbarS2';
import PageTitle from '../../components/pagetitle/PageTitle'
import CtaSectionS2 from '../../components/CtaPages/CtaSectionS2/CtaSectionS2';
import FooterS3 from '../../components/FooterPages/footerS3/FooterS3';

import { Link } from "react-router-dom";
import { MyContext } from '../../context/MyContext';
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import QuantityBox from "../../components/QuantityBox";
import InkMeFile from './InkMeFile';
import ColorSizeSelector from './ColorSizeSelector';
import './Cart.css';

const CartPage = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const context = useContext(MyContext);

  // Helper function to update cart data
  const updateCartData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.userId) return;

    fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
      setCartData(res);
      context.setCartData(res);
      // Initialize quantities
      const initialQuantities = {};
      res.forEach(item => {
        initialQuantities[item._id] = item.quantity;
      });
      setSelectedQuantity(initialQuantities);
      // Calculate total
      const total = res.reduce((sum, item) => sum + item.subTotal, 0);
      setTotalAmount(total);
    });
  }, []);

  useEffect(() => {
    updateCartData();
  }, []); // Only run once on mount

  const removeItem = (id) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    deleteData(`/api/cart/${id}`).then((res) => {
      context.setAlterBox({
        open: true,
        error: false,
        message: "Xóa sản phẩm thành công"
      });
      updateCartData();
    }).finally(() => {
      setLoading(prev => ({ ...prev, [id]: false }));
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(prev => ({ ...prev, [item._id]: true }));

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.userId) return;

      const cartFields = {
        productTitle: item.productTitle,
        images: item.images,
        rating: item.rating,
        price: item.price,
        quantity: newQuantity,
        subTotal: item.price * newQuantity,
        productId: item.productId,
        userId: user.userId,
        inkmeFile: item.inkmeFile,
        productColor: item.productColor,
        productSize: item.productSize,
        classifications: item.classifications?.map(cls => ({
          ...cls,
          quantity: newQuantity,
          subTotal: cls.price * newQuantity
        }))
      };

      await editData(`/api/cart/${item._id}`, cartFields);
      updateCartData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, [item._id]: false }));
    }
  };

  const updateColorSize = async (item, options) => {
    setLoading(prev => ({ ...prev, [item._id]: true }));

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.userId) return;

      // Create new classification name from size and color
      const newName = `${options.size || ''} - ${options.color || ''}`.trim().replace(/^-\s*|-\s*$/g, '') || 'Không xác định';

      const cartFields = {
        productTitle: item.productTitle,
        images: item.images,
        rating: item.rating,
        price: item.price,
        quantity: item.quantity,
        subTotal: item.subTotal,
        productId: item.productId,
        userId: user.userId,
        productColor: options.color || item.productColor,
        productSize: options.size || item.productSize,
        inkmeFile: item.inkmeFile,
        classifications: [{
          name: newName,
          image: item.classifications?.[0]?.image || item.images[0] || '',
          price: item.price,
          quantity: item.quantity,
          subTotal: item.subTotal
        }]
      };

      await editData(`/api/cart/${item._id}`, cartFields);
      updateCartData();

      context.setAlterBox({
        open: true,
        error: false,
        message: "Cập nhật thành công"
      });
    } catch (error) {
      console.error('Error updating color/size:', error);
      context.setAlterBox({
        open: true,
        error: true,
        message: "Có lỗi xảy ra khi cập nhật"
      });
    } finally {
      setLoading(prev => ({ ...prev, [item._id]: false }));
    }
  };

  return (
    <Fragment>
      <NavbarS2 hclass={'header-section-2 style-two'} />
      <PageTitle pageTitle={'ImkMe - 3D Printing'} pagesub={'Giỏ hàng'} />

      <section className="cart-section section-padding section-bg-2">
        <div className="container cart-page-container">
          <div className="main-cart-wrapper">
            <div className="row">
              <div className="col-12">
                <div className="cart-wrapper">
                  <div className="cart-items-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Màu sắc</th>
                          <th>Kích thước</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng cộng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartData?.length !== 0 ? (
                          cartData?.map((item) => {
                            return (
                              <React.Fragment key={item._id}>
                                <tr className="cart-item">
                                  <td className="cart-item-info">
                                    <div className="tooltip-wrapper">
                                      {item.inkmeFile ? (
                                        <div className="cart-item-image-wrapper">
                                          <InkMeFile inkmeFile={item.inkmeFile} />
                                        </div>
                                      ) : (
                                        <img
                                          src={item.images[0]}
                                          alt={item.productTitle}
                                          className="product-image"
                                          style={{ width: '150px', height: '150px' }}
                                        />
                                      )}
                                      <span className="tooltip-glass">{item.productTitle}</span>
                                    </div>
                                  </td>

                                  <td className="cart-item-color">
                                    {item.inkmeFile ? (
                                      <span className="text-muted"></span>
                                    ) : (
                                      <ColorSizeSelector
                                        item={item}
                                        onUpdate={updateColorSize}
                                        loading={loading[item._id]}
                                        type="color"
                                      />
                                    )}
                                  </td>

                                  <td className="cart-item-size">
                                    {item.inkmeFile ? (
                                      <span className="text-muted"></span>
                                    ) : (
                                      <ColorSizeSelector
                                        item={item}
                                        onUpdate={updateColorSize}
                                        loading={loading[item._id]}
                                        type="size"
                                      />
                                    )}
                                  </td>

                                  <td className="cart-item-price">
                                    <span className="base-price">{formatCurrency(item.price)}</span>
                                  </td>

                                  <td>
                                    <div className="cart-item-quantity">
                                      <QuantityBox
                                        item={item}
                                        value={selectedQuantity[item._id]}
                                        onQuantityChange={(newQuantity) => updateQuantity(item, newQuantity)}
                                        loading={loading[item._id]}
                                      />
                                    </div>
                                  </td>

                                  <td className="cart-item-price">
                                    <span className="total-price">{formatCurrency(item.subTotal)}</span>
                                  </td>

                                  <td className="cart-item-remove">
                                    <button
                                      onClick={() => removeItem(item._id)}
                                      disabled={loading[item._id]}
                                      className="remove-btn"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </td>
                                </tr>
                              </React.Fragment>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <div className="empty-cart">
                                <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                <h5>Giỏ hàng trống</h5>
                                <p className="text-muted">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="cart-wrapper-footer">
                    <form>
                      <input type="text" name="promo-code" id="promoCode" placeholder="Mã giảm giá" />
                      <button type="submit" className="theme-btn">
                        <span>Áp dụng</span>
                      </button>
                    </form>

                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6"></div>
              <div className="col-xl-6">
                <div className="cart-pragh-box">
                  <div className="cart-graph">
                    <h4>Tổng giỏ hàng</h4>
                    <ul>
                      <li>
                        <span>Tạm tính</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </li>
                      <li>
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </li>
                      <li>
                        <span>Tổng cộng</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </li>
                    </ul>
                    <div className="chck">
                      <Link onClick={ClickHandler} to="/checkout" className="theme-btn">
                        <span>Thanh toán</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSectionS2 />
      <FooterS3 />

    </Fragment>
  );
};

export default CartPage;











