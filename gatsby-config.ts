import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: "AO Lab",
    },
    plugins: [
        // 'gatsby-transformer-json',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: './build/api/'
            }
        }
    ],
}

export default config;