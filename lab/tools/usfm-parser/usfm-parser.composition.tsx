import React from 'react';
import { usfmParser } from './usfm-parser';

export function ReturnsCorrectValue() {
    return <div>{usfmParser()}</div>;
}
