var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(request, response) {
    superagent.get('https://cnodejs.org/')
        .end(function(err, sres) {
            if(err) {
                return next(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .topic_title').each(function(index, element) {
                var $element = $(element);
                var author = $element.closest('.cell').find('.user_avatar img').eq(0).attr('title');
                items.push({
                    title: $element.attr('title'),
                    href: $element.attr('href'),
                    author: author
                });
            });
            response.send(items);
        });
});

app.listen(3000, function() {
    console.log('listen on port 3000...');
});