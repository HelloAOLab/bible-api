import * as React from 'react';
import { Link } from 'gatsby';
import '../sakura.css';
import '../extra.css';

type Props = {
    children?: React.ReactNode
};
const Layout = ({ children }: Props) => {
    return <div>
        {children}
    </div>
};

export default Layout;