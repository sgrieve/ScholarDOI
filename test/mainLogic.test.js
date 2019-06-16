const ScholarDOI = require('./mainLogic.js');

function simpleTitle(){
  return 'A simple title';
}

function punctuatedTitle(){
  return 'This, title-has-the !MOST% punctuation?';
}

function numericTitle(){
  return '99 red balloons'
}

function longTitle(){
    return 'This is a very long title that I am writing to test long titles'
}

function matchingShortTitle(){
    return 'This is a very long title'
}

function loadCrossrefJSON(){
  var json = require('./fixtures/crossref.json');
  return json;
}

test.each([
  [simpleTitle(), 'a simple title'],
  [punctuatedTitle(), 'this title has the most punctuation '],
  [numericTitle(), numericTitle()]
  ])(
  'removes punctuation from: %s',
  (title, expected) => {
    expect(ScholarDOI.cleanTitle(title)).toBe(expected);
  },
);

test('checks long first title matches short second title', () => {

  var result = ScholarDOI.titleLengthCompare(longTitle(), matchingShortTitle());
  expect(result).toBe(true);
});

test('checks short first title matches long second title', () => {

  var result = ScholarDOI.titleLengthCompare(matchingShortTitle(), longTitle());
  expect(result).toBe(true);
});

test('checks different titles do not match', () => {

  var result = ScholarDOI.titleLengthCompare(longTitle(), punctuatedTitle());
  expect(result).toBe(false);
});

test('make a hyperlink object', () => {

  var a = ScholarDOI.makeLink();
  expect(a.text()).toBe('Bibtex');
});

test('add a doi to a hyperlink', () => {

  var a = ScholarDOI.buildDOILink('10.1002/esp.3884');
  expect(a[0].href).toBe('https://doi2bib.org/bib/10.1002/esp.3884');
});

test('get doi from crossref query result', () => {

  var doi = ScholarDOI.getDOI(loadCrossrefJSON());
  expect(doi).toBe('10.1002/esp.3884');

});

test('get cleaned title from crossref query result', () => {

  var doi = ScholarDOI.getTitleCrossref(loadCrossrefJSON());
  expect(doi).toBe('how long is a hillslope ');

});
