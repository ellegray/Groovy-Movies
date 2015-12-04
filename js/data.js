        "use strict";
        var THEMOVIEDB_URL = "https://api.themoviedb.org/3/search/movie?api_key="
        var API_KEY = "883685de64b4c04801bcd597fc800e4a";
        var value;
        var url;

        window.onload = init;

        function init() {
            document.querySelector("#search").onclick = go;

            $(document).keypress(function (e) {
                if (e.which == 13) {
                    go();
                }
            });
        };

        function go() {
            getData();
            $("html, body").animate({
                scrollTop: (($(window).height()) + 10) + 'px'
            }, 600);
            $('#searchterm').val('');
            return false;
        }


        // MY FUNCTIONS
        function getData() {
            // build up our URL string
            url = THEMOVIEDB_URL;
            url += API_KEY;

            // get value of form field
            value = document.querySelector("#searchterm").value;

            // get rid of any leading and trailing spaces
            value = value.trim();

            // if there's no band to search then bail out of the function
            if (value.length < 1) return;

            document.querySelector("#dynamicContent").innerHTML = "<b>Searching for " + value + "</b>";

            // replace spaces the user typed in the middle of the term with %20
            // %20 is the hexadecimal value for a space
            value = encodeURI(value);

            // finally, add the artist name to the end of the string
            url += "&query=" + value;

            // call the web service, and download the file
            console.log("loading " + url);

            $("#content").fadeOut(1000);
            $.ajax({
                dataType: "jsonp",
                url: url,
                data: null,
                success: jsonLoaded
            });
        }

        function jsonLoaded(obj) {

            // if there's an error, print a message and return
            if (obj.error) {
                var status = obj.status;
                var description = obj.description;
                document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
                $("#dynamicContent").fadeIn(500);
                return; // Bail out
            }

            // if there are no results, print a message and return
            if (obj.results.length == 0) {
                var status = "No results found";
                document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
                $("#dynamicContent").fadeIn(500);
                return; // Bail out
            }

            var allMovies = obj.results;
            var bigString = "<p><b>There are " + allMovies.length + " events for " + value + "</b></p>";
            bigString += "<hr />";

            for (var i = 0; i < allMovies.length; i++) {
                var initial = allMovies[i];

                var url = "https://api.themoviedb.org/3/movie/" + initial.id + "?api_key=" + API_KEY + "&append_to_response=credits";

                var request = new XMLHttpRequest();

                request.open('GET', url);

                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        var movieData = JSON.parse(this.responseText);

                        var div = document.createElement('div');
                        div.className = "movieDiv";
                        bigString += "<h3>" + movieData.original_title + "</h3>";
                        bigString += "<p>" + movieData.overview + "</p>";
                        div.innerHTML = bigString;
                        bigString = "";

                        var button = document.createElement("button");
                        button.innerHTML = "Read More"
                        button.id = movieData.id;
                        button.className = "movieButton";
                        div.appendChild(button);

                        var rating = document.createElement("svg");
                        rating.id = "rating-" + movieData.id;
                        div.appendChild(rating);

                        button.addEventListener('click', function () {
                            readMore(movieData, rating.id);
                        });
                        document.querySelector('#dynamicContent').appendChild(div);

                    }
                };

                request.send();

            }

            $("#dynamicContent").fadeIn(500);
        }

        function readMore(obj, id) {
            var gauge1 = loadLiquidFillGauge("fillgauge1", obj.vote_average);
            var config1 = liquidFillGaugeDefaultSettings();
            config1.circleColor = "#FF7777";
            config1.textColor = "#FF4444";
            config1.waveTextColor = "#FFAAAA";
            config1.waveColor = "#FFDDDD";
            config1.circleThickness = 0.2;
            config1.textVertPosition = 0.2;
            config1.waveAnimateTime = 1000;

            var gauge2 = loadLiquidFillGauge(id, obj.vote_average);
            var config2 = liquidFillGaugeDefaultSettings();
            config2.circleColor = "#FF7777";
            config2.textColor = "#FF4444";
            config2.waveTextColor = "#FFAAAA";
            config2.waveColor = "#FFDDDD";
            config2.circleThickness = 0.2;
            config2.textVertPosition = 0.2;
            config2.waveAnimateTime = 1000;
        }