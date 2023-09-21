$(document).ready(function () {

    $('button').on('click', function () {
        const randomNumber = Math.floor(Math.random() * 88) + 1;

        $.get(`https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/id/${randomNumber}.json`, function(data) {

            $('h1').text(data['name']);

            const $img = $('img');

            $.get({
                url: data['image'],
                cache: true
            })
                .done(function() { 
                    $img.attr('src', data['image']);
                })
                .fail(function() {
                    $img.removeAttr('src');
                    $img.attr('alt', 'Failed to load image');
                })

        });

    })
})