# DSA Learning Lab

**Learn Data Structures and Algorithms Through Interactive Visualization**

DSA Learning Lab is an interactive educational web application designed to make computer science concepts easier to understand through visual learning and hands-on experimentation.

Instead of relying only on theoretical explanations, students can watch algorithms execute step by step, observe comparisons and swaps, control animations, and understand how different operations work.

This project was developed for the hackathon problem statement **"Interactive Tools for CS Education."**

## Problem Statement

Learning data structures and algorithms can be challenging when concepts are explained only through static notes and code examples. Students often struggle to visualize how algorithms operate internally.

DSA Learning Lab addresses this problem by providing an interactive environment where students can explore algorithms, observe their execution, and learn through experimentation.

## Features

- **Interactive Algorithm Visualization:** Visual representation of algorithm execution using array bars.
- **Step-by-Step Execution:** Move through individual steps to understand each operation.
- **Playback Controls:** Play, pause, move between steps, and reset the visualization.
- **Animation Speed Control:** Adjust the speed of algorithm playback.
- **Operation Counters:** Display comparisons, swaps, and current step information.
- **Visual State Indicators:** Use colors to distinguish elements being compared, swapped, selected, or sorted.
- **Learning Explanations:** Display explanations of the current algorithm operation.
- **Data Structures Playground:** Explore operations such as Stack and Queue, where implemented.
- **Quiz and Practice:** Test understanding of computer science concepts, where implemented.
- **Complexity Reference:** Learn about algorithm time and space complexity, where implemented.
- **Responsive Interface:** Designed for a clear and interactive learning experience.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web application framework |
| HTML5 | Page structure |
| CSS3 | Styling, layout, and animations |
| JavaScript | Interactive logic and algorithm visualization |

## How It Works

1. The user selects an algorithm or learning module.
2. The user enters input or chooses an operation.
3. The application executes the selected algorithm.
4. The visualization displays the changing state step by step.
5. Explanations and operation counters help the user understand the process.

## Getting Started

### Prerequisites

- Python 3 installed
- A web browser
- Visual Studio Code or another code editor

### Installation

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Alternatively, download the project files and open the project folder in VS Code.

**2. Navigate to the project directory**

```bash
cd dsa-learning-lab
```

Replace the directory name if your actual project folder has a different name.

**3. Create a virtual environment**

On Windows:

```bash
python -m venv .venv
```

**4. Activate the virtual environment**

```powershell
.venv\Scripts\Activate.ps1
```

**5. Install the dependencies**

If your project contains a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Otherwise, install Flask if it is the only required Python package:

```bash
pip install flask
```

**6. Run the application**

If your Flask entry point is `app.py`:

```bash
python app.py
```

**7. Open the application**

Visit the local URL displayed in the terminal. For the default Flask development port, this is usually:

http://127.0.0.1:5000

## Example: Bubble Sort Visualization

Consider the following input:

```text
[10, 20, 14]
```

Bubble Sort compares adjacent elements and swaps them when they are in the wrong order.

- Compare 10 and 20: no swap is needed.
- Compare 20 and 14: swap the elements.
- The array becomes `[10, 14, 20]`.

The visualizer demonstrates these operations using animated bars, color indicators, step controls, and explanatory messages.

## Educational Benefits

- Makes abstract algorithm concepts easier to visualize.
- Encourages learning through experimentation.
- Helps students understand comparisons and swaps.
- Demonstrates the execution of algorithms rather than only their final output.
- Introduces algorithm efficiency and complexity.
- Provides an interactive learning experience for computer science students.

## Future Improvements

- Add more sorting and searching algorithms.
- Expand the range of interactive data structures.
- Introduce additional coding challenges and quizzes.
- Add more detailed algorithm performance comparisons.
- Include progress tracking and personalized learning activities.
- Support additional programming concepts and visualizations.

## Project Objective

The objective of DSA Learning Lab is to make computer science education more interactive, understandable, and engaging by helping students learn through visual demonstrations and practical experimentation.

## License

This project is intended for educational and hackathon purposes. Add a license if you wish to specify the terms under which others may use or modify the code.
