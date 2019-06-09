const cleanTitle = require('./mainLogic.js');

test('removes punctuation from a title', () => {

  var cleaned = cleanTitle('This.');

  expect(cleaned).toMatch('this ');
});
