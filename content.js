
var query_array = [];

var paper = document.getElementsByClassName('gs_ri');

for (var i = 0, l = paper.length; i < l; i++) {
  var cur_paper = paper[i];
  var query = 'https://api.crossref.org/works?rows=5&query.title='

  var title = cur_paper.getElementsByClassName('gs_rt')[0].getElementsByTagName('a')[0].text;

  query += title;
  query += '&query.author=';

  var authors = cur_paper.getElementsByClassName('gs_a')[0].getElementsByTagName('a');

  // Handles case where authors do not have GS pages, and so their names are not
  // stored in hyperlinks
  if (authors.length < 1){
    var tmp_str = cur_paper.getElementsByClassName('gs_a')[0].innerHTML;
    tmp_str = tmp_str.split('&nbsp;')[0];
    tmp_str = tmp_str.replace(/,/g, '');
    query += tmp_str;
  }
  else{
    // Case where authors have GS pages and we need to get their names from the
    // text of hyperlinks
    for (var j = 0, l2 = authors.length; j < l2; j++) {

      query += authors[j].text;
      query = query.replace(/ /g, '+');
    }
  }

  query_array.push(query);

}
var counter = 0;
getData(query_array, counter, paper);

function getData(query_array, counter, paper) {

  $.ajax({
      url:query_array[counter],
      async: true,
      dataType: 'json',
      headers: {
          "User-Agent": 'ScholarDOI v0.1 (https://github.com/sgrieve/ScholarDOI; mailto:s@swdg.io)'
      },
      success:function(data){
          var doi = data.message.items[0].DOI;

          var footer = paper[counter].getElementsByClassName('gs_fl')[0]

          var a = document.createElement('a');
          var linkText = document.createTextNode('Bibtex');
          a.appendChild(linkText);
          a.title = 'Bibtex';
          a.href = 'http://doi2bib.org/bib/' + doi;
          footer.appendChild(a);

          counter++;
          if (counter < query_array.length) getData(query_array, counter, paper);
      }
    });
 }
