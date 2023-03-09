/// <reference types="vite/client" />

declare module "*?raw" {
    const str: string;
    export default str;
}

declare module "*.json" {
    const data: any;
    export default data;
}

declare module "*.usfm" {
    const str: string;
    export default str;
}