$( '.gs_ri' ).each(function( index ) {

  var paper = $(  this );

  if (paper.children( '.gs_a' ).text().split('-')[1].includes("arXiv")) {
    // Check if it's an arXiv ID first.
    var arxivid = paper.children( '.gs_rt' ).children().first().attr("href").split('abs/')[1];
    var a = $('<a>Bibtex</a>');
    a.attr("title", 'Bibtex');

    // We can use arxiv2bibtex to attempt to resolve arxiv IDs as doi2bib struggles
    a.attr("href", 'https://arxiv2bibtex.org/?q=' + arxivid + '&outputformat=raw');
    paper.children('.gs_fl').append(a);

  } else {

    // Parse the DOIs and do a search
    var query = 'https://api.crossref.org/works?rows=1&sort=relevance&query.bibliographic=';
    var title = paper.children( '.gs_rt' ).children().last().text().trim();
    var authors = paper.children('.gs_a').text().split('-')[0].split(' ');

    query += encodeURIComponent(title); // Get Title
    query += '&query.author=';
    for (j = 1; j < authors.length; j=j+2) { // Add Authors Last Name
      query += encodeURIComponent(authors[j].trim().replace(/[,….]/g, ''));
      if (j < authors.length-2) {
        query += '+'
        if (j%2 == 1){
          query += 'and+'
        }
      }
    }

    // Attaching a User-Agent header throws an unsafe header error on Chrome, so we can
    // provide contact details as specified in the crossref docs as part of the query
    // https://github.com/CrossRef/rest-api-doc#good-manners--more-reliable-service
    query += '&mailto=' + encodeURIComponent('s@swdg.io');

    $.ajax({
      url:query,
      async: true,
      dataType: 'json',
      success:function(data){
          var doi = data.message.items[0].DOI;
          var rettitle = cleanTitle(data.message.items[0].title[0]);
          title = cleanTitle(title);

          if (rettitle === title){ // Check whether the cleaned titles match
            var a = $('<a>Bibtex</a>');
            a.attr("title", 'Bibtex');
            
            a.attr("href", 'https://www.doi2bib.org/bib/' + doi);

          } else if (titleLengthCompare(rettitle, title)) {  //check for match on titles of different lengths

            var a = $('<a>Bibtex</a>');
            a.attr("title", 'Bibtex');
            
            a.attr("href", 'https://www.doi2bib.org/bib/' + doi);

          } else {
            var a = $('<a>No DOI Found</a>');
          }

          paper.children('.gs_fl').append(a);

      }
    });
  }
});

function cleanTitle(title) {
  // Strips everything apart from letters, numbers and spaces from a title
  return title.toLowerCase().replace(/[^a-z0-9]+/gi, ' ');
}

function titleLengthCompare(title1, title2){
  // In cases where we have long titles, google scholar truncates them.
  // This function compares the truncated title with a similar truncation of
  // the title from crossref. Returns true for a match and false otherwise.
  var short = title1;
  var long = title2

  // We can't know which of the args will be the longest, so sort them here
  if (title1.length > title2.length){
    short = title2;
    long = title1;
  }

  // Getting rid of trailing empty strings using filter
  var shortArray = short.split(' ').filter(Boolean);
  var longArray = long.split(' ').filter(Boolean);

  longArray = longArray.slice(0, shortArray.length)

  if (longArray.join(' ') === shortArray.join(' ')){
    return true;
  }

  return false;
}
