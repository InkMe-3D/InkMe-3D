import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs, Checkbox, Chip, emphasize, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, OutlinedInput, styled, TextField, Typography, Box, Container, Paper } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from "@mui/material/Rating";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegImages } from "react-icons/fa6";
import { deleteData, deleteImages, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

//breadcrumb



const ProductUpload = () => {

    const [loading, setLoading] = useState(false);

    const [productWeight, setProductWeight] = useState('');
    const [productSize, setProductSize] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [rating, setRating] = useState('');
    const [color, setColor] = useState([]);
    const [category, setCategory] = useState('');
    const [discount, setDiscount] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');



    const [hover, setHover] = useState(false);

    const navigate = useNavigate();
    const context = useContext(MyContext);

    // Ensure catData is accessed correctly



    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...imageUrls]);
    };


   
        // Prepare form data
        let formData = {
            name:name,
            description:description,
            brand:brand,
            price: parseFloat(price),
            oldPrice: parseFloat(oldPrice),
            discount: parseInt(discount),
            category:category,
            countInStock: parseInt(countInStock),
            rating: parseFloat(rating),
            productSize:productSize,
            color:color,
            quantitySold: 0,
            productWeight: parseFloat(productWeight),
            images: images
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await postData(`/api/products/create`, formData);
                console.log(formData);
                alert('Product created successfully!');
            } catch (error) {
                console.error('Failed to update product:', error);
                alert('Failed to update product. Please try again.');
            }
        };

        // Send data to API
       

    const addNewSize = () => {
        if (newSize && !productSize.includes(newSize)) {
            setProductSize([...productSize, newSize]);
            setNewSize('');
        }
    };

    const addNewColor = () => {
        if (newColor && !color.includes(newColor)) {
            setColor([...color, newColor]);
            setNewColor('');
        }
    };

    // Add consistent styling to form sections
    

    // Update the styling for the image upload section
    const imageUploadStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
        border: '2px dashed #007bff',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const imageUploadHoverStyle = {
        backgroundColor: '#e0f0ff',
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: '50px', marginTop: '20px', borderRadius: '10px' }}>
                <Typography variant="h5" gutterBottom>
                    Thêm sản phẩm
                </Typography>
                <form className="form" onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <Typography variant="h6">Thông tin cơ bản</Typography>
                        <TextField fullWidth label="Tên sản phẩm" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
                        <TextField fullWidth label="Thương hiệu" value={brand} onChange={(e) => setBrand(e.target.value)} margin="normal" />
                        <TextField fullWidth label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" multiline rows={4} />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Thông tin giá cả</Typography>
                        <TextField fullWidth type="number" label="Giá bán" value={price} onChange={(e) => setPrice(e.target.value)} margin="normal" />
                        <TextField fullWidth type="number" label="Giá cũ" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} margin="normal" />
                        <TextField fullWidth type="number" label="Giảm giá (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} margin="normal" />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Danh Mục</Typography>
                        <FormControl fullWidth margin="normal">
                            <Select value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>-- Chọn danh mục --</em></MenuItem>
                                {context.catData?.categoryList?.map((cat, index) => (
                                    <MenuItem key={index} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Kích thước và Màu sắc</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" fullWidth margin="normal">
                                    <FormLabel component="legend">Kích thước</FormLabel>
                                    <FormGroup>
                                        {productSize?.map(existingSize => (
                                            <FormControlLabel
                                                key={existingSize}
                                                control={
                                                    <Checkbox
                                                        checked={true}
                                                        onChange={(e) => {
                                                            const newSizes = e.target.checked
                                                                ? [...productSize]
                                                                : productSize.filter(s => s !== existingSize);
                                                            setProductSize(newSizes);
                                                        }}
                                                        name={existingSize}
                                                    />
                                                }
                                                label={existingSize}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Thêm kích thước mới"
                                    variant="outlined"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                    margin="normal"
                                />
                                <Button onClick={addNewSize} variant="contained" color="primary" sx={{ marginTop: '10px' }}>Thêm kích thước</Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" fullWidth margin="normal">
                                    <FormLabel component="legend">Màu sắc</FormLabel>
                                    <FormGroup>
                                        {color?.map(existingColor => (
                                            <FormControlLabel
                                                key={existingColor}
                                                control={
                                                    <Checkbox
                                                        checked={true}
                                                        onChange={(e) => {
                                                            const newColors = e.target.checked
                                                                ? [...color]
                                                                : color.filter(c => c !== existingColor);
                                                            setColor(newColors);
                                                        }}
                                                        name={existingColor}
                                                    />
                                                }
                                                label={existingColor}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Thêm màu mới"
                                    variant="outlined"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    margin="normal"
                                />
                                <Button onClick={addNewColor} variant="contained" color="primary" sx={{ marginTop: '10px' }}>Thêm màu</Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Đánh giá</Typography>
                        <Rating
                            name="product-rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Trọng lượng và Số lượng trong kho</Typography>
                        <TextField fullWidth type="number" label="Trọng lượng sản phẩm" value={productWeight} onChange={(e) => setProductWeight(e.target.value)} margin="normal" />
                        <TextField fullWidth type="number" label="Số lượng trong kho" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} margin="normal" />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Thêm ảnh sản phẩm</Typography>
                        <div className="imgUploadBox" style={hover ? {...imageUploadStyle, ...imageUploadHoverStyle} : imageUploadStyle}>
                            <input type="file" multiple name="images" onChange={handleImageChange} className="form-control-file" style={{ display: 'none' }} id="imageUploadInput" />
                            <label htmlFor="imageUploadInput" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <FaRegImages size={40} color="#007bff" />
                                <Typography variant="body1" style={{ marginLeft: '10px', color: '#007bff' }}>Thêm ảnh</Typography>
                            </label>
                        </div>
                        <div className="selected-images">
                            {images.map((image, index) => (
                                <img
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                    key={index}
                                    src={image}
                                    alt={`Selected ${index}`}
                                    className="selected-image"
                                />
                            ))}
                        </div>
                    </Box>

                    <Box display="flex" justifyContent="center">
                        <Button type="submit" variant="contained" color="primary" startIcon={<FaCloudUploadAlt />} size="large" style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',

                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}>
                            Đăng bán sản phẩm
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

export default ProductUpload;