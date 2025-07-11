import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs, Chip, emphasize, OutlinedInput, styled } from "@mui/material"
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
    };
}


const ProductUpload = () => {

    const [categoryValue, setCategoryValue] = useState('');
    const [subCategoryValue, setSubCategoryValue] = useState('');
    const [ratingsValue, setRatingsValue] = React.useState(0);
    const [isFeaturedValue, setisFeaturedValue] = React.useState(true);

    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [productWeight, setProductWeight] = useState('');
    const [productSize, setProductSize] = useState([]);
    const [productColor, setProductColor] = useState([]);
    const [productSizeData, setProductSizeData] = useState([]);
    const [productColorData, setProductColorData] = useState([]);

    // State cho input tạm thời
    const [newSizeInput, setNewSizeInput] = useState('');
    const [newColorInput, setNewColorInput] = useState('');

    // Product Classifications
    const [productClassify, setProductClassify] = useState([]);

    const history = useNavigate();
    const context = useContext(MyContext);
    const formdata = new FormData();

    const [disable, setDisable] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState([]);

    const [formFields, setformFields] = useState({
        name: "",
        description: "",
        images: [],
        brand: "",
        price: 0,
        originalPrice: 0,
        discountPercent: 0,
        oldPrice: null, // Giữ lại cho tương thích
        discount: null, // Giữ lại cho tương thích
        category: "",
        catName: "",
        subCatId: "",
        subCat: "",
        countInStock: null,
        rating: 0,
        productSize: [],
        productColor: [],
        productWeight: "",
        productClassify: [],
        isFeatured: true
    });

    const handleChangeCategory = (event) => {
        setCategoryValue(event.target.value);
        setformFields(() => ({
            ...formFields,
            category: event.target.value
        }));
    };

    const handleChangeSubCategory = (event) => {
        setSubCategoryValue(event.target.value);
        setformFields(() => ({
            ...formFields,
            subCat: event.target.value
        }));

        formFields.subCatId = event.target.value;

    };

    const handleChangeProductSize = (event) => {
        const {
            target: { value },
        } = event;
        setProductSize(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        // Cập nhật formFields với mảng productSize mới
        setformFields((prevFields) => ({
            ...prevFields,
            productSize: typeof value === 'string' ? value.split(',') : value,
        }));

    };

    const handleChangeProductColor = (event) => {
        const {
            target: { value },
        } = event;
        setProductColor(
            typeof value === 'string' ? value.split(',') : value,
        );

        setformFields((prevFields) => ({
            ...prevFields,
            productColor: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleChangeisFeaturedValue = (event) => {
        setisFeaturedValue(event.target.value);
        setformFields(() => ({
            ...formFields,
            isFeatured: event.target.value
        }));
    };

    // Xử lý Product Classify
    const addProductClassify = () => {
        const newClassify = {
            name: "",
            image: "",
            quantity: 0,
            price: 0
        };
        setProductClassify([...productClassify, newClassify]);
        setformFields(prev => ({
            ...prev,
            productClassify: [...prev.productClassify, newClassify]
        }));
    };

    const removeProductClassify = (index) => {
        const updatedClassify = productClassify.filter((_, i) => i !== index);
        setProductClassify(updatedClassify);
        setformFields(prev => ({
            ...prev,
            productClassify: updatedClassify
        }));
    };

    const updateProductClassify = (index, field, value) => {
        const updatedClassify = [...productClassify];
        updatedClassify[index] = { ...updatedClassify[index], [field]: value };
        setProductClassify(updatedClassify);
        setformFields(prev => ({
            ...prev,
            productClassify: updatedClassify
        }));
    };

    // Hàm xử lý kích thước
    const addProductSize = () => {
        if (newSizeInput.trim() && !productSize.includes(newSizeInput.trim())) {
            const updatedSizes = [...productSize, newSizeInput.trim()];
            setProductSize(updatedSizes);
            setformFields(prev => ({
                ...prev,
                productSize: updatedSizes
            }));
            setNewSizeInput('');
        }
    };

    const removeProductSize = (indexToRemove) => {
        const updatedSizes = productSize.filter((_, index) => index !== indexToRemove);
        setProductSize(updatedSizes);
        setformFields(prev => ({
            ...prev,
            productSize: updatedSizes
        }));
    };

    // Hàm xử lý màu sắc
    const addProductColor = () => {
        if (newColorInput.trim() && !productColor.includes(newColorInput.trim())) {
            const updatedColors = [...productColor, newColorInput.trim()];
            setProductColor(updatedColors);
            setformFields(prev => ({
                ...prev,
                productColor: updatedColors
            }));
            setNewColorInput('');
        }
    };

    const removeProductColor = (indexToRemove) => {
        const updatedColors = productColor.filter((_, index) => index !== indexToRemove);
        setProductColor(updatedColors);
        setformFields(prev => ({
            ...prev,
            productColor: updatedColors
        }));
    };

    // Hàm xử lý phím Enter
    const handleSizeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addProductSize();
        }
    };

    const handleColorKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addProductColor();
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setCatData(context.catData);
        setSubCatData(context.subCatData);

        fetchDataFromApi("/api/imageUpload/").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    })
                })
            })
        }).catch((error) => {
            console.error("Error fetching image upload data:", error);
        });

        fetchDataFromApi("/api/productSize/").then((res) => {
            setProductSizeData(res);
        }).catch((error) => {
            console.error("Error fetching product size data:", error);
            setProductSizeData([]);
        });

        // Giả sử có API cho productColor, nếu không có thì dùng dữ liệu mặc định
        const defaultColors = [
            { productColor: "Đỏ" },
            { productColor: "Xanh" },
            { productColor: "Vàng" },
            { productColor: "Đen" },
            { productColor: "Trắng" },
            { productColor: "Xám" },
            { productColor: "Nâu" },
            { productColor: "Hồng" }
        ];
        setProductColorData(defaultColors);

    }, []);

    const inputChange = (e) => {
        setformFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    }

    // Hàm tính toán giá tự động (price luôn được nhập thủ công)
    const calculatePricing = (changedField, value, currentFields) => {
        const numValue = parseFloat(value) || 0;
        const updatedFields = { ...currentFields };

        switch (changedField) {
            case 'price':
                updatedFields.price = numValue;
                // Khi thay đổi price, tính originalPrice hoặc discountPercent
                if (updatedFields.discountPercent > 0 && numValue > 0) {
                    // Nếu có % giảm giá, tính giá gốc
                    updatedFields.originalPrice = (numValue / (1 - updatedFields.discountPercent / 100)).toFixed(2);
                }
                else if (updatedFields.originalPrice > 0 && numValue > 0) {
                    // Nếu có giá gốc, tính % giảm giá
                    updatedFields.discountPercent = (((updatedFields.originalPrice - numValue) / updatedFields.originalPrice) * 100).toFixed(2);
                }
                break;

            case 'originalPrice':
                updatedFields.originalPrice = numValue;
                // Chỉ tính discountPercent, KHÔNG tính price
                if (updatedFields.price > 0 && numValue > 0) {
                    updatedFields.discountPercent = (((numValue - updatedFields.price) / numValue) * 100).toFixed(2);
                }
                break;

            case 'discountPercent':
                updatedFields.discountPercent = numValue;
                // Chỉ tính originalPrice, KHÔNG tính price
                if (updatedFields.price > 0 && numValue >= 0) {
                    updatedFields.originalPrice = (updatedFields.price / (1 - numValue / 100)).toFixed(2);
                }
                break;

            default:
                break;
        }

        return updatedFields;
    };

    // Hàm xử lý thay đổi giá bán
    const handlePriceChange = (e) => {
        const value = e.target.value;
        const updatedFields = calculatePricing('price', value, formFields);
        setformFields(updatedFields);
    };

    // Hàm xử lý thay đổi giá gốc
    const handleOriginalPriceChange = (e) => {
        const value = e.target.value;
        const updatedFields = calculatePricing('originalPrice', value, formFields);
        setformFields(updatedFields);
    };

    // Hàm xử lý thay đổi phần trăm giảm giá
    const handleDiscountPercentChange = (e) => {
        const value = e.target.value;
        const updatedFields = calculatePricing('discountPercent', value, formFields);
        setformFields(updatedFields);
    };

    const selectCat = (cat) => {
        setformFields((prev) => ({
            ...prev,
            catName: cat
        }));
    };




    const removeImg = async (index, imgUrl) => {
        const imgIndex = preview.indexOf(imgUrl);

        deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
            context.setAlterBox({
                open: true,
                error: false,
                message: "Xóa hình ảnh thành công"
            })
        })

        if (imgIndex > -1) {
            preview.splice(index, 1);
        }
    }

    let img_arr = [];
    let uniqueArray = [];

    const onChangeFile = async (e, apiEndPoint) => {
        try {

            const files = e.target.files;

            setUploading(true);

            for (var i = 0; i < files.length; i++) {

                // validate file type
                if (files[i] && (files[i].type === 'image/jpeg' ||
                    files[i].type === 'image/png' ||
                    files[i].type === 'image/gif' ||
                    files[i].type === 'image/jpg' ||
                    files[i].type === 'image/webp')) {

                    const file = files[i];
                    formdata.append(`images`, file);

                } else {
                    context.setAlterBox({
                        open: true,
                        color: true,
                        message: "Vui lòng chọn hình ảnh đúng định dạng (jpeg, png, gif, jpg, webp)"
                    });
                    return false;
                }
            }

        } catch (error) {
            console.log(error);
        }

        postData(apiEndPoint, formdata).then((res) => {

            fetchDataFromApi("/api/imageUpload").then((response) => {
                if (response !== undefined && response !== null && response !== "" && response.length !== 0) {

                    response.length !== 0 && response.map((item) => {
                        item?.images.length !== 0 && item?.images?.map((img) => {
                            img_arr.push(img);

                        })
                    })

                    const uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);

                    const appendedArray = [...preview, ...uniqueArray];

                    setPreview(appendedArray);
                    setTimeout(() => {
                        setUploading(false);
                        img_arr = [];
                        context.setAlterBox({
                            open: true,
                            error: false,
                            message: "Thêm hình ảnh thành công"
                        })
                    }, 200);
                }
            });

        });

    }

    const addProduct = (e) => {
        e.preventDefault();
        setLoading(true);

        const appendedArray = [...preview, ...uniqueArray];

        img_arr = [];

        formdata.append('name', formFields.name);
        formdata.append('description', formFields.description);
        formdata.append('brand', formFields.brand);
        formdata.append('price', formFields.price);
        // Gửi dữ liệu mới
        formdata.append('originalPrice', formFields.originalPrice || formFields.price);
        formdata.append('discountPercent', formFields.discountPercent || 0);
        // Tương thích ngược với API cũ
        formdata.append('oldPrice', formFields.originalPrice || formFields.price);
        formdata.append('discount', formFields.discountPercent || 0);
        formdata.append('countInStock', formFields.countInStock);
        formdata.append('catName', formFields.catName);
        formdata.append('subCatId', formFields.subCatId);
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);
        formdata.append('rating', formFields.rating);
        formdata.append('isFeatured', formFields.isFeatured);
        formdata.append('productSize', formFields.productSize);
        formdata.append('productColor', formFields.productColor);
        formdata.append('productWeight', formFields.productWeight);
        formdata.append('productClassify', JSON.stringify(formFields.productClassify));

        formFields.images = appendedArray;

        // -------------- if ermpty
        if (formFields.name === "") {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Vui lòng nhập tên sản phẩm"
            });
            setLoading(false);
            return false;
        }

        if (formFields.description === "") {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Vui lòng nhập mô tả sản phẩm"
            });
            setLoading(false);
            return false;
        }

        if (formFields.category === "") {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Vui lòng chọn danh mục sản phẩm"
            });
            setLoading(false);
            return false;
        }

        if (!formFields.price || formFields.price <= 0) {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Vui lòng nhập giá bán hợp lệ (lớn hơn 0)"
            });
            setLoading(false);
            return false;
        }

        // Validation cho originalPrice - chỉ kiểm tra nếu có giá trị
        if (formFields.originalPrice && formFields.originalPrice < formFields.price) {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Giá gốc phải lớn hơn hoặc bằng giá bán hiện tại"
            });
            setLoading(false);
            return false;
        }

        // Validation cho discountPercent
        if (formFields.discountPercent && (formFields.discountPercent < 0 || formFields.discountPercent > 100)) {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Phần trăm giảm giá phải từ 0 đến 100"
            });
            setLoading(false);
            return false;
        }

        if (formFields.countInStock === null || formFields.countInStock <= 0 || !/^\d+(\.\d+)?$/.test(formFields.countInStock)) {
            context.setAlterBox({
                open: true,
                error: true,
                message: "Vui lòng nhập số lượng sản phẩm"
            });
            setLoading(false);
            return false;
        }

        //--------------  if empty

        postData('/api/products/create', formFields).then((res) => {

            context.setAlterBox({
                open: true,
                error: false,
                message: "Đăng bán sản phẩm thành công"
            });

            deleteData('/api/imageUpload/deleteAllImages');
            setLoading(false);

            history('/products');
        })
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Thêm sản phẩm</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Trang chủ"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            label="Sản phẩm"
                            component="a"
                            href="#"
                        />
                        <StyledBreadcrumb
                            label="Thêm sản phẩm"
                        />
                    </Breadcrumbs>
                </div>

                <form className="form" onSubmit={addProduct}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card shadow border-0 p-4 mt-0">
                                <h5 className="mb-4">Thông tin cơ bản</h5>

                                <div className="form-group">
                                    <h6>Tên sản phẩm</h6>
                                    <input type="text"
                                        name="name" value={formFields.name} onChange={inputChange} />
                                </div>

                                <div className="form-group">
                                    <h6>Mô tả</h6>
                                    <textarea row={5} col={10}
                                        name="description" value={formFields.description} onChange={inputChange} />
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Danh mục</h6>
                                            <Select
                                                value={formFields.category}
                                                onChange={(e) => {
                                                    const selectedCategory = context.catData?.categoryList?.find(cat => cat.id === e.target.value);
                                                    setformFields(prev => ({
                                                        ...prev,
                                                        category: e.target.value,
                                                        catName: selectedCategory?.name || ""
                                                    }));
                                                }}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className="w-100"
                                            >
                                                <MenuItem value="">
                                                    <em value={null}> -- Chọn danh mục --</em>
                                                </MenuItem>

                                                {context.catData?.categoryList?.map((cat, index) => (
                                                    <MenuItem key={index} value={cat.id}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                        </div>
                                    </div>

                                    {/* <div className="col">
                                        <div className="form-group">
                                            <h6>Danh Mục Con</h6>
                                            <Select
                                                value={subCategoryValue}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className="w-100"
                                            >
                                                <MenuItem value="">
                                                    <em value={null}> -- Chọn danh mục con --</em>
                                                </MenuItem>

                                                {
                                                    context.subCatData?.subCategoryList?.length !== 0 &&
                                                    context.subCatData?.subCategoryList?.map((subCat, index) => {
                                                        return (
                                                            <MenuItem className="text-capitalize"
                                                                value={subCat.id} key={index}>{subCat.subCat}
                                                            </MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Giá bán hiện tại (VNĐ) <span className="text-primary">*</span></h6>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formFields.price || ''}
                                                onChange={handlePriceChange}
                                                placeholder="Nhập giá bán chính thức"
                                                min="0"
                                                step="1000"
                                                className="form-control"
                                                style={{ borderColor: '#007bff', borderWidth: '2px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col">``
                                        <div className="form-group">
                                            <h6>Giá gốc (VNĐ) </h6>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={formFields.originalPrice || ''}
                                                onChange={handleOriginalPriceChange}
                                                placeholder="Tự động tính hoặc nhập thủ công"
                                                min="0"
                                                step="1000"
                                                className="form-control"
                                                style={{ backgroundColor: '#f8fff8' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Giảm giá (%) </h6>
                                            <input
                                                type="number"
                                                name="discountPercent"
                                                value={formFields.discountPercent || ''}
                                                onChange={handleDiscountPercentChange}
                                                placeholder="Tự động tính hoặc nhập thủ công"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="form-control"
                                                style={{ backgroundColor: '#f8fff8' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Đăng bán</h6>
                                            <Select
                                                value={isFeaturedValue}
                                                onChange={handleChangeisFeaturedValue}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className="w-100"
                                            >
                                                <MenuItem className="text-capitalize" selected value={true}>Đăng</MenuItem>
                                                <MenuItem className="text-capitalize" value={false}>Lưu bản nháp</MenuItem>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Số lượng</h6>
                                            <input type="text"
                                                name="countInStock" value={formFields.countInStock} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Thương hiệu</h6>
                                            <input type="text"
                                                name="brand" value={formFields.brand || "InkMe3D"} onChange={inputChange} />
                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Kích thước</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newSizeInput}
                                                    onChange={(e) => setNewSizeInput(e.target.value)}
                                                    onKeyPress={handleSizeKeyPress}
                                                    placeholder="Nhập kích thước (VD: S, M, L, XL)"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addProductSize}
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    + Thêm size
                                                </Button>
                                            </div>
                                            {/* Hiển thị danh sách kích thước */}
                                            <div className="d-flex flex-wrap gap-2">
                                                {productSize.map((size, index) => (
                                                    <div key={index} className="badge bg-primary d-flex align-items-center gap-1" style={{ fontSize: '12px', padding: '5px 8px' }}>
                                                        {size}
                                                        <span
                                                            className="cursor-pointer text-white"
                                                            onClick={() => removeProductSize(index)}
                                                            style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                        >
                                                            ×
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Màu sắc</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newColorInput}
                                                    onChange={(e) => setNewColorInput(e.target.value)}
                                                    onKeyPress={handleColorKeyPress}
                                                    placeholder="Nhập màu sắc (VD: Đỏ, Xanh, Vàng)"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addProductColor}
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    + Thêm màu
                                                </Button>
                                            </div>
                                            {/* Hiển thị danh sách màu sắc */}
                                            <div className="d-flex flex-wrap gap-2">
                                                {productColor.map((color, index) => (
                                                    <div key={index} className="badge bg-success d-flex align-items-center gap-1" style={{ fontSize: '12px', padding: '5px 8px' }}>
                                                        {color}
                                                        <span
                                                            className="cursor-pointer text-white"
                                                            onClick={() => removeProductColor(index)}
                                                            style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                        >
                                                            ×
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Cân Nặng (g)</h6>
                                            <input type="text"
                                                name="productWeight" value={formFields.productWeight} onChange={inputChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>Đánh giá</h6>
                                            <Rating
                                                name="simple-controlled"
                                                value={ratingsValue}
                                                onChange={(event, newValue) => {
                                                    setRatingsValue(newValue);
                                                    setformFields(() => ({
                                                        ...formFields,
                                                        rating: newValue

                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Product Classify Section */}
                                <div className="form-group">
                                    <h6>Phân loại sản phẩm</h6>
                                    <div className="mb-3">
                                        <Button type="button" onClick={addProductClassify} variant="outlined" size="small">
                                            + Thêm phân loại
                                        </Button>
                                    </div>
                                    {productClassify.map((classify, index) => (
                                        <div key={index} className="border p-3 mb-3 rounded">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Tên phân loại</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={classify.name}
                                                            onChange={(e) => updateProductClassify(index, 'name', e.target.value)}
                                                            placeholder="VD: Áo thun nam size M"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label>Số lượng</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={classify.quantity}
                                                            onChange={(e) => updateProductClassify(index, 'quantity', parseInt(e.target.value) || 0)}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label>Giá</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={classify.price}
                                                            onChange={(e) => updateProductClassify(index, 'price', parseInt(e.target.value) || 0)}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>URL hình ảnh</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={classify.image}
                                                            onChange={(e) => updateProductClassify(index, 'image', e.target.value)}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-2 d-flex align-items-end">
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeProductClassify(index)}
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        className="mb-3"
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div >

                        <div className="col-md-12">
                            <div className="card shadow border p-4 mt-0">
                                <div className="imageUploadSec">
                                    <h5 className="mb-4">Thêm ảnh sản phẩm</h5>
                                    <div className="imgUploadBox d-flex align-items-center">
                                        {
                                            preview?.length !== 0 && preview?.map((img, index) => {
                                                return (
                                                    <div className="uploadBox" key={index}>
                                                        <span className="remove" onClick={() => removeImg(index, img)}><IoCloseSharp /></span>
                                                        <div className="box">
                                                            <LazyLoadImage
                                                                alt="image"
                                                                effect="blur"
                                                                className="w-100"
                                                                src={img}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="uploadBox">
                                            {
                                                uploading === true ?
                                                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                        <CircularProgress color='inherit'
                                                            className='loader ml-2' />
                                                        <p>Uploading...</p>

                                                    </div>
                                                    :
                                                    <>
                                                        <input type="file" multiple name="images"
                                                            onChange={(e) => onChangeFile(e, `/api/products/upload`)} />
                                                        <div className="info">
                                                            <FaRegImages />
                                                            <h5>Thêm ảnh</h5>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <br />

                                <Button type="submit" className="btn-blue btn-lg btn-big">
                                    <FaCloudUploadAlt /> &nbsp;
                                    {loading === true ? <CircularProgress color='inherit'
                                        className='loader ml-2' /> : 'Đăng bán'}
                                </Button>
                            </div>


                        </div>

                    </div>

                </form >

            </div >
        </>
    )
}

export default ProductUpload;