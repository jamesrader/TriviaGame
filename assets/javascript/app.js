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

    function quiz() {
        if (i < (questions.length - 1)) {
            i++;
            $("#questionArea").text(questions[i].question);
            for (j = 0; j < questions[i].choices.length; j++) {
                answersText += ("<p><button type='button' class='btn btn-link' id=" + letters[j] + ">" + letters[j] + ". " + questions[i].choices[j] + "</button></p>");
            }
            $("#answersArea").html(answersText);
            $(".btn").on("click", function(event){
                $(".btn").off();
                console.log(event.target.id);
                chosenAnswer = event.target.id;
                console.log(chosenAnswer);
                if (chosenAnswer === questions[i].answer){
                    console.log("Correct!");
                    $("#" + chosenAnswer).addClass("btn-outline-success");
                } else {
                    $("#" + chosenAnswer).addClass("btn-outline-danger");
                    console.log("Wrong!");
                }
            })
            console.log(answersText);

            answersText = "";
            setTimeout(quiz, 3000);
        } else {
            console.log("Quiz Complete.");
        }

    };

    quiz();

})