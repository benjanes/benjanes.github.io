// Google Feed API: https://developers.google.com/feed/
// Inspiration: http://designshack.net/articles/javascript/build-an-automated-rss-feed-list-with-jquery/

function parseFeed(url, container, responses) {
    $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+responses+'&callback=?&q=' + encodeURIComponent(url), // "num=5" will show 5 articles
        dataType: 'json',
        success: function (data) {
            // log object data in console
            //console.log(data.responseData.feed);

            // for each entry... *
            $.each(data.responseData.feed.entries, function (key, value) {

                // * assign entry variables
                var title = '<h4><a href="' + value.link + '" target="_blank">' + value.title + '</a></h4>';

                var content = value.content;
                var descArr = (content.slice(content.indexOf('</p>') + 4, content.lastIndexOf('<p>'))).split('</p>');

                var briefDescArr = descArr[1].split(' ');
                if( briefDescArr.length > 36 ) {
                    while (briefDescArr.length > 36) {
                        briefDescArr.pop();
                    }
                    briefDescArr[36] = '...';
                }
                var briefDesc = briefDescArr.join(' ');
                var links = descArr[0].substring(3);

                var entry = '<article class="col-2-article"><div class="article-contents">' + title + briefDesc + '</p>' + '<div class="proj-links">' + links + '</div>' + '</div></article>';
                // * append entire entry in container
                $(container).append(entry);
            });
        },
        // if there's an error... *
        error: function (errorThrown) {
            // * log error message in console
            console.log(errorThrown);
        }
    });
}

$(document).ready(function () {
    parseFeed('http://codepen.io/benjanes/popular/feed/', '#pop-pens', 2);
    parseFeed('http://codepen.io/benjanes/public/feed/', '#recent-pens', 2);
});
