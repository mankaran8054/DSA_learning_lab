/**
 * quiz.js
 * Quiz module: 12 MCQ questions with immediate feedback, scoring, and explanation.
 * Practice challenges: identify complexity, predict sort step, stack/queue output.
 */

"use strict";

/* ============================================================
   QUESTION BANK (12 questions)
   ============================================================ */
const QUESTIONS = [
  {
    q: "What is the worst-case time complexity of Bubble Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    answer: 2,
    explanation: "Bubble Sort compares every pair of adjacent elements, leading to n × (n-1) / 2 comparisons in the worst case (reverse-sorted array), which is O(n²)."
  },
  {
    q: "Which sorting algorithm always makes exactly n(n-1)/2 comparisons regardless of the input?",
    options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort"],
    answer: 2,
    explanation: "Selection Sort always scans the entire unsorted region to find the minimum, performing exactly n(n-1)/2 comparisons. It has no early-exit optimization."
  },
  {
    q: "What is the best-case time complexity of Insertion Sort?",
    options: ["O(n²)", "O(n log n)", "O(1)", "O(n)"],
    answer: 3,
    explanation: "When the array is already sorted, Insertion Sort only compares each element with its predecessor without shifting anything, performing exactly n-1 comparisons → O(n)."
  },
  {
    q: "Binary Search requires the array to be:",
    options: ["In reverse order", "Sorted in ascending order", "Unsorted", "Of even length"],
    answer: 1,
    explanation: "Binary Search works by comparing the target with the middle element and eliminating half the array. This only works correctly if the array is sorted."
  },
  {
    q: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    answer: 2,
    explanation: "Binary Search halves the search space on every comparison, so it needs at most ⌊log₂n⌋ + 1 comparisons → O(log n)."
  },
  {
    q: "A Stack operates on which principle?",
    options: ["FIFO — First In, First Out", "LIFO — Last In, First Out", "Random access", "FILO — First In, Last Out (same as LIFO)"],
    answer: 1,
    explanation: "A Stack is LIFO: the most recently pushed element is the first to be popped. Think of a stack of plates — you always take from the top."
  },
  {
    q: "A Queue operates on which principle?",
    options: ["LIFO — Last In, First Out", "Random access", "FIFO — First In, First Out", "Circular order"],
    answer: 2,
    explanation: "A Queue is FIFO: elements are enqueued at the rear and dequeued from the front, like a checkout line at a supermarket."
  },
  {
    q: "What happens when you call Pop() on an empty stack?",
    options: ["Returns 0", "Returns null and continues", "Stack Underflow — an error condition", "Creates a new element"],
    answer: 2,
    explanation: "Popping from an empty stack is called a Stack Underflow. It is an error condition that must be handled, otherwise it causes undefined behaviour or an exception."
  },
  {
    q: "In a singly linked list, each node contains:",
    options: [
      "Only a value",
      "A value and a pointer to the previous node",
      "A value and a pointer to the next node",
      "Pointers to both the previous and next nodes"
    ],
    answer: 2,
    explanation: "A singly linked list node holds a data value and a single 'next' pointer pointing to the following node (or null for the last node). Doubly linked lists add a 'prev' pointer."
  },
  {
    q: "What is the space complexity of an iterative Binary Search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 3,
    explanation: "Iterative Binary Search only uses a constant number of variables (low, high, mid) regardless of input size → O(1) auxiliary space. A recursive version would use O(log n) stack frames."
  },
  {
    q: "Which of these is true about Linear Search?",
    options: [
      "It requires a sorted array",
      "It has O(log n) worst-case time complexity",
      "It works on any array and has O(n) worst-case time complexity",
      "It is always faster than Binary Search"
    ],
    answer: 2,
    explanation: "Linear Search checks every element sequentially and works on unsorted arrays. Its worst case is O(n) when the element is absent or at the end. Binary Search is faster for large sorted datasets."
  },
  {
    q: "What is the auxiliary space complexity of Bubble Sort, Selection Sort, and Insertion Sort?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 3,
    explanation: "All three are in-place sorting algorithms. They sort by rearranging elements within the original array, using only a constant amount of extra memory (a few variables) → O(1) space."
  }
];


/* ============================================================
   PRACTICE CHALLENGES
   ============================================================ */
const CHALLENGES = [
  {
    type: "complexity",
    question: "What is the time complexity of this code?\n\nfor i in range(n):\n  for j in range(n):\n    print(i, j)",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
    answer: 2,
    explanation: "Two nested loops each running n times → n × n = n² operations → O(n²)."
  },
  {
    type: "sort-step",
    question: "After ONE pass of Bubble Sort on [5, 3, 8, 1, 9], what is the array?",
    options: ["[3, 5, 1, 8, 9]", "[1, 3, 5, 8, 9]", "[3, 5, 8, 1, 9]", "[5, 3, 1, 8, 9]"],
    answer: 0,
    explanation: "Bubble Sort compares adjacent pairs: (5,3)→swap→[3,5,8,1,9]; (5,8)→no swap; (8,1)→swap→[3,5,1,8,9]; (8,9)→no swap. Result: [3,5,1,8,9]. The largest value (9) has been bubbled to the end."
  },
  {
    type: "stack-output",
    question: "Stack operations: Push(2), Push(7), Pop(), Push(4), Peek(). What does Peek() return?",
    options: ["2", "7", "4", "Empty"],
    answer: 2,
    explanation: "After Push(2): [2]. After Push(7): [2,7]. After Pop(): removes 7 → [2]. After Push(4): [2,4]. Peek() returns the top without removing: 4."
  },
  {
    type: "complexity",
    question: "Binary Search has _____ worst-case time complexity.",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    answer: 2,
    explanation: "Each comparison halves the search space. After k comparisons, at most n/2^k elements remain. When that reaches 1, k = log₂n. So worst case is O(log n)."
  },
  {
    type: "queue-output",
    question: "Queue operations: Enqueue(5), Enqueue(10), Dequeue(), Enqueue(3), Peek(). What does Peek() return?",
    options: ["5", "10", "3", "Empty"],
    answer: 1,
    explanation: "After Enqueue(5): [5]. After Enqueue(10): [5,10]. After Dequeue(): removes front (5) → [10]. After Enqueue(3): [10,3]. Peek() returns front: 10."
  }
];


/* ============================================================
   QUIZ STATE
   ============================================================ */
const QuizModule = (() => {
  let currentQ = 0;
  let score = 0;
  let answered = false;
  let initialized = false;
  let questionOrder = [];

  function shuffleQuestions() {
    questionOrder = QUESTIONS.map((_, index) => index);
    for (let i = questionOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionOrder[i], questionOrder[j]] = [questionOrder[j], questionOrder[i]];
    }
  }

  function updateProgressBar() {
    const pct = currentQ >= QUESTIONS.length ? 100 : ((currentQ) / QUESTIONS.length) * 100;
    const bar = document.getElementById("quizFill");
    const label = document.getElementById("quizProgressLabel");
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = currentQ >= QUESTIONS.length
      ? "Quiz complete"
      : `Question ${currentQ + 1} of ${QUESTIONS.length}`;
  }

  function showQuestion() {
    const q = QUESTIONS[questionOrder[currentQ]];
    answered = false;

    document.getElementById("quizQuestionScreen").style.display = "";
    document.getElementById("quizResultsScreen").style.display = "none";

    document.getElementById("quizQuestion").textContent = q.q;

    const optContainer = document.getElementById("quizOptions");
    optContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
      btn.addEventListener("click", () => handleAnswer(idx));
      optContainer.appendChild(btn);
    });

    const feedback = document.getElementById("quizFeedback");
    feedback.style.display = "none";
    feedback.textContent = "";
    feedback.className = "quiz-feedback glass-inner";

    document.getElementById("quizNextBtn").style.display = "none";
    updateProgressBar();
  }

  function handleAnswer(selectedIdx) {
    if (answered) return;
    answered = true;

    const q = QUESTIONS[questionOrder[currentQ]];
    const buttons = document.querySelectorAll(".quiz-opt");
    const isCorrect = selectedIdx === q.answer;

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
      if (i === selectedIdx && !isCorrect) btn.classList.add("wrong");
    });

    if (isCorrect) {
      score++;
    }
    updateGlobalScore();

    const feedback = document.getElementById("quizFeedback");
    feedback.style.display = "";
    feedback.className = "quiz-feedback glass-inner " + (isCorrect ? "ok" : "err");
    feedback.textContent = (isCorrect ? "Correct! " : "Incorrect. ") + q.explanation;
    const scoreLabel = document.getElementById("quizScoreLabel");
    if (scoreLabel) scoreLabel.textContent = `Score: ${score}`;

    const nextBtn = document.getElementById("quizNextBtn");
    nextBtn.style.display = "";
    nextBtn.textContent = currentQ < QUESTIONS.length - 1 ? "Next Question →" : "See Results";
  }

  function nextQuestion() {
    if (!answered) return;
    currentQ++;
    if (currentQ >= QUESTIONS.length) {
      showResults();
    } else {
      showQuestion();
    }
  }

  function showResults() {
    document.getElementById("quizQuestionScreen").style.display = "none";
    document.getElementById("quizResultsScreen").style.display = "";

    const pct = Math.round((score / QUESTIONS.length) * 100);
    updateProgressBar();

    document.getElementById("resultScore").textContent = `${score} / ${QUESTIONS.length} (${pct}%)`;

    let icon = "🏆", title = "Excellent!", msg = "Outstanding performance! You have a strong grasp of DSA fundamentals.";
    if (pct < 50) { icon = "📚"; title = "Keep Learning!"; msg = "Review the modules and try again. Focus on time complexity and basic data structure operations."; }
    else if (pct < 75) { icon = "👍"; title = "Good Job!"; msg = "Solid understanding! Review the questions you missed and revisit the visualizer to reinforce the concepts."; }
    else if (pct < 90) { icon = "🎓"; title = "Great Work!"; msg = "Almost perfect! A bit more practice and you'll master DSA."; }

    document.getElementById("resultGraphic").textContent = icon;
    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultMsg").textContent = msg;

    // Save to localStorage
    try {
      const best = Math.max(pct, parseInt(localStorage.getItem("dsalab_quiz_best") || "0", 10));
      localStorage.setItem("dsalab_quiz_best", String(best));
      const headerScore = document.getElementById("quizScore");
      if (headerScore) headerScore.textContent = best + "%";
    } catch(e) {}
  }

  function updateGlobalScore() {
    const el = document.getElementById("quizScore");
    if (el) el.textContent = Math.round((score / QUESTIONS.length) * 100) + "%";
  }

  function restart() {
    currentQ = 0;
    score = 0;
    answered = false;
    const scoreLabel = document.getElementById("quizScoreLabel");
    if (scoreLabel) scoreLabel.textContent = "Score: 0";
    updateGlobalScore();
    shuffleQuestions();
    showQuestion();
  }

  function init() {
    if (initialized) return;
    const nextBtn    = document.getElementById("quizNextBtn");
    const restartBtn = document.getElementById("quizRestartBtn");

    if (!nextBtn) return;

    initialized = true;
    nextBtn.addEventListener("click", () => nextQuestion());
    restartBtn.addEventListener("click", () => restart());

    shuffleQuestions();
    showQuestion();
    initChallenges();
  }

  /* ---- Practice Challenges ---- */
  function initChallenges() {
    const area = document.getElementById("challengeArea");
    if (!area) return;
    area.innerHTML = "";

    CHALLENGES.forEach((ch, ci) => {
      const item = document.createElement("div");
      item.className = "challenge-item";

      const qlabel = document.createElement("div");
      qlabel.className = "challenge-q";
      // Preserve newlines
      qlabel.style.whiteSpace = "pre-wrap";
      qlabel.textContent = `${ci + 1}. ${ch.question}`;

      const optWrap = document.createElement("div");
      optWrap.className = "challenge-opts";

      const feedback = document.createElement("div");
      feedback.className = "ch-feedback";

      let chAnswered = false;

      ch.options.forEach((opt, oi) => {
        const btn = document.createElement("button");
        btn.className = "ch-opt";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          if (chAnswered) return;
          chAnswered = true;
          const correct = oi === ch.answer;
          optWrap.querySelectorAll(".ch-opt").forEach((b, bi) => {
            b.disabled = true;
            if (bi === ch.answer) b.classList.add("ok");
            if (bi === oi && !correct) b.classList.add("err");
          });
          feedback.style.display = "";
          feedback.textContent = (correct ? "✅ " : "❌ ") + ch.explanation;
        });
        optWrap.appendChild(btn);
      });

      item.appendChild(qlabel);
      item.appendChild(optWrap);
      item.appendChild(feedback);
      area.appendChild(item);
    });
  }

  return { init, restart };
})();
