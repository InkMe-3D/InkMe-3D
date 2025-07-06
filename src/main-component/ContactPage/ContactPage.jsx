import React, { Fragment } from 'react';
import NavbarS2 from '../../components/NavbarPages/NavbarS2/NavbarS2';
import PageTitle from '../../components/pagetitle/PageTitle'
import Contactpage from '../../components/ContactPages/Contactpage/Contactpage'
import CtaSectionS2 from '../../components/CtaPages/CtaSectionS2/CtaSectionS2';
import FooterS3 from '../../components/FooterPages/footerS3/FooterS3';


const ContactPage = () => {
    return (
        <Fragment>
            <NavbarS2 hclass={'header-section-2 style-two'} />
            <PageTitle pageTitle={'Liên hệ với chúng tôi'} pagesub={'Liên Hệ'} />
            <Contactpage />
            <CtaSectionS2 />
            <FooterS3 />

        </Fragment>
    )
};
export default ContactPage;

