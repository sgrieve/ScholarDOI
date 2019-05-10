$( '.gs_ri' ).each(function( index ) {

  var paper = $(  this );

  if (paper.children( '.gs_a' ).text().split('-')[1].includes("arXiv")) {
    // Check if it's a arXiv ID first.
    var arxivid = paper.children( '.gs_rt' ).children().first().attr("href").split('abs/')[2];
    var a = $('<a>Bibtex</a>');
    a.attr("title", 'Bibtex');

    // We can use arxiv2bibtex to attaempt to resolve arxiv IDs as doi2bib struggles
    a.attr("href", 'https://arxiv2bibtex.org/?q=' + arxivid + '&outputformat=raw');
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

    // Attaching a User-Agent header throws an unsafe header error on Chrome, so we can
    // provide contact details as specified in the crossref docs as part of the query
    // https://github.com/CrossRef/rest-api-doc#good-manners--more-reliable-service
    query += '&mailto=s@swdg.io';

    $.ajax({
      url:query,
      async: true,
      dataType: 'json',
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
