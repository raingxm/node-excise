var express = require('express');
var eventproxy = require('eventproxy');
var superagent = require('superagent-charset');
var cheerio = require('cheerio');

var dangdangUrl = "book.dangdang.com";
var ep = new eventproxy();
var app = new express();

app.get('/', function(request, response) {
    superagent.get(dangdangUrl).charset('gbk').end(function(err, sres) {
        if(err) {
            next(err);
        }

        var detailUrls = [];
        var items = [];
        var $ = cheerio.load(sres.text);
        $('.product_ul li .name a').each(function(index, element) {
            var $element = $(element);
            var detailUrl = $element.attr('href');
            detailUrls.push(detailUrl);
        });

        $('.product_ul li').each(function(index, element) {
            var $element = $(element);
            var name = $element.find('.name a').text();
            var author = $element.find('.author').text();
            var price = parseInt($element.find('.price .rob .num').text());
            items.push({name: name,
                author: author,
                price: price
            });
        });

        detailUrls.forEach(function(detailUrl) {
            superagent.get(detailUrl).charset('gbk').end(function(err, sres) {
                if(err) {
                    console.error(err);
                }
                ep.emit('fetch_description', [detailUrl, sres]);
            });
        });

        ep.after('fetch_description', detailUrls.length, function(details) {
            var describes = [];
            var booksInfo = [];
            describes = details.map(function(eachDetail) {
                var detailUrl = eachDetail[0];
                var content = eachDetail[1];
                var $ = cheerio.load(content.text);
                return {
                    url: detailUrl,
                    describe: $(".show_info_autoheight .head_title_name").text()
                };
            });
            describes.forEach(function(ele, index) {
                booksInfo.push({
                    name: items[index].name,
                    author: items[index].author,
                    price: items[index].price,
                    describe: ele.describe
                });
            });
            response.send(booksInfo);
        });

    });
});

app.listen(3000, function() {
    console.log("listen on port 3000......");
});
