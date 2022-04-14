//console.clear();
var refer = document.referrer.pathname;
    if (refer != "oboabo.forumforever.com") {
        document.location = "//google.fr";
    }

//scorll element
function scrollToMiddle() {
    var container = $('#ypt_thumbs');
    var element = $('.ypt-now-playing');

    container.animate({
        scrollTop: container.scrollTop = container.scrollTop() + element.offset().top - container.offset().top
    }, {
        duration: 1000,
        specialEasing: {
            width: 'linear',
            height: 'easeOutBounce'
        },
        complete: function(e) {
            console.log("animation completed");
        }
    });
}

$('i').click(function() {
    var range, selection;

    if (window.getSelection && document.createRange) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents($(this)[0]);
        selection.removeAllRanges();
        selection.addRange(range);
        $('#pl').val(selection);
        $(this).mouseout(function() {
            selection.removeAllRanges()
        });
    } else if (document.selection && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText($(this)[0]);
        range.select();
        $('#pl').val(range);
    }
});

<!-- DEBUT TITLE -->

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var rand = ["grow", "swing", "slide", "fall"];

var exect = 0,
    consturl,
    shuff = 0,
    player, //The Youtube API player
    ypt_player = document.getElementById('pl'),
    playlistID = "PLrktm-9QRD5yHRwdSB-gC_Gk3jDbznKak",
    key = "AIzaSyBXsppk-k6zftvbnFcqRKHJNxd4kfTFQbs",
    URL = 'https://www.googleapis.com/youtube/v3/playlistItems',
    ypt_thumbs = document.getElementById('ypt_thumbs'),
    nowPlaying = "ypt-now-playing", //For marking the current thumb
    nowPlayingClass = "." + nowPlaying,
    ypt_index = 0; //Playlists begin at the first video by default

function fnre_init() {
    $('#Shuffle').addClass("disabled");
    exect++;

    var options = {
        part: 'snippet',
        key: key,
        maxResults: 50,
        playlistId: playlistID
    }

    loadVids();

    function loadVids(video_list, opt) {
        $.getJSON(URL, options, function() {
                console.log("success");
            })
            .done(function(data) {
                console.log("success");
                $('#ypt_thumbs').html("");
                var id = data.items[0].snippet.resourceId.videoId;
                buildJSON(data, video_list, playlistID);
            })
            .fail(function() {
                console.log("error");
                alert("Votre playlist est erronée!");
                return false;
            })
    }

    function buildJSON(response, list, playlistID) {
        var results = response; //Parse it
        if (!list) {
            list = [];
        } //If there is no list to add to, make one
        list.push.apply(list, results.items); //Add JSON data to the list			
        if (results.nextPageToken) { //If the results included a page token
            var nextPageToken = results.nextPageToken;
            options = {
                part: 'snippet',
                key: key,
                maxResults: 50,
                pageToken: nextPageToken,
                playlistId: playlistID
            }
            loadVids(list, options); //Create another data API request including the current list and page token
        } else { //If there is not a next-page token
            buildHTML(list, playlistID); //Send the JSON data to buildHTML
        }
    }

    function buildHTML(data, playlistID) { //Turns JSON data into HTML elements
        var avtbt = '<button class="mytp-button" title="Lire"><svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path  class="mytppath" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg></button>',
            j = 0;
        $.each(data, function(i) {
            var item = data[i].snippet;
            var desc = item.description.substring(0, 300);
            var title = item.title;
            if (desc != "This video is unavailable." && title != "Private video" && title != "Deleted video") {
                        var thumb = item.thumbnails.medium.url;
                        var title = item.title;
                        var vid = item.resourceId.videoId;
                        $('#ypt_thumbs').append(`
							<li data-ypt-index="${j}" data-key="${vid}">
							${avtbt}
							<p>${title}</p>
							    <span>
								<img src="${thumb}" alt="${title}"/>
								</span>
							</li>
						`);
                        if (desc != "") {
                            $(`[data-ypt-index=${j}]`).tooltipster({
                                animation: rand[getRandomInt(4)],
                                arrow: true,
                                speed: 300,
                                delay: 700,
                                onlyOne: true,
                                content: $(`<span style="display:table;text-align:center;"><strong>${desc}</strong></span>`)
                            });
                        }
                        j++
            }

        });
        $('div[datalist]').removeClass("active");
        $('div [datalist="' + playlistID + '"]').addClass("active");
        init(); //fonction pour lancer API YouTube
    }

    function yptThumbHeight() {
        ypt_thumbs.style.height = document.getElementById('player').clientHeight + 'px'; //change the height of the thumb list
        //breaks if ypt_player.clientHeight + 'px';
    }

    function onPlayerReady(event) { //Once the player is ready...
        yptThumbHeight(); //Set the thumb containter height	
        $('#Shuffle').removeClass("disabled");
    }



    //Once the Youtube Iframe API is ready...
    function init2() { // Creates an <iframe> (and YouTube player) after the API code downloads. must be globally available
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            playerVars: {
                listType: 'playlist',
                modestbranding: 1, // turns off youtube logo
                rel: 0, // turn off related videos at end of playback
                autoplay: 1,
                loop: 1,
                //controls: 0, //bouton control sur off
                //disablekb: 1, //controle avec raccourci clavier sur off
                list: playlistID
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });

    };

    // When the player does something...
    function onPlayerStateChange(event) {
        //Let's check on what video is playing
        var currentIndex = player.getPlaylistIndex();
        if (shuff == 1) {
            shuffl();
            shuff = 0;
        }
        var the_thumbs = ypt_thumbs.getElementsByTagName('li');

        if (event.data == YT.PlayerState.PLAYING) { //A video is playing
            for (var i = 0; i < the_thumbs.length; i++) { //Loop through the thumbs
                the_thumbs[i].className = ""; //Remove nowplaying from each thumb
            }
            $('#ypt_thumbs li[data-ypt-index="' + currentIndex + '"]').addClass(nowPlaying); //ajout class playing

            scrollToMiddle() //scroll element en lecture                
        }
    } //function onPlayerStateChange(event)

    // When the player does error...
    function onPlayerError(event) {
        l = player.getPlaylist().length;
        var currentIndex = player.getPlaylistIndex() + 1;
        if (currentIndex == l) {
            currentIndex = 0;
        }
        player.playVideoAt(currentIndex);
        //player.nextVideo();
    } //function onPlayerError(event)

    //When the user changes the window size...
    window.addEventListener('resize', function(event) {
        yptThumbHeight(); //change the height of the thumblist
    });

    //When the user clicks an element with a playlist index...
    jQuery(document).on('click', '[data-ypt-index]:not(".ypt-now-playing")', function(e) { //click on a thumb that is not currently playing
        if (shuff == 1) {
            shuffl();
            shuff = 0;
        }
        ypt_index = Number(jQuery(this).attr('data-ypt-index')); //Get the ypt_index of the clicked item
        if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) { //if IOS
            player.cuePlaylist({ //cue is required for IOS 7
                listType: 'playlist',
                list: playlistID,
                index: ypt_index,
                suggestedQuality: 'hd720' //quality is required for cue to work, for now
                    // https://code.google.com/p/gdata-issues/issues/detail?id=5411
            }); //player.cuePlaylist
        } else { //yay it's not IOS!
            player.playVideoAt(ypt_index); //Play the new video, does not work for IOS 7
        }
        jQuery(nowPlayingClass).removeClass(nowPlaying); //Remove "now playing" from the thumb that is no longer playing
        //When the new video starts playing, its thumb will get the now playing class
    }); //jQuery(document).on('click','#ypt_thumbs...

    function init() {
        if (exect > 1) {
            //jQuery("#player, #www-widgetapi-script, #script").remove();
            player.destroy();
            var newDiv = document.createElement('div');
            newDiv.id = 'player';
            document.getElementById('video').appendChild(newDiv)
                // Load Youtube IFrame Player API code asynchronously. This boat is going nowhere without it.
                //jQuery.getScript(consturl);
            init2(); //iframe api youtube
        } else {
            // Load Youtube IFrame Player API code asynchronously. This boat is going nowhere without it.
            var tag = document.createElement('script'); //Add a script tag
            tag.src = "https://www.youtube.com/iframe_api"; //Set the SRC to get the API
            tag.id = "script";
            var firstScriptTag = document.getElementsByTagName('script')[0]; //Find the first script tag in the html
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); //Put this script tag before the first one
        }
        window.onYouTubeIframeAPIReady = function() {
            if (exect == 1) {
                consturl = scriptUrl;
            }
            init2();
        }
    }

    $('#Shuffle').click(function() {
        player.setShuffle(true);
        shuff = 1;
    })

    function shuffl() {
        var li = ypt_thumbs.getElementsByTagName('li');
        var newpl = [];
        newpl = player.getPlaylist();
        for (j = 0; j < li.length; j++) {
            var outli = li[j].getAttribute("data-key");
            for (i = 0; i < newpl.length; i++) {
                var listnew = newpl[i];
                if (listnew == outli) {
                    li[j].setAttribute("data-ypt-index", i)
                    i = newpl.length;
                }
            }
        }
        console.log("index playlist remis à jour");
    }
}

//fnre_init();//démarrage en auto

function fn1() {
    playlistID = ypt_player.value;
    if (playlistID.substr(0, 2) === "PL") {
        fnre_init();
    } else {
        alert("Votre playlist est erronée");
        return false;
    }
}


$(document).ready(function() {

    <!-- DEBUT TITLE -->
    var option = {
            animation: rand[getRandomInt(4)],
            arrow: true,
            speed: 300,
            delay: 300,
            onlyOne: true
        },

        // delay execution by placing the function into another queue
        // helps with applying to other JS created elements such as the editor
        queue = true,
        titles,

        parse = function() {
            titles = $('[title]');
            titles.not('[title=""]').tooltipster(option);
        };

    queue ? $(parse) : parse();

});
