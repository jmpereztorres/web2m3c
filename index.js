const cheerio = require('cheerio')
const rp = require('request-promise');

const urlParams = '/ace/manifest.m3u8?id=';
acestreamHostStreamUrl = undefined;
const html = 'https://acelisting.in/';

exports.fetchMatches = (req, res) => {

  let options = {
    method: 'GET',
    json: true,
    uri: html,
    insecure: true
  };

  if (req != undefined && req.body != undefined && req.body.localIp != undefined) {
    acestreamHostStreamUrl = req.body.localIp + urlParams;
  }

  rp(options)
    .then(function (html) {
      response = [];
      const $ = cheerio.load(html);
      rows = $('table.table.table-striped.table-bordered.table-condensed > tbody > tr', html);

      for (index of Object.keys(rows).filter(isInteger)) {
        tr = rows[index];
        const $ = cheerio.load(tr);

        // It's the date header
        if (tr.attribs.class == 'success') {
          continue;
          // It's a match
        } else {
          response.push(parseHtmlRowToJson($, tr));
        }

      }

      if (req != undefined && req.body != undefined && req.body.filter != undefined) {
        response = response.filter(node => filterResults(node, req.body.filter));
      }

      res.status(200).send(response);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });

};

function filterResults(json, body) {

  if (body.time != undefined && json.time != body.time) {
    return false;
  }

  if (body.date != undefined && json.date != body.date) {
    return false;
  }

  if (body.sport != undefined && json.sport != undefined && !json.sport.toUpperCase().includes(body.sport.toUpperCase())) {
    return false;
  }

  if (body.match != undefined && json.match != undefined && !json.match.toUpperCase().includes(body.match.toUpperCase())) {
    return false;
  }

  if (body.league != undefined && json.league != undefined && !json.league.toUpperCase().includes(body.league.toUpperCase())) {
    return false;
  }

  return true;
}

function isInteger(string) {
  return string.match(/^-{0,1}\d+$/);
}

function parseHtmlRowToJson($, tr) {
  res = {
    links: [],
    time: $('td', tr).get(1).children[0].data.trim(),
    date: $('td', tr).get(2).children[0].data.trim(),
    sport: $('td', tr).get(3).children[0].data.trim(),
    match: $('td', tr).get(5).children[0].data.trim(),
    league: $('td', tr).get(6).children[0].data.trim()
  };

  linksHtml = $('td > a', tr);

  for (i = 0; i < linksHtml.length; i++) {
    link = {
      name: linksHtml.get(i).children[0].data.trim(),
      url: linksHtml.get(i).attribs.href.trim()
    };

    if (acestreamHostStreamUrl != undefined) {
      link.url = link.url.replace('acestream://', acestreamHostStreamUrl);
    }

    res.links.push(link);
  }

  return res;
}