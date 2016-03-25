var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var http = require('http');
var helper = require('../web/http-helpers');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

/* 
 * Gets the list of urls from the sites.txt file.
 * @returns an object with the urls that are in the list.
 */
exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
      if (err) {
        reject(err);
      }
      // Read the sites in to an array
      var urls = data.split('\n');
      //Call allback with sites array
      resolve(urls);
    });
  });
};

/*
 * Determines if a url is in the site list.
 * @param: url - url address to check to see if it is in the sites.txt list
 * @returns true if it is in the list, false otherwise
 */
exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    if (typeof url !== 'string' || url === '') {
      reject(new Error('Empty string passed'));
    }
    var found = false;
    exports.readListOfUrls()
    .then(function(urls) {
      if (urls.indexOf(url) !== -1) {
        found = true;
      }
      resolve(found);
    })
    .catch(function(err) {
      console.log(err);
    });
  });
};

/*
 * Add a url to the sites.txt list.
 * @param - url address of website to add to the sites file
 */
exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.isUrlInList(url)
    .then(function(found) {
      if (!found) {
        fs.appendFile(exports.paths.list, url + '\n', function(err) { // Append the list with this site
          //Write object to the file
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  });

};

/*
 * Determines if the url is saved as a file in the sites folder
 * @param: url - the url to check if is in the sites folder
 * @returns true if the url is archived, false otherwise
 */
exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, files) {
      if (err) {
        reject(err);
      } else {
        var isFound = files.indexOf(url) !== -1;
        resolve(isFound);
      }
    });
  });
};

/* 
 * Downloads the html page of the urls in the list that are not already archived.
 * @param: urls - An Array of urls
 */
exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    if (url === '') {
      return;
    }
    fullUrl = 'http://' + url.toString();
    request({
      url: fullUrl,
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }, function(err, res, data) {
      var filename = exports.paths.archivedSites + '/' + url;
      fs.writeFile(filename, data, function(err) {
        if (err) {
          throw new Error(err);
          callback(err);
        } 
      });
    });
  });
};
