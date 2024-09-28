import { bookIdMap } from './book-order.js';

describe('bookIdMap', () => {
    it('should have all the books', () => {
        expect(bookIdMap).toMatchSnapshot();
    });
});
