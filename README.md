# DSA Learning Lab ⚡

> An interactive web platform for mastering Data Structures and Algorithms through hands-on visualization, step-by-step animation, and quiz-based learning.

---

## Features

### 📊 Algorithm Visualizer
- **Sorting:** Bubble Sort, Selection Sort, Insertion Sort
  - Live bar chart animation with comparing/swapping/sorted color states
  - Play / Pause / Next Step / Previous Step / Reset controls
  - Speed selector (Slow / Normal / Fast)
  - Step counter, comparison and swap counters
  - Step-by-step plain-English explanations and input validation
- **Searching:** Linear Search, Binary Search
  - Element-by-element highlight for Linear Search
  - Range narrowing, mid-point, and eliminated region display for Binary Search
  - Found/not-found result display
- **Algorithm Info Panel** (for every algorithm):
  - Definition, how-it-works steps, and pseudocode
  - Best / Average / Worst time complexity badges
  - Space complexity, beginner-friendly explanation

### 🧱 Data Structures Playground
- **Stack** (LIFO): Push, Pop, Peek, Clear — with animated block visualization
- **Queue** (FIFO): Enqueue, Dequeue, Peek, Clear — with front/rear labels
- **Linked List** (Singly): Insert at beginning/end/index, Delete by value, Search, Clear — with connected node diagram

### 🎯 Quiz & Practice
- 12 multiple-choice questions covering sorting, searching, time complexity, stacks, queues, linked lists
- Immediate right/wrong feedback with explanation
- Shuffled questions, score tracking, and a final results screen
- 5 practice challenges (complexity identification, sort-step prediction, stack/queue output)

### 📚 Complexity Reference
- Searchable Big-O cheat sheet — sorting algorithms, searching algorithms, data structures
- Visual Big-O class guide from O(1) to O(2ⁿ)

---

## Technology Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python 3.10+, Flask                 |
| Frontend   | HTML5, CSS3, Vanilla JavaScript     |
| Storage    | In-memory JS state + localStorage   |
| Fonts/Icons| System fonts only, Unicode symbols  |

No external CDNs, paid APIs, or databases required.

---

## Project Structure

```
dsa-learning-lab/
├── app.py               ← Flask server
├── requirements.txt     ← Python dependencies
├── README.md
├── templates/
│   └── index.html       ← Single-page application
└── static/
    ├── css/
    │   └── style.css    ← All styles (dark theme, responsive)
    └── js/
        ├── algorithms.js     ← Sort & search frame generators
        ├── data-structures.js← Stack, Queue, Linked List logic + DOM
        ├── quiz.js           ← Quiz engine + practice challenges
        └── app.js            ← Navigation, visualizer controller, reference table
```

---

## Installation & Running (Windows PowerShell)

### 1. Create a virtual environment
```powershell
python -m venv .venv
```

### 2. Activate the virtual environment
```powershell
.venv\Scripts\Activate.ps1
```

> If you see an execution policy error, run:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 3. Install dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run the application
```powershell
python app.py
```

### 5. Open in your browser
```
http://127.0.0.1:5000
```

Press `Ctrl+C` in the terminal to stop the server.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `'python' is not recognized` | Use `python3 app.py` or install Python from python.org and add to PATH |
| Activation policy error | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Port 5000 already in use | Change port in `app.py`: `app.run(port=5001)` |
| Page not loading | Ensure you are at `http://127.0.0.1:5000` (not HTTPS) |
| Animation not starting | Enter at least 2 comma-separated integers and click Play |

---

## Usage Tips

1. **Algorithm Visualizer:** Select a sorting or searching algorithm, enter your array (or click Random), then click Play. Use Next/Prev for step-by-step control. Binary Search sorts an unsorted input and explains that adjustment.
2. **Data Structures Playground:** Switch between Stack, Queue, and Linked List using the tabs. Enter a value and click an operation button.
3. **Quiz:** Take all 12 questions, read the explanations, then try the Practice Challenges below.
4. **Reference:** Use the search box to quickly find complexity values for any algorithm.
