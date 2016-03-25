// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting

var archive = require('../helpers/archive-helpers');
//Call Readlisturls 
(function () {
  archive.readListOfUrls()
  .then(function(urls) {
  //Callback to get a list of archive sites
    urls.filter(function(url) {
      archive.isUrlArchived(url)
      .then(function(found) {
        if (!found) {
          var urlArray = [];
          urlArray.push(url);
          archive.downloadUrls(urlArray);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
    });
  //Loop through list of urls
  //Remove all archived sites
  })
  .catch(function(err) {
    console.log(err);
  });
}());