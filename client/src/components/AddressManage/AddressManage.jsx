import React, { useState, useEffect, useCallback } from 'react'
import { Edit, Delete, Add } from '@mui/icons-material';
import { postData, editData, deleteData, fetchDataFromApi } from '../../utils/api';
import PayOSPayment from '../Payment/PayOSPayment';
import { Link } from 'react-router-dom';
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Card, CardContent, Typography, Box, Radio, RadioGroup, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
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
        province: '',
        district: '',
        ward: '',
        provinceName: '',
        districtName: '',
        wardName: '',
        details: '',
        moreInfo: ''
    });

    // State for address data from API
    const [addressData, setAddressData] = useState({
        provinces: [],
        districts: [],
        wards: []
    });

    // Loading states for address API calls
    const [addressLoading, setAddressLoading] = useState({
        provinces: false,
        districts: false,
        wards: false
    });

    // Fetch provinces, districts, wards from API
    const fetchProvinces = async () => {
        setAddressLoading(prev => ({ ...prev, provinces: true }));
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setAddressData(prev => ({ ...prev, provinces: data }));
        } catch (error) {
            console.error('Error fetching provinces:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Không thể tải dữ liệu tỉnh/thành phố",
            });
        } finally {
            setAddressLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const fetchDistricts = async (provinceCode) => {
        setAddressLoading(prev => ({ ...prev, districts: true }));
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setAddressData(prev => ({ ...prev, districts: data.districts || [] }));
        } catch (error) {
            console.error('Error fetching districts:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Không thể tải dữ liệu quận/huyện",
            });
        } finally {
            setAddressLoading(prev => ({ ...prev, districts: false }));
        }
    };

    const fetchWards = async (districtCode) => {
        setAddressLoading(prev => ({ ...prev, wards: true }));
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setAddressData(prev => ({ ...prev, wards: data.wards || [] }));
        } catch (error) {
            console.error('Error fetching wards:', error);
            context.setAlterBox({
                open: true,
                error: true,
                message: "Không thể tải dữ liệu phường/xã",
            });
        } finally {
            setAddressLoading(prev => ({ ...prev, wards: false }));
        }
    };

    const fetchAddresses = useCallback(async () => {
        try {
            const response = await fetchDataFromApi(`/api/address/user/${user?.userId}`);
            setAddresses(response);
            // Set selected address to default address if exists
            const defaultAddress = response.find(addr => addr.isDefault);
            if (defaultAddress) {
                context.setSelectedAddressId(defaultAddress._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }, [user?.userId, context]);

    // Fetch addresses when component mounts
    useEffect(() => {
        if (user?.userId) {
            fetchAddresses();
        }
    }, [user?.userId, fetchAddresses]);

    // Fetch provinces when component mounts
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Helper function to reset address form
    const resetAddressForm = () => {
        setNewAddress({
            province: '',
            district: '',
            ward: '',
            provinceName: '',
            districtName: '',
            wardName: '',
            details: '',
            moreInfo: ''
        });
        setAddressData(prev => ({
            ...prev,
            districts: [],
            wards: []
        }));
    };

    // Helper function to reset edit form
    const resetEditForm = () => {
        setEditingAddress(null);
        setAddressData(prev => ({
            ...prev,
            districts: [],
            wards: []
        }));
    };

    // Handle province change for new address
    const handleProvinceChange = (value, isEditing = false) => {
        const selectedProvince = addressData.provinces.find(p => p.code === value);

        if (isEditing) {
            setEditingAddress(prev => ({
                ...prev,
                province: value,
                provinceName: selectedProvince?.name || '',
                district: '',
                districtName: '',
                ward: '',
                wardName: ''
            }));
        } else {
            setNewAddress(prev => ({
                ...prev,
                province: value,
                provinceName: selectedProvince?.name || '',
                district: '',
                districtName: '',
                ward: '',
                wardName: ''
            }));
        }

        // Clear districts and wards
        setAddressData(prev => ({
            ...prev,
            districts: [],
            wards: []
        }));

        // Fetch districts for selected province
        if (value) {
            fetchDistricts(value);
        }
    };

    // Handle district change
    const handleDistrictChange = (value, isEditing = false) => {
        const selectedDistrict = addressData.districts.find(d => d.code === value);

        if (isEditing) {
            setEditingAddress(prev => ({
                ...prev,
                district: value,
                districtName: selectedDistrict?.name || '',
                ward: '',
                wardName: ''
            }));
        } else {
            setNewAddress(prev => ({
                ...prev,
                district: value,
                districtName: selectedDistrict?.name || '',
                ward: '',
                wardName: ''
            }));
        }

        // Clear wards
        setAddressData(prev => ({
            ...prev,
            wards: []
        }));

        // Fetch wards for selected district
        if (value) {
            fetchWards(value);
        }
    };

    // Handle ward change
    const handleWardChange = (value, isEditing = false) => {
        const selectedWard = addressData.wards.find(w => w.code === value);

        if (isEditing) {
            setEditingAddress(prev => ({
                ...prev,
                ward: value,
                wardName: selectedWard?.name || ''
            }));
        } else {
            setNewAddress(prev => ({
                ...prev,
                ward: value,
                wardName: selectedWard?.name || ''
            }));
        }
    };

    // Xử lý thêm địa chỉ mới
    const handleAddAddress = async () => {
        try {
            if (!newAddress.province || !newAddress.district || !newAddress.ward || !newAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Vui lòng điền đầy đủ thông tin địa chỉ",
                });
                return;
            }

            // Create full address string
            const fullAddress = `${newAddress.wardName}, ${newAddress.districtName}, ${newAddress.provinceName}`;

            const response = await postData(`/api/address`, {
                userId: user.userId,
                province: newAddress.province,
                provinceName: newAddress.provinceName,
                district: newAddress.district,
                districtName: newAddress.districtName,
                ward: newAddress.ward,
                wardName: newAddress.wardName,
                city: fullAddress, // For backward compatibility
                details: newAddress.details,
                moreInfo: newAddress.moreInfo
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
            setShowAddAddressModal(false);
            resetAddressForm();
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
            if (!editingAddress.province || !editingAddress.district || !editingAddress.ward || !editingAddress.details) {
                context.setAlterBox({
                    open: true,
                    error: true,
                    message: "Vui lòng điền đầy đủ thông tin địa chỉ",
                });
                return;
            }

            // Create full address string
            const fullAddress = `${editingAddress.wardName}, ${editingAddress.districtName}, ${editingAddress.provinceName}`;

            const response = await editData(`/api/address/${editingAddress._id}`, {
                province: editingAddress.province,
                provinceName: editingAddress.provinceName,
                district: editingAddress.district,
                districtName: editingAddress.districtName,
                ward: editingAddress.ward,
                wardName: editingAddress.wardName,
                city: fullAddress, // For backward compatibility
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
            resetEditForm();
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
                                                {addr.provinceName && addr.districtName && addr.wardName
                                                    ? `${addr.wardName}, ${addr.districtName}, ${addr.provinceName}`
                                                    : addr.city}
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
                                                // Load districts and wards if address has province and district
                                                if (addr.province) {
                                                    fetchDistricts(addr.province);
                                                    if (addr.district) {
                                                        fetchWards(addr.district);
                                                    }
                                                }
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
                        {/* Province Selection */}
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Tỉnh/Thành phố</InputLabel>
                            <Select
                                value={newAddress.province}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                label="Tỉnh/Thành phố"
                                disabled={addressLoading.provinces}
                            >
                                {addressLoading.provinces ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} style={{ marginRight: 10 }} />
                                        Đang tải...
                                    </MenuItem>
                                ) : (
                                    addressData.provinces.map((province) => (
                                        <MenuItem key={province.code} value={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* District Selection */}
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Quận/Huyện</InputLabel>
                            <Select
                                value={newAddress.district}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                label="Quận/Huyện"
                                disabled={!newAddress.province || addressLoading.districts}
                            >
                                {addressLoading.districts ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} style={{ marginRight: 10 }} />
                                        Đang tải...
                                    </MenuItem>
                                ) : (
                                    addressData.districts.map((district) => (
                                        <MenuItem key={district.code} value={district.code}>
                                            {district.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        {/* Ward Selection */}
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Phường/Xã</InputLabel>
                            <Select
                                value={newAddress.ward}
                                onChange={(e) => handleWardChange(e.target.value)}
                                label="Phường/Xã"
                                disabled={!newAddress.district || addressLoading.wards}
                            >
                                {addressLoading.wards ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} style={{ marginRight: 10 }} />
                                        Đang tải...
                                    </MenuItem>
                                ) : (
                                    addressData.wards.map((ward) => (
                                        <MenuItem key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Địa chỉ chi tiết"
                            value={newAddress.details}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, details: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={3}
                            required
                            placeholder="Số nhà, tên đường..."
                        />
                        <TextField
                            fullWidth
                            label="Thông tin bổ sung"
                            value={newAddress.moreInfo}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                            margin="normal"
                            multiline
                            rows={2}
                            placeholder="Ghi chú thêm (tùy chọn)"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowAddAddressModal(false);
                        resetAddressForm();
                    }}>Hủy</Button>
                    <Button onClick={handleAddAddress} variant="contained">Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Modal sửa địa chỉ */}
            <Dialog open={showEditAddressModal} onClose={() => setShowEditAddressModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Sửa địa chỉ</DialogTitle>
                <DialogContent>
                    {editingAddress && (
                        <div style={{ paddingTop: '10px' }}>
                            {/* Province Selection */}
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Tỉnh/Thành phố</InputLabel>
                                <Select
                                    value={editingAddress.province || ''}
                                    onChange={(e) => handleProvinceChange(e.target.value, true)}
                                    label="Tỉnh/Thành phố"
                                    disabled={addressLoading.provinces}
                                >
                                    {addressLoading.provinces ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} style={{ marginRight: 10 }} />
                                            Đang tải...
                                        </MenuItem>
                                    ) : (
                                        addressData.provinces.map((province) => (
                                            <MenuItem key={province.code} value={province.code}>
                                                {province.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            {/* District Selection */}
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Quận/Huyện</InputLabel>
                                <Select
                                    value={editingAddress.district || ''}
                                    onChange={(e) => handleDistrictChange(e.target.value, true)}
                                    label="Quận/Huyện"
                                    disabled={!editingAddress.province || addressLoading.districts}
                                >
                                    {addressLoading.districts ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} style={{ marginRight: 10 }} />
                                            Đang tải...
                                        </MenuItem>
                                    ) : (
                                        addressData.districts.map((district) => (
                                            <MenuItem key={district.code} value={district.code}>
                                                {district.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            {/* Ward Selection */}
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Phường/Xã</InputLabel>
                                <Select
                                    value={editingAddress.ward || ''}
                                    onChange={(e) => handleWardChange(e.target.value, true)}
                                    label="Phường/Xã"
                                    disabled={!editingAddress.district || addressLoading.wards}
                                >
                                    {addressLoading.wards ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20} style={{ marginRight: 10 }} />
                                            Đang tải...
                                        </MenuItem>
                                    ) : (
                                        addressData.wards.map((ward) => (
                                            <MenuItem key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Địa chỉ chi tiết"
                                value={editingAddress.details}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, details: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={3}
                                required
                                placeholder="Số nhà, tên đường..."
                            />
                            <TextField
                                fullWidth
                                label="Thông tin bổ sung"
                                value={editingAddress.moreInfo || ''}
                                onChange={(e) => setEditingAddress(prev => ({ ...prev, moreInfo: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={2}
                                placeholder="Ghi chú thêm (tùy chọn)"
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowEditAddressModal(false);
                        resetEditForm();
                    }}>Hủy</Button>
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