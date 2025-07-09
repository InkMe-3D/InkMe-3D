import React, { useState, useContext } from 'react'
import { MyContext } from '../../../context/MyContext';
import { TextField, Button } from '@mui/material';
import { editData } from '../../../utils/api';

const UserInfoCheckout = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        note: user?.note || ''
    });
    const [error, setError] = useState('');

    const context = useContext(MyContext);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedUser({
            name: user?.name || '',
            phone: user?.phone || '',
            email: user?.email || '',
            note: user?.note || ''
        });
    };

    const handleInputChange = (field) => async (event) => {
        const value = event.target.value;
        setEditedUser((prev) => ({
            ...prev,
            [field]: value
        }));
        // Nếu là note thì tự động lưu vào localStorage và gọi API
        if (field === 'note') {
            const updatedUser = { ...user, note: value };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            // Gọi API cập nhật note cho user
            try {
                await editData(`/api/user/${user?.userId}`, { note: value });
            } catch (err) {
                // Không cần báo lỗi, chỉ log
                console.error('Lỗi khi cập nhật note:', err);
            }
        }
    };

    const handleEditUser = async () => {
        try {
            const response = await editData(`/api/user/${user?.userId}`, editedUser);
            if (response.error) {
                setError(response.message);
                return;
            }

            if (editedUser.name === '') {
                setError('Họ và tên không được để trống');
                return;
            }

            if (editedUser.phone === '' || editedUser.phone.length !== 10) {
                setError('Số điện thoại không được để trống và phải có 10 chữ số');
                return;
            }

            if (editedUser.email === '' || !editedUser.email.includes('@')) {
                setError('Email không được để trống');
                return;
            }

            // Update local storage with new user data
            const updatedUser = { ...user, ...editedUser };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            setError('');
            context.setAlterBox({
                open: true,
                error: false,
                message: "Cập nhật thông tin thành công!",
            });
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật thông tin');
            context.setAlterBox({
                open: true,
                error: true,
                message: "Có lỗi xảy ra khi cập nhật thông tin",
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
    };

    return (
        <div className="checkout-single boxshado-single">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Thông tin cá nhân</h4>
                {!isEditing ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleEditClick}
                        style={{ marginBottom: '15px' }}
                    >
                        Chỉnh sửa
                    </Button>
                ) : (
                    <div style={{ marginBottom: '15px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditUser}
                            style={{ marginRight: '10px' }}
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                    </div>
                )}
            </div>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            <div className="checkout-single-form">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <TextField
                            fullWidth
                            className='checkout-input'
                            label="Họ và tên"
                            value={isEditing ? editedUser.name : (user?.name || '')}
                            variant="outlined"
                            onChange={handleInputChange('name')}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-lg-4">
                        <TextField
                            fullWidth
                            className='checkout-input'
                            label="Số điện thoại"
                            value={isEditing ? editedUser.phone : (user?.phone || '')}
                            variant="outlined"
                            onChange={handleInputChange('phone')}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-lg-4">
                        <TextField
                            fullWidth
                            type="email"
                            className='checkout-input'
                            label="Email"
                            value={isEditing ? editedUser.email : (user?.email || '')}
                            variant="outlined"
                            onChange={handleInputChange('email')}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-lg-12">
                        <TextField
                            fullWidth
                            className='checkout-input'
                            label="Ghi chú"
                            value={editedUser.note}
                            variant="outlined"
                            onChange={handleInputChange('note')}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoCheckout