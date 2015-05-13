var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');

var url = require('url');
var cnodeUrl = "http://cnodejs.org/";
var ep = new eventproxy();

superagent.get(cnodeUrl).end(function(err, res) {
    if(err) {
        console.error(err);
    }

    var topicUrls = [];
    var $ = cheerio.load(res.text);
    $('#topic_list .topic_title').each(function(index, element) {
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });

    ep.after('fetch_topic', topicUrls.length, function(topics){
        topics = topics.map(function(topicPair) {
            var topic_url= topicPair[0];
            var topic_content = topicPair[1];
            var $ = cheerio.load(topic_content);
            return {
                title: $('.topic_full_title').text().trim(),
                href: topic_url,
                comment1: $('#reply1 .reply_content p').text().trim()
            }
        });
        console.log(topics);
    });


    topicUrls.forEach(function(topicUrl) {
        superagent.get(topicUrl).end(function(err, res) {
            if(err) {
                console.error(err);
            }

            ep.emit('fetch_topic', [topicUrl, res.text]);
        });
    });
});

