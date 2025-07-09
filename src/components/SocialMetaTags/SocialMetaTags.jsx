import React from 'react';
import { Helmet } from 'react-helmet';

const SocialMetaTags = ({
    title = "InkMe - Dịch vụ in ấn chuyên nghiệp",
    description = "InkMe - Dịch vụ in ấn chuyên nghiệp, tùy chỉnh 3D online. In áo thun, hoodie, túi xách theo yêu cầu với chất lượng cao và giá cả phù hợp.",
    image = "https://res.cloudinary.com/dz1i9npra/image/upload/v1752036274/inkme_thumbnail_fcz9ia.png",
    url = "https://inkme3d.com/",
    type = "website"
}) => {
    const fullImageUrl = image.startsWith('http') ? image : `https://inkme3d.com${image}`;
    const fullUrl = url.startsWith('http') ? url : `https://inkme3d.com${url}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="InkMe" />
            <meta property="og:locale" content="vi_VN" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImageUrl} />

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
        </Helmet>
    );
};

export default SocialMetaTags; 