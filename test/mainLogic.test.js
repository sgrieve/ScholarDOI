const ScholarDOI = require('./mainLogic.js');

test('removes punctuation from a title', () => {

  var cleaned = ScholarDOI.cleanTitle('This.');

  expect(cleaned).toMatch('this ');
});

test('checks two titles that match but have different lengths', () => {

  var result = ScholarDOI.titleLengthCompare('This is the first title', 'This is the first title but it has more words');

  expect(result).toBe(true);
});

test('checks different titles do not match', () => {

  var result = ScholarDOI.titleLengthCompare('This is the first title', 'This is the second title');

  expect(result).toBe(false);
});
