//Hier sind die drei möglichen Seiten die der Nutzer angezeigt bekommt
const startBox = document.querySelector("#start-box");
const quizBox = document.querySelector("#quiz-box");
const endBox = document.querySelector("#end-box");
// ------------------------------------------------

//Hier ist die Progressbar und die Box mit den Antworten
const progress = document.querySelector("#progress");
const answers = document.querySelector("#answers-box");
// ------------------------------------------------

// Hier sind die Buttons, die wir alle benutzen.
const btn1 = document.querySelector("#answer1");
const btn2 = document.querySelector("#answer2");
const btn3 = document.querySelector("#answer3");
const btn4 = document.querySelector("#answer4");
const startBtn = document.querySelector("#start");
let btns = [btn1, btn2, btn3, btn4];
// Den nächste Frage Button erstellen wir global, damit er einen EventListener bekommen kann.
// Wir hängen ihn aber erst in der Funktion showNextButton() an.
const nextBtn = document.createElement("button");
nextBtn.style.alignSelf = "center";
nextBtn.innerText = "Nächste Frage";
nextBtn.setAttribute("id", "next");

const restartBtn = document.querySelector("#restart");

// ------------------------------------------------

// Hier sind die Variablen, die die Punkte & Fragen zählen und den Status der Antwort auswerten
let score = document.querySelector("#score");
let scored = document.querySelector("#scored");
let frage = document.querySelector("#frage");
let points = 0;
let question = 1;
let correct = null;

// ------------------------------------------------
// Hier sind die Event Listener
window.onload = () => {
    hideQuizBox();
    hideEndBox();
};

startBtn.addEventListener("click", () => {
    startBox.style.display = "none";
    quizBox.style.display = "flex";
    setQuestion();
    startTimer(timeValue); // Starte den Timer mit 5 Sekunden
});

answers.addEventListener("click", (e) => {
    disableButtons(e);
    clearInterval(counter);
    showAnswers(e);
    updatePoints(e);
    updateProgress(e);
    showNextButton(e);
});

nextBtn.addEventListener("click", () => {
    if (question < 11) {
        frage.innerText = `Frage ${question}`;
        setQuestion();
        resetAnswers();
        clearInterval(counter);
        startTimer(timeValue);
    } else {
        hideQuizBox();
        showEndBox();
    }
});

restartBtn.addEventListener("click", () => {
    window.location.reload();
});

// ---------------------------------------------------------------------------
// Hier ist der Code der zum Timer gehört
const timeCount = document.querySelector("#timeCount");
let counter;
let timeValue = 5;

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 0) {
            // Wenn der Timer auf 0 kommt
            clearInterval(counter); // Stoppen wir die Uhr
            timeCount.textContent = "0"; // Setzen die Uhr auf 0
            for (btn of btns) {
                btn.disabled = true; // Deaktivieren alle Buttons
            }
            btn1.classList.add("correct-answer"); // Zeigen an welcher Button richtig wäre
            document.body.style.background = "#e5383b";
            quizBox.classList.add("wiggle");
            correct === false;
            progress.value++;
            quizBox.append(nextBtn); // Zeigen den next-button an
            question++;
            endBox.append(restartBtn);
            nextBtn.style.display = "inline";
            restartBtn.style.display = "inline";
        }
    }
}

// ---------------------------------------------------------------------------
// Funktion um die Fragen zu bekommen aus dem Internet
async function getData() {
    let response = await axios.get("https://opentdb.com/api.php?amount=1&category=15&type=multiple");
    // console.log(response.data.results);
    let data = await response.data.results;
    assignElements(data);
}

// Funktion um die Fragen in die richtigen Boxen zu setzen
function assignElements(data) {
    document.querySelector("#question").innerHTML = data[0].question;
    document.querySelector("#answer1").innerHTML = data[0].correct_answer;
    document.querySelector("#answer2").innerHTML = data[0].incorrect_answers[0];
    document.querySelector("#answer3").innerHTML = data[0].incorrect_answers[1];
    document.querySelector("#answer4").innerHTML = data[0].incorrect_answers[2];
    shuffleButtons();
}

// Mischen der Antwortbuttons
function shuffleButtons() {
    for (let i = answers.children.length; i >= 0; i--) {
        answers.append(answers.children[(Math.random() * i) | 0]);
    }
}

function setQuestion() {
    getData();
}

function showQuizBox() {
    quizBox.style.display = "flex";
}

function hideQuizBox() {
    quizBox.style.display = "none";
}

function showEndBox() {
    endBox.style.display = "flex";
    scored.innerText = points;
    document.body.style.background = "#A8DADC";
}

function hideEndBox() {
    endBox.style.display = "none";
}

function resetAnswers() {
    nextBtn.style.display = "none";
    document.body.style.background = "#A8DADC";
    quizBox.classList.remove("wiggle");
    quizBox.classList.remove("blob");
    correct = null;
    for (btn of btns) {
        btn.disabled = false;
        btn.classList.remove("wrong-answer");
        btn.classList.remove("correct-answer");
    }
}

function disableButtons(e) {
    if (e.target === btn1 || e.target === btn2 || e.target === btn3 || e.target === btn4) {
        for (btn of btns) {
            btn.disabled = true;
        }
    } else console.log("Der Knecht...");
}

function showAnswers(e) {
    if (e.target === btn2 || e.target === btn3 || e.target === btn4) {
        e.target.classList.add("wrong-answer");
        btn1.classList.add("correct-answer");
        document.body.style.background = "#e5383b";
        quizBox.classList.add("wiggle");
        correct = false;
    } else if (e.target === btn1) {
        btn1.classList.add("correct-answer");
        document.body.style.background = "#2dc653";
        quizBox.classList.add("blob");
        correct = true;
    } else console.log("...kann nicht mal...");
}

function updatePoints(e) {
    if (e.target === btn1 || e.target === btn2 || e.target === btn3 || e.target === btn4) {
        question++;
        if (correct === true) {
            points++;
            score.innerText = `${points}`;
        }
    } else console.log("...auf Knopf...");
}

function updateProgress(e) {
    if (e.target === btn1 || e.target === btn2 || e.target === btn3 || e.target === btn4) {
        progress.value++;
    } else console.log("... drücken...");
}

function showNextButton(e) {
    if (e.target === btn1 || e.target === btn2 || e.target === btn3 || e.target === btn4) {
        quizBox.append(nextBtn);
        nextBtn.style.display = "inline";
    } else console.log(":)");
}

function refreshPage() {
    window.location.reload();
}

function play() {
    var audio = new Audio("audio/megalovania.mp3");
    audio.play();
}

// End of my code
