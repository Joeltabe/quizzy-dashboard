// Define variables for quiz data, current question index, score, and timer
let quizData;
let currentSubjectIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let timer;

// Get references to HTML elements
const quizInfoElement = document.getElementById('quiz-info');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const timeLeftElement = document.getElementById('time-left');

// Function to initialize the quiz
function initializeQuiz() {
    fetchQuizData();
    showModal();  // Fetch quiz data from the server
}
function startQuiz() {
    // Reset the timer
    clearInterval(timer);
    startTimer(); // Start the timer
    
    // Code to start the quiz goes here
    // For example, you can call displayQuestion() to display the first question
    // displayQuestion(quizData[currentSubjectIndex]);
}

function showModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';
    // Add event listener to the "Start Quiz" button
    const startQuizBtn = document.getElementById('start-quiz-btn');
    startQuizBtn.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal
        startQuiz();
         // Start the quiz
    });
}

// Function to fetch quiz data from the server
function fetchQuizData() {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectName = urlParams.get('subject');
    if (!subjectName) {
        console.error("Subject parameter is missing in the URL.");
        return;
    }
    fetch('quiz.json') // Assuming the quiz data is stored in a JSON file
        .then(response => response.json())
        .then(data => {
            quizData = data.subjects;
            const subject = quizData.find(subject => subject.name === subjectName);
            if (!subject) {
                console.error(`Subject '${subjectName}' not found.`);
                return;
            }
            displayQuizInfo(subject); // Display quiz information
            displayQuestion(subject); // Display the first question
        })
        .catch(error => console.error('Error fetching quiz data:', error));
}

// Function to display quiz information
function displayQuizInfo(subject) {
    if (!subject) {
        console.error("Subject data is missing.");
        return;
    }
    // Display subject name, total questions, and pass rate
    quizInfoElement.innerText = `Subject: ${subject.name} | Total Questions: ${subject.totalQuestions} | Pass Rate: ${subject.passRate}%`;
}

// Function to display a question
function displayQuestion(subject) {
    if (!subject || currentQuestionIndex >= subject.questions.length) {
        endQuiz(); // End the quiz if no more questions
        return;
    }
    const currentQ = subject.questions[currentQuestionIndex];
    if (!currentQ) {
        console.error("Question data is missing.");
        return;
    }
    // Display the question text
    questionElement.innerText = currentQ.question;
    optionsElement.innerHTML = ""; // Clear previous options
    // Display options as buttons
    currentQ.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option, currentQ.correctAnswer); // Check answer when clicked
        optionsElement.appendChild(button);
    });
    startTimer(); // Start the timer for each question
}

// Function to check the selected answer
function checkAnswer(selectedOption, correctAnswer) {
    clearInterval(timer); // Stop the timer
    const selectedButton = Array.from(optionsElement.getElementsByTagName('button')).find(btn => btn.innerText === selectedOption);
    if (selectedButton) {
        if (selectedOption === correctAnswer) {
            selectedButton.style.backgroundColor = '#4CAF50'; // Green for correct answer
            score++; // Increment score
            feedbackElement.innerText = "Correct!";
        } else {
            selectedButton.style.backgroundColor = '#FF5733'; // Red for wrong answer
            feedbackElement.innerText = `Wrong! The correct answer is ${correctAnswer}.`;
        }
        optionsElement.querySelectorAll('button').forEach(btn => {
            btn.disabled = true; // Disable buttons after an answer is selected
        });
    } else {
        feedbackElement.innerText = "Time's up! You didn't answer in time.";
        optionsElement.querySelectorAll('button').forEach(btn => {
            btn.disabled = true; // Disable buttons when time is up
        });
    }
    nextButton.disabled = false; // Enable next button after answering
}

// Function to start the timer for each question
function startTimer() {
    const duration = 15; // Duration of the timer in seconds for each question
    let startTime = Date.now(); // Get the current time

    timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
        const timeLeft = Math.max(0, duration - elapsedTime); // Calculate time left

        // Update timer display
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeftElement.innerText = formattedTime;

        // Check if time is up
        if (elapsedTime >= duration) {
            clearInterval(timer);
            checkAnswer(null, null); // Automatically check for a timeout
        }
    }, 1000); // Update the timer every second
}

// Function to end the quiz
function endQuiz() {
    clearInterval(timer); // Stop the timer
    timeLeftElement.style.display = 'none'; // Hide the timer
    if (!quizData[currentSubjectIndex]) {
        currentQuestionIndex = 0; // Reset question index
        score = 0; // Reset score
        feedbackElement.innerText = "Quiz Over!";
        quizInfoElement.innerText = "No more subjects available.";
        questionElement.innerText = "";
        optionsElement.innerHTML = "";
        nextButton.disabled = true;
    } else {
        // Display final score and feedback
        questionElement.innerText = `Quiz Over! Your Score: ${score}/${quizData[currentSubjectIndex].totalQuestions}`;
        optionsElement.innerHTML = "";
        feedbackElement.innerText = "";
        nextButton.style.display = "none"; // Hide next button
        calculateScore(); // Calculate and display score percentage
    }
}

// Function to calculate and display score percentage
function calculateScore() {
    const percentage = (score / quizData[currentSubjectIndex].totalQuestions) * 100;
    const passRate = quizData[currentSubjectIndex].passRate;
    const passMessage = percentage >= passRate ? "Congratulations! You passed." : "Sorry, you didn't pass.";

    feedbackElement.innerHTML = `
        <p>Your Score: ${score}/${quizData[currentSubjectIndex].totalQuestions}</p>
        <p>Percentage: ${percentage.toFixed(2)}%</p>
        <p>${passMessage}</p>
    `;
}

// Event listener for the next button
document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++; // Move to the next question
    displayQuestion(quizData[currentSubjectIndex]); // Display the next question
    nextButton.disabled = true;
});

// Fetch quiz data when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeQuiz);
