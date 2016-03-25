// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting

var archive = require('../helpers/archive-helpers');
//Call Readlisturls 
var htmlfetch = function () {
  archive.readListOfUrls(function(urls) {
  //Callback to get a list of archive sites
    urls.filter(function(url) {
      archive.isUrlArchived(url, function(found) {
        if (!found) {
          //Download new urllist
          var arr = [];
          arr.push(url);
          archive.downloadUrls(arr);
        }
      });
    });
  //Loop through list of urls
  //Remove all archived sites
  });
}();

module.exports = htmlfetch;