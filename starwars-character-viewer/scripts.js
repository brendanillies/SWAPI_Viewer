$(document).ready(function () {

    $('button').on('click', function () {
        // Get random character number to fetch
        const randomNumber = Math.floor(Math.random() * 88) + 1;

        // Get character data
        $.get(`https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/id/${randomNumber}.json`, function(data) {

            // Set character name
            $('h1').text(data['name']);

            // Select image node
            const $img = $('img');

            // Attempt to get character image from url and cache attempt
            // If successful, add url to src attribute; else remove src attribute
            $.get({
                url: data['image'],
                cache: true
            })
                .done(function() { 
                    $img.attr('src', data['image']);
                })
                .fail(function() {
                    $img.removeAttr('src');
                })

        });

    })
})