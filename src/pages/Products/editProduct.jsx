import React, { useEffect, useState } from "react";
import { Breadcrumbs, Chip, emphasize, styled, TextField, FormControl, InputLabel, Select, MenuItem, Button, Grid, Typography, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { editData, fetchDataFromApi } from "../../utils/api";

// Styled breadcrumb component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800];

    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

// Form section styling
const formSectionStyle = {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '16px',
};

const EditProduct = () => {
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const { id } = useParams();

    // Fetch product details
    const fetchProduct = async () => {
        try {
            const response = await fetchDataFromApi(`/api/products/${id}`);
            setProduct(response);
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetchDataFromApi('/api/category');
            setCategories(response.categoryList);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editData(`/api/products/${id}`, product);
            alert('Product updated successfully!');
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Failed to update product. Please try again.');
        }
    };

    // Add new color
    const addNewColor = () => {
        if (newColor && !product.color.includes(newColor)) {
            setProduct({ ...product, color: [...product.color, newColor] });
            setNewColor('');
        }
    };

    // Add new size
    const addNewSize = () => {
        if (newSize && !product.productSize.includes(newSize)) {
            setProduct({ ...product, productSize: [...product.productSize, newSize] });
            setNewSize('');
        }
    };

    // Handle image change
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prevImages => [...prevImages, ...imageUrls]);
        setProduct(prevProduct => ({ ...prevProduct, images: [...prevProduct.images, ...imageUrls] }));
    };

    // Delete an existing image
    const deleteImage = (index) => {
        const updatedImages = product.images.filter((_, i) => i !== index);
        setProduct({ ...product, images: updatedImages });
    };

    // Update an existing image
    const updateImage = (index, newImage) => {
        const updatedImages = [...product.images];
        updatedImages[index] = newImage;
        setProduct({ ...product, images: updatedImages });
    };

    return (
        <div className="edit-product-container">
            <div className="card shadow border-0 w-100 flex-row p-4">
                <Typography variant="h5" component="h1" className="mb-0">Chỉnh sửa sản phẩm</Typography>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb component="a" href="#" label="Trang chủ" icon={<HomeIcon fontSize="small" />} />
                    <StyledBreadcrumb label="Sản phẩm" component="a" href="#" />
                    <StyledBreadcrumb label="Chỉnh sửa sản phẩm" />
                </Breadcrumbs>
            </div>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-section" style={formSectionStyle}>
                    <Typography variant="h6" className="section-title">Thông tin cơ bản</Typography>
                    <TextField
                        label="Tên sản phẩm"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.name || ''}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                    <TextField
                        label="Mô tả"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={product.description || ''}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                </div>

                <div className="form-section" style={formSectionStyle}>
                    <Typography variant="h6" className="section-title">Thông tin giá cả</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giá bán"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={product.price || ''}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giá cũ"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={product.oldPrice || ''}
                                onChange={(e) => setProduct({ ...product, oldPrice: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </div>

                <div className="form-section" style={formSectionStyle}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Danh Mục</InputLabel>
                                <Select
                                    value={product.category?.id || ''}
                                    onChange={(e) => setProduct({ ...product, category: categories.find(cat => cat.id === e.target.value) })}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>-- Chọn danh mục --</em></MenuItem>
                                    {categories.map(category => (
                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số lượng"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={product.countInStock || ''}
                                onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" fullWidth margin="normal">
                                <FormLabel component="legend">Kích thước</FormLabel>
                                <FormGroup>
                                    {product.productSize?.map(existingSize => (
                                        <FormControlLabel
                                            key={existingSize}
                                            control={
                                                <Checkbox
                                                    checked={true}
                                                    onChange={(e) => {
                                                        const newSizes = e.target.checked
                                                            ? [...product.productSize]
                                                            : product.productSize.filter(s => s !== existingSize);
                                                        setProduct({ ...product, productSize: newSizes });
                                                    }}
                                                    name={existingSize}
                                                />
                                            }
                                            label={existingSize}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <FormControl fullWidth margin="normal" sx={{ maxWidth: '300px', margin: '0 auto' }}>
                                <TextField
                                    label="Thêm kích thước mới"
                                    variant="outlined"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                />
                                <Button onClick={addNewSize} variant="contained" color="primary" sx={{ marginTop: '10px' }}>Thêm kích thước</Button>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" fullWidth margin="normal">
                                <FormLabel component="legend">Màu sắc</FormLabel>
                                <FormGroup>
                                    {product.color?.map(existingColor => (
                                        <FormControlLabel
                                            key={existingColor}
                                            control={
                                                <Checkbox
                                                    checked={true}
                                                    onChange={(e) => {
                                                        const newColors = e.target.checked
                                                            ? [...product.color]
                                                            : product.color.filter(c => c !== existingColor);
                                                        setProduct({ ...product, color: newColors });
                                                    }}
                                                    name={existingColor}
                                                />
                                            }
                                            label={existingColor}
                                        />
                                    ))}
                                </FormGroup>

                            </FormControl>
                            <FormControl fullWidth margin="normal" sx={{ maxWidth: '300px', margin: '0 auto' }}>
                                <TextField
                                    label="Thêm màu mới"
                                    variant="outlined"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                />
                                <Button onClick={addNewColor} variant="contained" color="primary" sx={{ marginTop: '10px' }}>Thêm màu</Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Trọng lượng sản phẩm"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={product.productWeight || ''}
                                onChange={(e) => setProduct({ ...product, productWeight: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Giảm giá"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                value={product.discount || ''}
                                onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </div>

                <div className="imageUploadSec">
                    <Typography variant="h6" className="mb-4">Thêm ảnh sản phẩm</Typography>
                    <div className="existing-images">
                        {product.images?.map((image, index) => (
                            <div key={index} className="image-container">
                                <img
                                    src={image}
                                    width={100}
                                    height={100}
                                    
                                    alt={`Existing ${index}`}
                                    className="selected-image"
                                />
                                <Button
                                    onClick={() => deleteImage(index)}
                                    variant="contained"
                                    color="error"
                                    size="medium"
                                    sx={{
                                        margin: '5px',
                                        boxShadow: 2,
                                        '&:hover': {
                                            backgroundColor: 'error.dark',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    component="label"
                                    sx={{
                                        margin: '5px',
                                        boxShadow: 2,
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    Update
                                    <input
                                        type="file"
                                        hidden
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const newImage = URL.createObjectURL(file);
                                                updateImage(index, newImage);
                                            }
                                        }}
                                    />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="imgUploadBox d-flex align-items-center">
                        <input type="file" multiple name="images" onChange={handleImageChange} className="form-control-file" />
                        <div className="info">
                            <FaRegImages />
                            <Typography variant="body1">Thêm ảnh</Typography>
                        </div>
                    </div>
                   
                    <div className="selected-images">
                        {selectedImages.map((image, index) => (
                            <img
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }}
                                key={index}
                                src={image}
                                width={100}
                                height={100}

                                
                                alt={`Selected ${index}`}
                                className="selected-image"
                                
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        startIcon={<FaCloudUploadAlt />}
                        size="large"
                        sx={{
                            padding: '10px 20px',
                            boxShadow: 3,
                            marginBottom: '50px',
                            '&:hover': {
                                backgroundColor: 'success.dark',
                                boxShadow: 6,
                            },
                        }}
                    >
                        Cập nhật sản phẩm
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;


