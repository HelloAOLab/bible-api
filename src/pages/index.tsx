
import { Link } from 'gatsby';
import * as React from 'react';
import Layout from '../components/Layout';

export default function Index() {
    return <Layout>
        <main className="index-container">
            <h1>The Holy Bible</h1>
            <h3>Translations:</h3>
            <ul>
                <li><Link to="/read/BSB/Genesis/1">BSB</Link></li>
                <li><Link to="/read/ENGWEBP/Genesis/1">ENGWEBP</Link></li>
                <li><Link to="/read/ARBNAV/التَّكوين/1">ARBNAV</Link></li>
                <li><Link to="/read/HINIRV/उत्पत्ति/1">HINIRV</Link></li>
                <li><Link to="/read/GRCBRE/ΓΕΝΕΣΙΣ/1">GRCBRE</Link></li>
                <li><Link to="/read/GRCTCG/ΚΑΤΑ_ΜΑΤΘΑΙΟΝ/1">GRCTCG</Link></li>
                <li><Link to="/read/HBOMAS/בְּרֵאשִׁית/1">HBOMAS</Link></li>
            </ul>
            <h3>API</h3>
            <p>Want to make the Bible accessible in your app/website? Use our <a href="/docs">API</a>!</p>
        </main>
    </Layout>
}