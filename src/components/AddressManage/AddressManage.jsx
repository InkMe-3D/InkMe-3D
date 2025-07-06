import React, { useState, useEffect, useCallback } from 'react'
import { Edit, Delete, Add } from '@mui/icons-material';
import { postData, editData, deleteData, fetchDataFromApi } from '../../utils/api';
import PayOSPayment from '../Payment/PayOSPayment';
import { Link } from 'react-router-dom';
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Card, CardContent, Typography, Box, Radio, RadioGroup } from '@mui/material';
import { useContext } from 'react';
import { MyContext } from '../../context/MyContext';


const AddressManage = () => {
    const context = useContext(MyContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [addresses, setAddresses] = useState([]);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddressId, setDeletingAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        city: '',
        details: '',
        moreInfo: ''
    });

    const fetchAddresses = useCallback(async () => {
        try {
            const response = await fetchDataFromApi(`/api/address/user/${user.userId}`);
            setAddresses(response);
            // Set selected address to default address if exists
            const defaultAddress = response.find(addr => addr.isDefault);
            if (defaultAddress) {
                context.setSelectedAddressId(defaultAddress._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }, [user.userId, context]);

    // Fetch addresses when component mounts
    useEffect(() => {
        if (user?.userId) {
            fetchAddresses();
        }
    }, [user?.userId, fetchAddresses]);

    // Xử lý thêm địa chỉ mới
    const handleAddAddress = async () => {
        try {
            if (!newAddress.city || !newAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Vui lòng điền đầy đủ thông tin địa chỉ",
                });
                return;
            }

            const response = await postData(`/api/address`, {
                userId: user.userId,
                ...newAddress
            });

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Có lỗi xảy ra khi thêm địa chỉ",
                });
                return;
            }

            await fetchAddresses();
            setNewAddress({ city: '', details: '', moreInfo: '' });
            setShowAddAddressModal(false);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Thêm địa chỉ thành công!",
            });
        } catch (error) {
            console.error('Error adding address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Có lỗi xảy ra khi thêm địa chỉ",
            });
        }
    };

    // Xử lý sửa địa chỉ
    const handleEditAddress = async () => {
        try {
            if (!editingAddress.city || !editingAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Vui lòng điền đầy đủ thông tin địa chỉ",
                });
                return;
            }

            const response = await editData(`/api/address/${editingAddress._id}`, {
                city: editingAddress.city,
                details: editingAddress.details,
                moreInfo: editingAddress.moreInfo
            });

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Có lỗi xảy ra khi sửa địa chỉ",
                });
                return;
            }

            await fetchAddresses();
            setShowEditAddressModal(false);
            setEditingAddress(null);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Cập nhật địa chỉ thành công!",
            });
        } catch (error) {
            console.error('Error editing address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Có lỗi xảy ra khi sửa địa chỉ",
            });
        }
    };

    // Hiển thị dialog xác nhận xóa
    const showDeleteConfirmation = (addressId) => {
        setDeletingAddressId(addressId);
        setShowDeleteConfirmModal(true);
    };

    // Xử lý xóa địa chỉ
    const handleDeleteAddress = async () => {
        try {
            const response = await deleteData(`/api/address/${deletingAddressId}`);

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: response.notify || response.message || "Có lỗi xảy ra khi xóa địa chỉ",
                });
                return;
            }

            await fetchAddresses();
            if (context.selectedAddressId === deletingAddressId) {
                context.setSelectedAddressId('');
            }
            setShowDeleteConfirmModal(false);
            setDeletingAddressId(null);
            context.setAlterBox({
                open: true,
                error: false,
                message: "Xóa địa chỉ thành công!",
            });
        } catch (error) {
            console.error('Error deleting address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Có lỗi xảy ra khi xóa địa chỉ",
            });
        }
    };

    // Xử lý đặt địa chỉ mặc định
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await editData(`/api/address/${addressId}/set-default`);

            if (response.error) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: response.notify || response.message || "Có lỗi xảy ra khi đặt địa chỉ mặc định",
                });
                return;
            }

            await fetchAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Có lỗi xảy ra khi đặt địa chỉ mặc định",
            });
        }
    };

    return (
        <div className="checkout-single boxshado-single">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4>Địa chỉ giao hàng</h4>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowAddAddressModal(true)}
                    style={{ backgroundColor: '#28a745' }}
                >
                    Thêm địa chỉ
                </Button>
            </div>

            {/* Danh sách địa chỉ */}
            <RadioGroup value={context.selectedAddressId} onChange={(e) => context.setSelectedAddressId(e.target.value)}>
                {addresses.length > 0 ? (
                    addresses.map((addr) => (
                        <Card key={addr._id} style={{ marginBottom: '10px', border: context.selectedAddressId === addr._id ? '2px solid #007bff' : '1px solid #ddd' }}>
                            <CardContent style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                                        <Radio value={addr._id} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                                {addr.city}
                                                {addr.isDefault && (
                                                    <span style={{ marginLeft: '10px', color: '#28a745', fontSize: '0.8em' }}>
                                                        (Mặc định)
                                                    </span>
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {addr.details}
                                            </Typography>
                                            {addr.moreInfo && (
                                                <Typography variant="body2" color="textSecondary">
                                                    {addr.moreInfo}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {!addr.isDefault && (
                                            <Button
                                                size="small"
                                                onClick={() => handleSetDefaultAddress(addr._id)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Đặt mặc định
                                            </Button>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setEditingAddress(addr);
                                                setShowEditAddressModal(true);
                                            }}
                                            style={{ marginRight: '5px' }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => showDeleteConfirmation(addr._id)}
                                            color="error"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', padding: '20px' }}>
                        Chưa có địa chỉ nào. Vui lòng thêm địa chỉ giao hàng.
                    </Typography>
                )}
            </RadioGroup>

            {/* Modal thêm địa chỉ */}
            <Dialog open={showAddAddressModal} onClose={() => setShowAddAddressModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                <DialogContent>
                    <div style={{ paddingTop: '10px' }}>
                        <TextField
                            fullWidth
                            label="Tỉnh/Thành phố"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Địa chỉ chi tiết"
                            value={newAddress.details}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, details: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Thông tin bổ sung"
                            value={newAddress.moreInfo}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={2}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddAddressModal(false)}>Hủy</Button>
                    <Button onClick={handleAddAddress} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Modal sửa địa chỉ */}
            <Dialog open={showEditAddressModal} onClose={() => setShowEditAddressModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Sửa địa chỉ</DialogTitle>
                <DialogContent>
                    {editingAddress && (
                        <div style={{ paddingTop: '10px' }}>
                            <TextField
                                fullWidth
                                label="Tỉnh/Thành phố"
                                value={editingAddress.city}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, city: e.target.value }))}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Địa chỉ chi tiết"
                                value={editingAddress.details}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, details: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={3}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Thông tin bổ sung"
                                value={editingAddress.moreInfo || ''}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditAddressModal(false)}>Hủy</Button>
                    <Button onClick={handleEditAddress} variant="contained">Cập nhật</Button>
                </DialogActions>
            </Dialog>

            {/* Modal xác nhận xóa địa chỉ */}
            <Dialog open={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowDeleteConfirmModal(false);
                        setDeletingAddressId(null);
                    }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteAddress} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>


    )
}

export default AddressManage