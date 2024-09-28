import { bookIdMap } from "./book-order";

describe('bookIdMap', () => {
    it('should have all the books', () => {
        expect(bookIdMap).toMatchSnapshot();
    });
});