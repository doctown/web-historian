var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  /*
   * Gets a static file request from the hard drive and return the content to the requester
   */
  var sendStaticFileRequest = function(filename, contentType) {
    //Retrieve the  index.html from the filesystem
    fs.readFile(filename, 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        //and return the statuscode 200 in the header
        var headers = helper.headers;
        headers['Content-Type'] = contentType;
        res.writeHead(200, headers);
        res.write(data);
        //if the request is for css file send th css file
        res.end();
      }
    });
  };

  console.log('Server request is ', req.url, ' and  the method is ', req.method);
  //if request.url equals / then return the index.html
  if (req.method === 'GET') {
    if (req.url === '/') {
      sendStaticFileRequest('web/public/index.html', 'text/html');
    } else if (req.url === '/styles.css') { // handle css request
      sendStaticFileRequest('web/public/styles.css', 'text/css');
    } else if (req.url.match(/\/www/)) { // if get request begins with www
      // check to see if file is in the archive
      archive.isUrlArchived(req.url.slice(1), function(exists) {
        if (exists) { // if true
          // call send static file reuest with the file name location
          sendStaticFileRequest(archive.paths.archivedSites + req.url, 'text/html');
        } else { // return a 404
          var headers = helper.headers;
          res.writeHead(404, headers);
          res.end();
        }
      });
    } else {
      var headers = helper.headers;
      res.writeHead(404, headers);
      res.end();
    }
  } else if (req.method === 'POST') {
    // If url is /
    if (req.url === '/') {
      // TODO: Check if a formcheck the type is form,
      // if form
      var result = '';
      // get the data 
      req.on('data', function(chunk) {
        result += chunk.toString();
      });
      req.on('end', function() {
        var url = result.slice(4);
        // Check if result is a url that is archive
        archive.isUrlArchived(url, function(found) {
          //if true
          if (found) {
            // Load the url
            sendStaticFileRequest(archive.paths.archivedSites + '/' + url, 'text/html');
          } else { // else
            // Add to url to sites.txt
            archive.addUrlToList(url, function() {
              // Send status 302
              // TODO: Pass error if error found
              //res.writeHead(302, helper.headers);
              // send the loading page html
              //res.end();
              sendStaticFileRequest('web/public/loading.html', 'text/html');
            });
          }
        });
      });
    }
  }
};

//archive.paths.list
