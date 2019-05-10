
$( '.gs_ri' ).each(function( index ) {
  
  var paper = $(  this );

  if (paper.children( '.gs_a' ).text().split('-')[1].includes("arXiv")) {
    // Check if it's a arXiv ID first.
    var arxivid = paper.children( '.gs_rt' ).children().first().attr("href").split('/')[4];
    var a = $('<a>Bibtex</a>');
    a.attr("title", 'Bibtex');
    a.attr("href", 'https://doi2bib.org/bib/' + arxivid);
    paper.children('.gs_fl').append(a);

  } else {

    // Parse the DOIs and do a search
    var query = 'https://api.crossref.org/works?rows=1&sort=relevance&query.title=';
    var title = paper.children( '.gs_rt' ).children().last().text().trim();
    var authors = paper.children('.gs_a').text().split('-')[0].split(' ');

    query += title; // Get Title
    query += '&query.author=';
    for (j = 1; j < authors.length; j=j+2) { // Add Authors Last Name
      query += authors[j].trim().replace(/[,….]/g, '');
      if (j < authors.length-2) {
        query += '+'
        if (j%2 == 1){
          query += 'and+'
        }
      }
    }


    query = query.replace(/\s/g, '+'); // Replace Whitespaces by +

    $.ajax({
      url:query,
      async: true,
      dataType: 'json',
      headers: {
          "User-Agent": 'ScholarDOI v0.1 (https://github.com/sgrieve/ScholarDOI; mailto:s@swdg.io)'
      },
      success:function(data){
          var doi = data.message.items[0].DOI;
          var rettitle = data.message.items[0].title[0];

          if (rettitle.toUpperCase() === title.toUpperCase()){ // Check whether the titles match
            var a = $('<a>Bibtex</a>');
            a.attr("title", 'Bibtex');
            a.attr("href", 'https://doi2bib.org/bib/' + doi);
          } else {
            var a = $('<a>No DOI Found</a>');
          }

          paper.children('.gs_fl').append(a);

      }
    });
  }
});
