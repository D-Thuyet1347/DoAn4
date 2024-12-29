import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CustomerInfo.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerInfo = () => {
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        country: '',
        avatar: '',
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        country: '',
        avatar: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const [uploading, setUploading] = useState(false);
    const avatarRef = useRef(null);
    const fileInputRef = useRef(null);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const successMessageTimeoutRef = useRef(null);

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error decoding token', e);
            return null;
        }
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            return decodedToken ? decodedToken.id : null;
        }
        return null;
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) {
            setError('User not authenticated.');
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/user/${userId}`);
                if (response.data.success) {
                    setCustomerData(response.data.data);
                    setFormData(response.data.data);
                } else {
                    setError('Failed to fetch user data.');
                    toast.error('Failed to fetch user data.');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching user data.');
                toast.error('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (avatarRef.current && !avatarRef.current.contains(event.target)) {
                setShowAvatarOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [avatarRef]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const handleAvatarUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const url = `http://localhost:4000/api/user/upload-avatar/${userId}`;
            console.log("Upload URL:", url);
            const response = await axios.post(
                url,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (response.data.success) {
                window.location.reload();
            } else {
                setError('Failed to upload avatar.');
                toast.error('Failed to upload avatar.');
            }
        } catch (err) {
            console.error('Error uploading avatar:', err);
            console.error("Response data:", err.response?.data);
            setError('An error occurred while uploading the avatar.');
            toast.error('An error occurred while uploading the avatar.');
        } finally {
            setUploading(false);
            setShowAvatarOptions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        let errorMessage = '';
        const errors = {};

        console.log("formData before trim:", formData);
        const trimmedFirstName = (formData.firstName || "").trim();
        const trimmedLastName = (formData.lastName || "").trim();
        const trimmedAddress = (formData.address || "").trim();
        const trimmedPhone = (formData.phone || "").trim();

        if (!trimmedFirstName) {
            isValid = false;
            errorMessage = 'Please enter your first name.';
        } else if (!trimmedLastName) {
            isValid = false;
            errorMessage = 'Please enter your last name.';
        } else if (!trimmedAddress) {
            isValid = false;
            errorMessage = 'Please enter your address.';
        } else if (!trimmedPhone) {
            isValid = false;
            errorMessage = 'Please enter your phone number.';
        } else {
            const phonePattern = /^[0-9]{10}$/;

            if (!phonePattern.test(trimmedPhone)) {
                errors.phone = 'Phone number must be 10 digits.';
                isValid = false;
                errorMessage = 'Invalid phone number format.';
            }
        }

        setFormErrors(errors);

        if (!trimmedFirstName && !trimmedLastName && !trimmedAddress && !trimmedPhone) {
            toast.error('Please fill in at least one field to update.');
            return;
        }

        if (!isValid) {
            toast.error(errorMessage);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/user/update/${userId}`, {
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                address: trimmedAddress,
                phone: trimmedPhone,
                email: formData.email,
                gender: formData.gender
            });
            if (response.data.success) {
                toast.success('Customer information updated successfully!');
                setCustomerData(prevData => ({
                    ...prevData,
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    address: trimmedAddress,
                    phone: trimmedPhone,
                    gender: formData.gender
                }));
                setFormData(prevData => ({
                    ...prevData,
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    address: trimmedAddress,
                    phone: trimmedPhone,
                    gender: formData.gender
                }));
            } else {
                toast.error('Failed to update customer information.');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred while updating the customer information.');
        }
    };

    const handleAvatarClick = () => {
        setShowAvatarOptions(!showAvatarOptions);
    };

    const handleViewAvatar = () => {
        if (customerData.avatar) {
            window.open(`http://localhost:4000/${customerData.avatar}`, '_blank');
        }
        setShowAvatarOptions(false);
    };

    const handlePasswordChange = async () => {
        setPasswordError('');

        if (!oldPassword.trim()) {
            toast.error('Please enter the old password.');
            return;
        }

        if (!password.trim()) {
            toast.error('Please enter the new password.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('New password does not match.');
            return;
        }

        if (password.length < 6) {
            toast.error('New password must be at least 6 characters.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:4000/api/user/change-password`,
                {
                    oldPassword: oldPassword.trim(),
                    newPassword: password.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Full Response:", response);

            if (response.data.success) {
                toast.success('Password changed successfully!');
                setOldPassword('');
                setPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
                setPasswordError('');
            } else {
                console.error('Password change failed:', response.data.message || 'An error occurred while changing the password.');
                toast.error(response.data.message || 'An error occurred while changing the password.');
            }
        } catch (error) {
            console.error("Error changing password:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                toast.error(error.response.data.message || 'An error occurred while changing the password.');
            } else {
                toast.error('An error occurred while changing the password.');
            }
        }
    };

    const handleTogglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
        setPasswordError('');
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setShowAvatarOptions(false);
    };

    if (loading) {
        return <p>Loading user data...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="customer-info">
            <ToastContainer />
            <div className="avatar-section">
                <div className="avatar-container" ref={avatarRef}>
                    <img
                        src={customerData.avatar ? `http://localhost:4000/${customerData.avatar}` : 'https://via.placeholder.com/150'}
                        alt="Avatar"
                        className="avatar"
                        onClick={handleAvatarClick}
                    />
                    {showAvatarOptions && (
                        <div className="avatar-options">
                            <button onClick={handleViewAvatar}>View Avatar</button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                                ref={fileInputRef}
                            />
                            <button onClick={handleAvatarUploadClick} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Choose New Avatar'}
                            </button>
                            <button onClick={() => { handleTogglePasswordForm(); setShowAvatarOptions(false); }}>{showPasswordForm ? 'Change Password' : 'Change Password'}</button>
                        </div>
                    )}
                </div>
                <div className="info-labels">
                    <p><strong>Email:</strong> {customerData.email}</p>
                    {customerData.firstName && customerData.lastName && (
                        <p><strong>Full Name:</strong> {customerData.firstName} {customerData.lastName}</p>
                    )}
                    <p><strong>Phone:</strong> {customerData.phone}</p>
                    <p><strong>Address:</strong> {customerData.address}</p>
                </div>
            </div>
            {showPasswordForm && (
                <div className="password-form">
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <div className='password-buttons'>
                        <button onClick={handlePasswordChange}>Update Password</button>
                        <button onClick={handleTogglePasswordForm}>Cancel</button>
                    </div>
                </div>
            )}
            <div className="info-section">
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            disabled={true}
                            autoComplete="off"
                        />
                    </label>
                    <label>
                        Phone:
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            title="Phone number must be 10 digits"
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Gender:
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};

export default CustomerInfo;