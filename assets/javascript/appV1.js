$(document).ready(function () {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    var phrases = ["You weren't really trying, were you?", "Atrocious!", "Abysmal!", "Pathetic!", "Awful!", "Terrible!", "Not bad.", "Pretty good.", "Well done!", "Great job!", "Fantastic! You must be a genius!"]
    var answersText = "";
    var q = -1;
    var numQuestions = 3;
    var correct = 0;
    var wrong = 0;
    var timer = 10;
    var swap = 0;
    var interval;
    var questionNumbers = [];
    var questionsArray = [];
    var answersToRandomize = [];
    var answersOrder = [];
    var question = "";
    var categoryName = "";
    var categories = [{ category: "Movies", number: 11 },
    { category: "Music", number: 12 },
    { category: "Television", number: 14 },
    { category: "Video Games", number: 15 }
    ];

    function enableControls(){
    //$("#category1").prop("display", "none");
    $("#startButton").on("click", function () {
        var categoryNum = $("#dropdown").val();
        categoryName = $("#dropdown :selected").text();
        resetGame();
        getQuestions(categoryNum);
    })

    $("#dropdown").change(function () {
        $("#startButton").prop("disabled", false);
    })
}

    for (i = 0; i < categories.length; i++) {
        $('<option/>').val(categories[i].number).text(categories[i].category).appendTo('#dropdown');
    }

    function resetGame(){
        console.log("HERE!!!");
        $("#dropdown").prop("disabled", true);
        $("#startButton").prop("disabled", true);
        q = -1;
        correct = 0;
        wrong = 0;
        $("#messageArea").text("");
        $("#resultsArea").text("");
        $("#scoreArea").text("");
        $("#timerArea").html("<h4>Time remaining   <span id='timer'></span></h4>");
        $("#music-audio").prop("volume", 0.4);
        $('#music-audio').trigger('play');
    }

    function getQuestions(catNum) {
        console.log(catNum);
        questionsArray=[];
        questionNumbers = [];
        for (i = 0; i < numQuestions; i++) {
            var randomNum = Math.floor(Math.random() * 50);
            if (questionNumbers.indexOf(randomNum) > -1) {
                i--;
            } else {
                questionNumbers.push(randomNum);
            }
        }
        console.log(questionNumbers);

        var queryURL = "https://opentdb.com/api.php?amount=50&category=" + catNum + "&difficulty=easy&type=multiple";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (i = 0; i < questionNumbers.length; i++) {
                questionsArray.push(response.results[questionNumbers[i]]);
            }
            console.log(questionsArray);
            var question1 = questionsArray[0].question;

            //Decode HTML Entities
            console.log($("<textarea/>").html(question1).val());
            quiz();
        });
    }

    function quiz() {
        $("#giphyArea").get(0).pause();
        $("#giphyArea").attr('src', "");
        $("#giphyArea").get(0).load();
        if (q < (questionsArray.length - 1)) {
            q++;
            timer = 10;
            $("#messageArea").text("");
            //$("#timerArea").html("You have <span id='timer'>" + timer + "</span> seconds remaining.");
            $("#timer").text(":" + timer.toString());


            //Decode HTML Entities
            question = ($("<textarea/>").html(questionsArray[q].question).val());
            console.log(question);
            $("#questionArea").text((q + 1) + ". " + question);
            var answersNum = questionsArray[q].incorrect_answers.length + 1;
            //Select random order for answers
            answersOrder = [];
            for (r = 0; r < answersNum; r++) {
                var randomNum = Math.floor(Math.random() * answersNum);
                if (answersOrder.indexOf(randomNum) > -1) {
                    r--;
                } else {
                    answersOrder.push(randomNum);
                }

            }

            console.log(answersOrder);

            for (j = 0; j < answersNum; j++) {
                var k = j+1;
                if (answersOrder[j] == 0) {
                    answersText = ("<button type='button' class='btn btn-link btn-lg' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].correct_answer + "</button>");
                    $("#answer" + k).html(answersText);
                } else {
                    answersText = ("<button type='button' class='btn btn-link btn-lg' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].incorrect_answers[answersOrder[j] - 1] + "</button>");
                    $("#answer" + k).html(answersText);
                }
            }
            //$("#answersArea").html(answersText);
            $(".btn").on("click", function (event) {
                clearInterval(interval);
                $(".btn").off("click");
                $(".btn").prop("disabled", true);
                // console.log(event.target.id);
                chosenAnswer = event.target.id;
                // console.log(chosenAnswer);
                if (chosenAnswer == 0) {
                    $('#correct-audio').trigger('play');
                    console.log("Correct!");
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-success");
                    $("#messageArea").text("Correct!");
                    correct++;
                    getGiphy();
                    setTimeout(quiz, 4000);
                } else {
                    $('#wrong-audio').trigger('play');
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-danger");
                    console.log("Wrong!");
                    //correctIndex = letters.indexOf(questions[i].answer);
                    console.log(answersOrder);
                    console.log(answersOrder.indexOf(0));
                    $("#messageArea").html("Sorry, that's wrong.  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
                    wrong++;
                    getGiphy();
                    setTimeout(quiz, 4000);
                }
            })
            console.log(answersText);

            answersText = "";
            interval = setInterval(countdown, 1000);
        } else {
            $('#music-audio').animate({
                volume: 0.2
              }, 1000);
            console.log("Quiz Complete.");
            console.log("Correct: " + correct);
            console.log("Incorrect: " + wrong);
            $("#messageArea").text("Quiz Complete.");
            $("#resultsArea").text("Correct: " + correct + "    Incorrect: " + wrong);
            var correctPercent = Math.round((correct / (correct + wrong)) * 100);
            var percentText = "Score:  " + correctPercent + "%";
            speechString = "Quiz complete. Your score was " + correctPercent + " percent.";
            responsiveVoice.speak(speechString, "UK English Female", {volume: 1}, {rate: 0.5});
            responsiveVoice.speak(phrases[Math.round(correctPercent / 10)], "UK English Female", {volume: 1}, {rate: 0.5}, {onend: fadeMusic()});

            
            function fadeMusic(){
                $('#music-audio').animate({
                    volume: 0.0
                  }, 3000);
            }

            $("#scoreArea").text(percentText);
            $("#dropdown").prop("disabled", false);
            $("#startButton").prop("disabled", false);

            enableControls();
            /* $("#startButton").on("click", function () {
                var categoryNum = $("#dropdown").val();
                categoryName = $("#dropdown :selected").text();
                resetGame();
                getQuestions(categoryNum);
            }) */
        }

    };

    function countdown() {
        timer--;
        $("#timer").text(":0" + timer.toString());
        if (timer === 0) {
            clearInterval(interval);
            $('#wrong-audio').trigger('play');
            $(".btn").off("click");
            $(".btn").prop("disabled", true);
            console.log("You ran out of time!");
            $("#messageArea").html("You ran out of time!  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
            wrong++;
            getGiphy();
            setTimeout(quiz, 4000);
        };


    };

    function getGiphy() {
        var search = (questionsArray[q].correct_answer + "+" + categoryName);
        search = search.replace(/\s/g, "+");
        console.log(search);
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=gBzC2Ds1djK6WZkC736coM3WamCAziaD&q=" + search + "&limit=1&offset=0&rating=PG&lang=en";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var giphy = response.data[0].images.looping.mp4;

            $("#giphyArea").get(0).pause();
            $("#giphyArea").attr('src', giphy);
            $("#giphyArea").get(0).load();
            $("#giphyArea").get(0).play();
        })
    };

    $("#startButton").prop("disabled", true);
    enableControls();

});