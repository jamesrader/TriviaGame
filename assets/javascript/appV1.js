$(document).ready(function () {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    var phrases = ["You weren't really trying, were you?", "Atrocious!", "Abysmal!", "Pathetic!", "Awful!", "Terrible!", "Not bad.", "Pretty good.", "Well done!", "Great job!", "Fantastic! You must be a genius!"]
    var answersText = "";
    var q = -1;
    var numQuestions = 10;
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

    //Setup listeners for start button and dropdown
    function enableControls() {
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

    //Build category list
    for (i = 0; i < categories.length; i++) {
        $('<option/>').val(categories[i].number).text(categories[i].category).appendTo('#dropdown');
    }


    function resetGame() {

        //Disable top controls during game
        $("#dropdown").prop("disabled", true);
        $("#startButton").prop("disabled", true);
        
        //Reset variables
        q = -1;
        correct = 0;
        wrong = 0;
        
        //Empty some divs
        $("#results-card").hide();
        $("#messageArea").text("");
        $("#resultsArea").text("");
        $("#scoreArea").text("");
        $("#timerArea").html("<h4>Time remaining   <span id='timer'></span></h4>");

        //Start the music
        $("#music-audio").prop("volume", 0.4);
        $('#music-audio').trigger('play');
    }

    function getQuestions(catNum) {
        questionsArray = [];
        questionNumbers = [];

        //Pick random questions numbers from the 50 which will be returned from the API (make sure there are no dupes)
        for (i = 0; i < numQuestions; i++) {
            var randomNum = Math.floor(Math.random() * 50);
            if (questionNumbers.indexOf(randomNum) > -1) {
                i--;
            } else {
                questionNumbers.push(randomNum);
            }
        }

        //Build the API call
        var queryURL = "https://opentdb.com/api.php?amount=50&category=" + catNum + "&difficulty=easy&type=multiple";

        //Make the API call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //Populate the array with the questions 
            for (i = 0; i < questionNumbers.length; i++) {
                questionsArray.push(response.results[questionNumbers[i]]);
            }

            quiz();
        });
    }

    function quiz() {

        if (q < (questionsArray.length - 1)) {
            q++;
            timer = 10;
            $("#messageArea").text("");
            $("#timer").text(":" + timer.toString());


            //Decode HTML entities and display question
            question = ($("<textarea/>").html(questionsArray[q].question).val());
            $("#questionArea").text((q + 1) + ". " + question);

            //Select random order for answers
            var answersNum = questionsArray[q].incorrect_answers.length + 1;
            answersOrder = [];
            for (r = 0; r < answersNum; r++) {
                var randomNum = Math.floor(Math.random() * answersNum);
                if (answersOrder.indexOf(randomNum) > -1) {
                    r--;
                } else {
                    answersOrder.push(randomNum);
                }

            }

            //Display answers...after giving them useful id's to track which is correct
            for (j = 0; j < answersNum; j++) {
                var k = j + 1;
                if (answersOrder[j] == 0) {
                    answersText = ("<button type='button' class='btn btn-link btn-lg' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].correct_answer + "</button>");
                    $("#answer" + k).html(answersText);
                } else {
                    answersText = ("<button type='button' class='btn btn-link btn-lg' id=" + answersOrder[j] + ">" + letters[j] + ". " + questionsArray[q].incorrect_answers[answersOrder[j] - 1] + "</button>");
                    $("#answer" + k).html(answersText);
                }
            }
          
            //Handler for choosing an answer
            $(".btn").on("click", function (event) {

                //Stop timer and disable answers from being selected
                clearInterval(interval);
                $(".btn").off("click");
                $(".btn").prop("disabled", true);
                
                //Get id of answer that was clicked
                chosenAnswer = event.target.id;
                
                //Check if answer is correct (id=0)
                if (chosenAnswer == 0) {

                    //Play bell sound
                    $('#correct-audio').trigger('play');

                    //Change look of clicked answer to green outline
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-success");

                    //Add notification that the answer is correct and increment correct answer variable
                    $("#messageArea").html("<span class='correct'>Correct!</span>");
                    correct++;

                    //Set delay for reading message
                    setTimeout(quiz, 4000);
                } else {

                    //Play buzzer sound
                    $('#wrong-audio').trigger('play');

                    //Change look of click answer to red outline
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-danger");
                    
                    //Add notification that the answer is wrong and increment wrong answer variable
                    $("#messageArea").html("<span class='wrong'>Sorry, that's wrong.</span>  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
                    wrong++;

                    //Set delay for reading message
                    setTimeout(quiz, 4000);
                }
            })
        
            //Empty variable for answers
            answersText = "";

            //Timer for countdown
            interval = setInterval(countdown, 1000);
        } else {

            //Dip music for text-to-speech
            $('#music-audio').animate({
                volume: 0.2
            }, 1000);

            //Empty questions/answers and message
            $(".quiz-info").html("");
            $("#messageArea").text("");
            
            //Calculate percentage correct and display stats
            var correctPercent = Math.round((correct / (correct + wrong)) * 100);
            var percentText = "Score:  " + correctPercent + "%";
            $("#results-correct").text("Correct: " + correct);
            $("#results-wrong").text("Incorrect: " + wrong);
            $("#results-score").text("Score:  " + correctPercent + "%");
            $("#restart-message").show();
            $("#results-card").show();

            //Text-to-speech using API
            speechString = "Quiz complete. Your score was " + correctPercent + " percent.";
            responsiveVoice.speak(speechString, "UK English Female", { volume: 1 }, { rate: 0.5 });
            responsiveVoice.speak(phrases[Math.round(correctPercent / 10)], "UK English Female", { volume: 1 }, { rate: 0.5 });

            //Fade music
            $('#music-audio').animate({
                volume: 0.0
            }, 8000);

            //Re-activate top controls to allow for starting a new game
            $("#dropdown").prop("disabled", false);
            $("#startButton").prop("disabled", false);

            //Re-establish listeners
            enableControls();
        }

    }

    function countdown() {
        
        //Decrement counter and display it
        timer--;
        $("#timer").text(":0" + timer.toString());
        
        //When time runs out, follow all steps for a wrong answer
        if (timer === 0) {
            clearInterval(interval);
            $('#wrong-audio').trigger('play');
            $(".btn").off("click");
            $(".btn").prop("disabled", true);
            console.log("You ran out of time!");
            $("#messageArea").html("<span class='wrong'>You ran out of time!</span>  The correct answer was:  " + letters[answersOrder.indexOf(0)] + ". " + questionsArray[q].correct_answer);
            wrong++;
            setTimeout(quiz, 4000);
        };


    }

    //Initialize display and controls to get started
    $("#results-card").hide();
    $("#restart-message").hide();
    $("#startButton").prop("disabled", true);
    enableControls();

});