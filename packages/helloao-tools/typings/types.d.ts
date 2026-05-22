declare module "*.usfm" {
    const content: string;
    export default content;
}

declare module "*.usx" {
    const content: string;
    export default content;
}

declare module "*.codex" {
    const content: string;
    export default content;
}

import 'zod';

declare module 'zod' {
    interface ZodType<Output, Def, Input> {
        meta<M extends Record<string, unknown>>(metadata: M): this;
    }
}