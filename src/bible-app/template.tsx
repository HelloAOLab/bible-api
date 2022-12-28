import * as React from 'react';

export const Template: React.FC<React.ReactNode> = ({children}) => {
    return <>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="./src/sakura.css" type="text/css">
            <link rel="stylesheet" href="./src/extra.css" type="text/css">
            <link rel="stylesheet" href="./node_modules/highlight.js/styles/default.css" type="text/css">
            {/* <title></title> */}
        </head>
        <body>
            {children}
        </body>
        </html>
    </>
};