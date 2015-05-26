var express = require('express');
var eventproxy = require('eventproxy');
var superagent = require('superagent-charset');
var cheerio = require('cheerio');

var amazonUrl = "book.dangdang.com";
var ep = new eventproxy();
var app = new express();

app.get('/', function(request, response) {
    superagent.get(amazonUrl).charset('gbk').end(function(err, res) {
        if(err) {
            next(err);
        }

        var items = [];
        var $ = cheerio.load(res.text);
        $('.product_ul li').each(function(index, element) {
            var $element = $(element);
            var name = $element.find('.name a').text();
            items.push({name: name});
        });

        response.send(items);
    });
});

app.listen(3000, function() {
    console.log("listen on port 3000......");
});
