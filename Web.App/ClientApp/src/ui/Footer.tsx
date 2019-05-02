import * as React from 'react';

interface FooterProps {
}

const Footer: React.FunctionComponent<FooterProps> = () => {
    return (
        <footer>
            <hr />
            <div>
                I'm a footer
            </div>
        </footer>
    );
};

export default Footer;