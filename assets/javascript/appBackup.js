$(document).ready(function () {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    var answersText = "";
    var questions = [{
        "question": "What is my name?",
        "choices": ["Bill", "James", "Ted", "John"],
        "answer": "b"
    },
    {
        "question": "Spell 7.",
        "choices": ["Five", "Six", "Seven", "Eight"],
        "answer": "c"
    }]

    var i = -1;
    var numQuestions = questions.length;
    var correct = 0;
    var wrong = 0;
    var timer = 10;
    var interval;

    function quiz() {
        if (i < (questions.length - 1)) {
            i++;
            timer = 10;
            $("#messageArea").text("");
            $("#timerArea").text(timer);
            $("#questionArea").text(questions[i].question);
            for (j = 0; j < questions[i].choices.length; j++) {
                answersText += ("<p><button type='button' class='btn btn-link' id=" + letters[j] + ">" + letters[j] + ". " + questions[i].choices[j] + "</button></p>");
            }
            $("#answersArea").html(answersText);
            $(".btn").on("click", function(event){
                clearInterval(interval);
                $(".btn").off();
                console.log(event.target.id);
                chosenAnswer = event.target.id;
                console.log(chosenAnswer);
                if (chosenAnswer === questions[i].answer){
                    console.log("Correct!");
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-success");
                    $("#messageArea").text("Correct!");
                    correct++;
                    setTimeout(quiz, 3000);
                } else {
                    $("#" + chosenAnswer).removeClass("btn-link");
                    $("#" + chosenAnswer).addClass("btn-outline-danger");
                    console.log("Wrong!");
                    correctIndex = letters.indexOf(questions[i].answer);
                    $("#messageArea").text("Sorry, that's wrong.  The correct answer was:  " + questions[i].answer + ". " + questions[i].choices[correctIndex]);
                    wrong++;
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
        }

    };

    function countdown(){
        timer--;
        $("#timerArea").text(timer);
        if (timer === 0){
            clearInterval(interval);
            console.log("You ran out of time!");
            wrong++;
            setTimeout(quiz, 3000);
        }
    }

    quiz();

})