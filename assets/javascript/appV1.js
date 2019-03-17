$(document).ready(function () {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

    var answersText = "";
    var q = -1;
    var numQuestions = 10;
    var correct = 0;
    var wrong = 0;
    var timer = 10;
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

    $("#startButton").prop("disabled", true);
    $("#startButton").on("click", function () {
        var categoryNum = $("#dropdown").val();
        categoryName = $("#dropdown :selected").text();
        resetGame();
        getQuestions(categoryNum);
    })

    $("#dropdown").change(function () {
        $("#startButton").prop("disabled", false);
    })

    for (i = 0; i < categories.length; i++) {
        $('<option/>').val(categories[i].number).text(categories[i].category).appendTo('#dropdown');
    }

    //console.log(musicQuestions[0].question);

    function resetGame(){
        $("#dropdown").prop("disabled", true);
        $("#startButton").prop("disabled", true);
        q = -1;
        correct = 0;
        wrong = 0;
        $("#messageArea").text("");
        $("#resultsArea").text("");
        $("#scoreArea").text("");
        $("#timerArea").html("You have <span id='timer'>  </span> seconds remaining.");
    }

    function getQuestions(catNum) {
        console.log(catNum);
        questionNumbers = [];
        for (i = 0; i < 10; i++) {
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
            $("#timer").text(timer);

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
                if (answersOrder[j] == 0) {
                    answersText += ("<p><button type='button' class='btn btn-link' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].correct_answer + "</button></p>");
                } else {
                    answersText += ("<p><button type='button' class='btn btn-link' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].incorrect_answers[answersOrder[j] - 1] + "</button></p>");
                }
            }
            $("#answersArea").html(answersText);
            $(".btn").on("click", function (event) {
                clearInterval(interval);
                $(".btn").off("click");
                $(".btn").prop("disabled", true);
                // console.log(event.target.id);
                chosenAnswer = event.target.id;
                // console.log(chosenAnswer);
                if (chosenAnswer == 0) {
                    console.log("Correct!");
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-success");
                    $("#messageArea").text("Correct!");
                    correct++;
                    getGiphy();
                    setTimeout(quiz, 3000);
                } else {
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-danger");
                    console.log("Wrong!");
                    //correctIndex = letters.indexOf(questions[i].answer);
                    console.log(answersOrder);
                    console.log(answersOrder.indexOf(0));
                    $("#messageArea").text("Sorry, that's wrong.  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
                    wrong++;
                    getGiphy();
                    setTimeout(quiz, 3000);
                }
            })
            console.log(answersText);

            answersText = "";
            interval = setInterval(countdown, 1000);
        } else {
            console.log("Quiz Complete.");
            console.log("Correct: " + correct);
            console.log("Incorrect: " + wrong);
            $("#messageArea").text("Quiz Complete.");
            $("#resultsArea").text("Correct: " + correct + "    Incorrect: " + wrong);
            var correctPercent = "Score:  " + ((correct / (correct + wrong)) * 100) + "%";
            $("#scoreArea").text(correctPercent);
            $("#dropdown").prop("disabled", false);
            $("#startButton").prop("disabled", false);
        }

    };

    function countdown() {
        timer--;
        $("#timer").text(timer);
        if (timer === 0) {
            clearInterval(interval);
            console.log("You ran out of time!");
            $("#messageArea").text("You ran out of time!  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
            wrong++;
            getGiphy();
            setTimeout(quiz, 3000);
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

    //quiz();

});