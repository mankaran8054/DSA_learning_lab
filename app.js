/**
 * app.js
 * Main application controller.
 * Handles: navigation, visualizer controller (playback, rendering),
 * algorithm info panel, reference tables, progress tracking, sidebar.
 */

"use strict";

/* ============================================================
   NAVIGATION
   ============================================================ */
const NAV = (() => {
  const sections = ["dashboard", "visualizer", "datastructures", "quiz", "reference"];
  const visitedSections = new Set();
  const validSections = new Set(sections);

  function navigate(target) {
    if (!validSections.has(target)) return;

    sections.forEach(sec => {
      const el = document.getElementById("section-" + sec);
      if (el) el.classList.toggle("active", sec === target);
    });

    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.section === target);
    });

    visitedSections.add(target);
    updateProgress();
    updateStatusBar("Viewing: " + target.charAt(0).toUpperCase() + target.slice(1));

    // Initialize sub-modules lazily
    if (target === "quiz") QuizModule.init();
    if (target === "reference") ReferenceTable.init();

    // Reset visualizer if leaving it mid-animation
    if (target !== "visualizer") VizController.pause();
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");

    // Track in localStorage
    try {
      const visited = JSON.parse(localStorage.getItem("dsalab_visited") || "[]");
      if (!visited.includes(target)) visited.push(target);
      localStorage.setItem("dsalab_visited", JSON.stringify(visited));
    } catch(e) {}
  }

  function updateProgress() {
    const count = visitedSections.size;
    const pct = Math.round((count / sections.length) * 100);
    const bar = document.getElementById("sessionProgress");
    const text = document.getElementById("sessionProgressText");
    const moduleCount = document.getElementById("moduleCount");
    if (bar) bar.style.width = pct + "%";
    if (text) text.textContent = `${count} / ${sections.length} modules visited`;
    if (moduleCount) moduleCount.textContent = count;
  }

  function init() {
    // Sidebar nav buttons
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => navigate(btn.dataset.section));
    });

    // Module cards on dashboard
    document.querySelectorAll(".module-card").forEach(card => {
      const handler = () => navigate(card.dataset.target);
      card.addEventListener("click", handler);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") handler(); });
    });

    // Module card buttons
    document.querySelectorAll(".module-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = btn.closest(".module-card").dataset.target;
        navigate(target);
      });
    });

    // Hamburger / sidebar toggle for mobile
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function toggleSidebar() {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
    }
    if (hamburger) hamburger.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });

    // Load visited sections from localStorage
    try {
      const visited = JSON.parse(localStorage.getItem("dsalab_visited") || "[]");
      visited.filter(s => validSections.has(s)).forEach(s => visitedSections.add(s));
      updateProgress();
    } catch(e) {}

    // Load quiz score
    try {
      const best = localStorage.getItem("dsalab_quiz_best");
      if (best) {
        const el = document.getElementById("quizScore");
        if (el) el.textContent = best + "%";
      }
    } catch(e) {}

    navigate("dashboard");
  }

  return { init, navigate };
})();


/* ============================================================
   STATUS BAR
   ============================================================ */
function updateStatusBar(msg) {
  const el = document.getElementById("statusText");
  if (el) el.textContent = msg;
}


/* ============================================================
   DATA STRUCTURES TAB SWITCHER
   ============================================================ */
const DSTabs = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    document.querySelectorAll(".ds-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".ds-tab").forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        document.querySelectorAll(".ds-panel").forEach(p => {
          p.style.display = "none";
          p.setAttribute("aria-hidden", "true");
        });
        const target = document.getElementById("ds-" + tab.dataset.ds);
        if (target) {
          target.style.display = "";
          target.setAttribute("aria-hidden", "false");
        }
      });
    });

    // Init all data structures
    Stack.init();
    Queue.init();
    LinkedList.init();
  }

  return { init };
})();


/* ============================================================
   REFERENCE TABLE
   ============================================================ */
const ReferenceTable = (() => {
  let initialized = false;

  const SORTING_DATA = [
    { name: "Bubble Sort",   best: "O(n)",      avg: "O(n²)",      worst: "O(n²)",     space: "O(1)",  stable: "Yes", notes: "Simple; early-exit optimization possible" },
    { name: "Selection Sort",best: "O(n²)",     avg: "O(n²)",      worst: "O(n²)",     space: "O(1)",  stable: "No",  notes: "Minimizes swaps; always n(n-1)/2 comparisons" },
    { name: "Insertion Sort",best: "O(n)",      avg: "O(n²)",      worst: "O(n²)",     space: "O(1)",  stable: "Yes", notes: "Good for small or nearly sorted arrays" },
    { name: "Merge Sort",    best: "O(n log n)",avg: "O(n log n)", worst: "O(n log n)",space: "O(n)",  stable: "Yes", notes: "Divide and conquer; guaranteed O(n log n)" },
    { name: "Quick Sort",    best: "O(n log n)",avg: "O(n log n)", worst: "O(n²)",     space: "O(log n)",stable:"No", notes: "Fast in practice; worst case on sorted input" },
    { name: "Heap Sort",     best: "O(n log n)",avg: "O(n log n)", worst: "O(n log n)",space: "O(1)",  stable: "No",  notes: "In-place; not cache-friendly" },
    { name: "Counting Sort", best: "O(n+k)",   avg: "O(n+k)",     worst: "O(n+k)",    space: "O(k)",  stable: "Yes", notes: "Only integers; k = range of values" },
    { name: "Radix Sort",    best: "O(nk)",    avg: "O(nk)",      worst: "O(nk)",     space: "O(n+k)",stable: "Yes", notes: "Non-comparative; k = number of digits" }
  ];

  const SEARCHING_DATA = [
    { name: "Linear Search", best: "O(1)",  avg: "O(n)",    worst: "O(n)",    space: "O(1)", notes: "Works on unsorted arrays" },
    { name: "Binary Search", best: "O(1)",  avg: "O(log n)",worst: "O(log n)",space: "O(1)", notes: "Requires sorted array; iterative version" },
    { name: "Jump Search",   best: "O(1)",  avg: "O(√n)",   worst: "O(√n)",   space: "O(1)", notes: "Sorted array; block size = √n" },
    { name: "Interpolation Search", best:"O(1)", avg:"O(log log n)", worst:"O(n)", space:"O(1)", notes:"Sorted, uniformly distributed data" }
  ];

  const DS_DATA = [
    { name: "Array",        access: "O(1)",     search: "O(n)",     insert: "O(n)",     del: "O(n)",    space: "O(n)" },
    { name: "Linked List",  access: "O(n)",     search: "O(n)",     insert: "O(1)",     del: "O(1)",    space: "O(n)" },
    { name: "Stack",        access: "O(n)",     search: "O(n)",     insert: "O(1)",     del: "O(1)",    space: "O(n)" },
    { name: "Queue",        access: "O(n)",     search: "O(n)",     insert: "O(1)",     del: "O(1)",    space: "O(n)" },
    { name: "Hash Table",   access: "N/A",      search: "O(1) avg", insert: "O(1) avg", del: "O(1) avg",space: "O(n)" },
    { name: "Binary Search Tree", access: "O(log n)", search: "O(log n)", insert: "O(log n)", del: "O(log n)", space: "O(n)" },
    { name: "AVL Tree",     access: "O(log n)", search: "O(log n)", insert: "O(log n)", del: "O(log n)",space: "O(n)" },
    { name: "Heap (Binary)",access: "O(n)",     search: "O(n)",     insert: "O(log n)", del: "O(log n)",space: "O(n)" }
  ];

  function tcClass(val) {
    if (!val) return "";
    if (val.includes("O(1)")) return "tc-b";
    if (val.includes("log")) return "tc-s";
    if (val.includes("n²")) return "tc-w";
    if (val.includes("O(n)")) return "tc-a";
    return "tc-n";
  }

  function buildSortingTable() {
    const tbody = document.querySelector("#sortingRefTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    SORTING_DATA.forEach(row => {
      const tr = document.createElement("tr");
      tr.dataset.search = row.name.toLowerCase();
      tr.innerHTML = `
        <td class="td-name">${row.name}</td>
        <td class="${tcClass(row.best)}">${row.best}</td>
        <td class="${tcClass(row.avg)}">${row.avg}</td>
        <td class="${tcClass(row.worst)}">${row.worst}</td>
        <td class="tc-space">${row.space}</td>
        <td>${row.stable}</td>
        <td>${row.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function buildSearchingTable() {
    const tbody = document.querySelector("#searchingRefTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    SEARCHING_DATA.forEach(row => {
      const tr = document.createElement("tr");
      tr.dataset.search = row.name.toLowerCase();
      tr.innerHTML = `
        <td class="td-name">${row.name}</td>
        <td class="${tcClass(row.best)}">${row.best}</td>
        <td class="${tcClass(row.avg)}">${row.avg}</td>
        <td class="${tcClass(row.worst)}">${row.worst}</td>
        <td class="tc-space">${row.space}</td>
        <td>${row.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function buildDSTable() {
    const tbody = document.querySelector("#dsRefTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    DS_DATA.forEach(row => {
      const tr = document.createElement("tr");
      tr.dataset.search = row.name.toLowerCase();
      tr.innerHTML = `
        <td class="td-name">${row.name}</td>
        <td class="${tcClass(row.access)}">${row.access}</td>
        <td class="${tcClass(row.search)}">${row.search}</td>
        <td class="${tcClass(row.insert)}">${row.insert}</td>
        <td class="${tcClass(row.del)}">${row.del}</td>
        <td class="tc-space">${row.space}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function initSearch() {
    const input = document.getElementById("refSearch");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      document.querySelectorAll(".ref-table tr[data-search]").forEach(tr => {
        const match = !q || tr.dataset.search.includes(q);
        tr.classList.toggle("ref-hidden", !match);
      });
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;
    buildSortingTable();
    buildSearchingTable();
    buildDSTable();
    buildBigOGuide();
    initSearch();
  }

  function buildBigOGuide() {
    const grid = document.getElementById("bigoGrid");
    if (!grid) return;
    const classes = [
      ["O(1)", "Constant", "Work stays the same as the input grows.", "c1"],
      ["O(log n)", "Logarithmic", "Each step cuts down the remaining input.", "clogn"],
      ["O(n)", "Linear", "Work grows in proportion to the input size.", "cn"],
      ["O(n log n)", "Linearithmic", "Typical of efficient comparison-based sorting.", "cnlogn"],
      ["O(n²)", "Quadratic", "Nested passes make work grow quickly.", "cn2"],
      ["O(2ⁿ)", "Exponential", "Work roughly doubles for each added input item.", "c2n"]
    ];
    grid.innerHTML = classes.map(([notation, rating, description, className]) =>
      `<div class="bigo-card ${className}"><div class="bigo-rating">${rating}</div><div class="bigo-class">${notation}</div><div class="bigo-desc">${description}</div></div>`
    ).join("");
  }

  return { init };
})();


/* ============================================================
   VISUALIZER CONTROLLER
   Manages animation state, frame navigation, rendering.
   ============================================================ */
const VizController = (() => {
  let frames = [];
  let currentFrame = 0;
  let isPlaying = false;
  let timerId = null;
  let animationSpeed = 800; // ms
  let currentAlgo = "bubble";
  let isSortAlgo = true;
  let inputSignature = "";

  // --- State getters ---
  function getSpeed() { return animationSpeed; }
  function getInputSignature() {
    const ids = isSortAlgo
      ? ["arrayInput"]
      : ["searchArrayInput", "searchTargetInput"];
    return JSON.stringify([currentAlgo, ...ids.map(id => {
      const input = document.getElementById(id);
      return input ? input.value.trim() : "";
    })]);
  }

  // --- Timer management ---
  function clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  // --- Render a sorting frame ---
  function renderSortFrame(frame) {
    const barsContainer = document.getElementById("vizBars");
    const emptyState    = document.getElementById("vizEmpty");
    if (!barsContainer) return;

    if (!frame || frame.array.length === 0) {
      if (emptyState) emptyState.style.display = "";
      barsContainer.innerHTML = "";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    const arr = frame.array;
    const n = arr.length;
    const { comparing = [], swapping = [], sorted = [], current = [] } = frame.highlights;
    const maxVal = Math.max(...arr.map(Math.abs), 1);

    barsContainer.innerHTML = "";
    arr.forEach((val, i) => {
      const wrapper = document.createElement("div");
      wrapper.className = "bar-wrap";

      const bar = document.createElement("div");
      // Height: at least 8px, up to 220px
      const heightPct = Math.max(8, Math.round((Math.abs(val) / maxVal) * 220));
      bar.style.height = heightPct + "px";
      bar.className = "bar";

      if (swapping.includes(i))   bar.classList.add("swapping");
      else if (comparing.includes(i)) bar.classList.add("comparing");
      else if (sorted.includes(i))    bar.classList.add("sorted");
      else if (current.includes(i))   bar.classList.add("current");

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = val;

      wrapper.appendChild(bar);
      wrapper.appendChild(label);
      barsContainer.appendChild(wrapper);
    });
  }

  // --- Render a search frame ---
  function renderSearchFrame(frame) {
    const barsContainer = document.getElementById("vizBars");
    const emptyState    = document.getElementById("vizEmpty");
    const binaryInfo    = document.getElementById("searchRangeBar");
    const binaryText    = document.getElementById("searchRangeVal");
    if (!barsContainer) return;

    if (!frame || frame.array.length === 0) {
      if (emptyState) emptyState.style.display = "";
      barsContainer.innerHTML = "";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    const arr = frame.array;
    const hl  = frame.highlights || {};

    barsContainer.innerHTML = "";
    const cellsWrap = document.createElement("div");
    cellsWrap.className = "search-grid";

    arr.forEach((val, i) => {
      const cell = document.createElement("div");
      cell.className = "s-cell";

      const isElim = hl.eliminated && hl.eliminated.includes(i);
      const isCurrent = hl.current === i;
      const isFound   = hl.found === i;
      const isInRange = !isElim && hl.low !== undefined && i >= hl.low && i <= hl.high;
      const isChecked = hl.checked && hl.checked.includes(i);

      if (isFound)   cell.classList.add("s-found");
      else if (isCurrent) cell.classList.add("s-current");
      else if (isElim || isChecked) cell.classList.add("s-elim");
      else if (isInRange) cell.classList.add("s-range");

      const valDiv = document.createElement("div");
      valDiv.className = "s-val";
      valDiv.textContent = val;

      const idxDiv = document.createElement("div");
      idxDiv.className = "s-idx";
      idxDiv.textContent = "[" + i + "]";

      cell.appendChild(valDiv);
      cell.appendChild(idxDiv);
      cellsWrap.appendChild(cell);
    });
    barsContainer.appendChild(cellsWrap);

    // Binary search range display
    if (currentAlgo === "binary" && binaryInfo && binaryText) {
      if (frame.low !== undefined && frame.high !== undefined && !frame.done) {
        binaryInfo.style.display = "flex";
        binaryText.textContent = `[${frame.low}, ${frame.high}]` +
          (frame.mid !== undefined && frame.mid >= 0 ? `, mid = ${frame.mid}` : "");
      } else {
        binaryInfo.style.display = "none";
      }
    }
  }

  // --- Render any frame ---
  function renderFrame(frame) {
    if (!frame) return;
    if (isSortAlgo) renderSortFrame(frame);
    else renderSearchFrame(frame);

    // Step explanation
    const explEl = document.getElementById("stepExplText");
    const explBar = document.getElementById("explBar");
    if (explEl) {
      explEl.textContent = frame.explanation || "";
      if (explBar) {
        explBar.classList.toggle("success", frame.explanation && frame.explanation.startsWith("✅"));
        explBar.classList.toggle("error", frame.explanation && frame.explanation.startsWith("❌"));
      }
    }

    // Stats
    const stepEl = document.getElementById("stepCounter");
    const compEl = document.getElementById("compCounter");
    const swapEl = document.getElementById("swapCounter");
    if (stepEl) stepEl.textContent = `${currentFrame + 1} / ${frames.length}`;
    if (compEl) compEl.textContent = frame.comparisons !== undefined ? frame.comparisons : (isSortAlgo ? (frame.comparisons || 0) : "—");
    if (swapEl) swapEl.textContent = isSortAlgo ? (frame.swaps !== undefined ? frame.swaps : 0) : "—";
  }

  // --- Step navigation ---
  function stepForward() {
    if (frames.length === 0 || inputSignature !== getInputSignature()) {
      buildFrames();
      if (frames.length === 0) return;
    }
    if (currentFrame < frames.length - 1) {
      currentFrame++;
      renderFrame(frames[currentFrame]);
      updateButtons();
    }
    if (currentFrame >= frames.length - 1) {
      pause();
    }
  }

  function stepBack() {
    if (inputSignature !== getInputSignature() && frames.length > 0) {
      buildFrames();
      return;
    }
    if (currentFrame > 0) {
      currentFrame--;
      renderFrame(frames[currentFrame]);
      updateButtons();
    }
  }

  function updateButtons() {
    const playBtn = document.getElementById("playPauseBtn");
    const prevBtn = document.getElementById("prevStepBtn");
    const nextBtn = document.getElementById("nextStepBtn");
    if (playBtn) {
      playBtn.textContent = isPlaying ? "⏸ Pause" :
        (frames.length > 0 && currentFrame >= frames.length - 1 ? "↺ Replay" : "▶ Play");
    }
    if (prevBtn) prevBtn.disabled = currentFrame <= 0;
    if (nextBtn)     nextBtn.disabled = frames.length > 0 && currentFrame >= frames.length - 1;
  }

  // --- Playback ---
  function play() {
    if (frames.length === 0 || inputSignature !== getInputSignature()) {
      buildFrames();
      if (frames.length === 0) return;
    }

    // If at end, restart
    if (currentFrame >= frames.length - 1) {
      currentFrame = 0;
      renderFrame(frames[currentFrame]);
    }

    isPlaying = true;
    updateButtons();
    updateStatusBar("Animation playing…");

    function tick() {
      if (!isPlaying) return;
      if (currentFrame >= frames.length - 1) {
        pause();
        updateStatusBar("Animation complete.");
        return;
      }
      currentFrame++;
      renderFrame(frames[currentFrame]);
      updateButtons();
      timerId = setTimeout(tick, animationSpeed);
    }
    timerId = setTimeout(tick, animationSpeed);
  }

  function pause() {
    clearTimer();
    isPlaying = false;
    updateButtons();
  }

  function togglePlayPause() {
    if (frames.length === 0 || inputSignature !== getInputSignature()) {
      buildFrames();
      if (frames.length === 0) return;
    }
    if (isPlaying) pause();
    else play();
  }

  // --- Build frames from current inputs ---
  function buildFrames() {
    clearTimer();
    isPlaying = false;
    frames = [];
    currentFrame = 0;
    const barsContainer = document.getElementById("vizBars");
    const emptyState = document.getElementById("vizEmpty");
    const searchRange = document.getElementById("searchRangeBar");
    if (barsContainer) barsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "";
    if (searchRange) searchRange.style.display = "none";
    const stepEl = document.getElementById("stepCounter");
    const compEl = document.getElementById("compCounter");
    const swapEl = document.getElementById("swapCounter");
    if (stepEl) stepEl.textContent = "0 / 0";
    if (compEl) compEl.textContent = "0";
    if (swapEl) swapEl.textContent = isSortAlgo ? "0" : "—";

    if (isSortAlgo) {
      const input = document.getElementById("arrayInput");
      const rawInput = input ? input.value.trim() : "";
      if (!rawInput) {
        showInputError("Please enter a comma-separated list of integers.");
        return;
      }
      const parsed = rawInput.split(",").map(s => s.trim() ? Number(s.trim()) : NaN);
      if (parsed.some(value => !Number.isSafeInteger(value))) {
        showInputError("Invalid input: please enter only integers separated by commas.");
        return;
      }
      if (parsed.length < 2) {
        showInputError("Please enter at least 2 values.");
        return;
      }
      if (parsed.length > 30) {
        showInputError("Maximum 30 elements for clear visualization.");
        return;
      }

      clearInputError();
      inputSignature = getInputSignature();
      if (currentAlgo === "bubble")    frames = bubbleSortFrames(parsed);
      if (currentAlgo === "selection") frames = selectionSortFrames(parsed);
      if (currentAlgo === "insertion") frames = insertionSortFrames(parsed);

    } else {
      // Search algorithms
      const arrInput    = document.getElementById("searchArrayInput");
      const targetInput = document.getElementById("searchTargetInput");
      const rawArr = arrInput ? arrInput.value.trim() : "";
      const rawTarget = targetInput ? targetInput.value.trim() : "";

      if (!rawArr) { showInputError("Please enter an array."); return; }
      const parsed = rawArr.split(",").map(s => s.trim() ? Number(s.trim()) : NaN);
      if (parsed.some(value => !Number.isSafeInteger(value))) { showInputError("Invalid array: enter whole integers separated by commas."); return; }
      if (parsed.length > 30) { showInputError("Maximum 30 elements for clear visualization."); return; }

      const target = rawTarget ? Number(rawTarget) : NaN;
      if (!Number.isSafeInteger(target)) { showInputError("Please enter a valid integer target."); return; }

      clearInputError();
      inputSignature = getInputSignature();
      if (currentAlgo === "linear") frames = linearSearchFrames(parsed, target);
      if (currentAlgo === "binary") frames = binarySearchFrames(parsed, target);
    }

    if (frames.length > 0) {
      renderFrame(frames[0]);
      updateButtons();
    }
  }

  function showInputError(msg) {
    const explEl = document.getElementById("stepExplText");
    const explBar = document.getElementById("explBar");
    if (explEl) explEl.textContent = msg;
    if (explBar) {
      explBar.classList.add("error");
      explBar.classList.remove("success");
    }
    updateStatusBar("Input error: " + msg);
    updateButtons();
  }

  function clearInputError() {
    const explEl = document.getElementById("stepExplText");
    const explBar = document.getElementById("explBar");
    if (explEl) explEl.textContent = "Frames generated. Press Play or use step controls.";
    if (explBar) {
      explBar.classList.remove("error", "success");
    }
  }

  // --- Algorithm switching ---
  function setAlgorithm(algo) {
    clearTimer();
    isPlaying = false;
    frames = [];
    currentFrame = 0;

    currentAlgo = algo;
    inputSignature = "";
    isSortAlgo = ["bubble", "selection", "insertion"].includes(algo);

    // Toggle control panels
    const sortCtrl   = document.getElementById("sortControls");
    const searchCtrl = document.getElementById("searchControls");
    const binaryInfo = document.getElementById("searchRangeBar");

    if (sortCtrl)   sortCtrl.style.display   = isSortAlgo ? "" : "none";
    if (searchCtrl) searchCtrl.style.display = isSortAlgo ? "none" : "";
    if (binaryInfo) binaryInfo.style.display = "none";
    const legend = document.getElementById("colorLegend");
    if (legend) legend.style.display = isSortAlgo ? "flex" : "none";

    // Clear visualization
    const barsContainer = document.getElementById("vizBars");
    const emptyState    = document.getElementById("vizEmpty");
    if (barsContainer) barsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "";

    // Update info panel
    updateAlgoInfoPanel(algo);
    updateButtons();

    // Reset step counter
    const stepEl = document.getElementById("stepCounter");
    const compEl = document.getElementById("compCounter");
    const swapEl = document.getElementById("swapCounter");
    if (stepEl) stepEl.textContent = "0 / 0";
    if (compEl) compEl.textContent = "0";
    if (swapEl) swapEl.textContent = "0";
    const explEl = document.getElementById("stepExplText");
    if (explEl) explEl.textContent = `Ready to explore ${ALGO_INFO[algo].title}. Enter input and press Play or Next.`;
    const explBar = document.getElementById("explBar");
    if (explBar) explBar.classList.remove("error", "success");

    updateStatusBar(`Algorithm: ${ALGO_INFO[algo].title}`);
  }

  // --- Reset visualization ---
  function resetViz() {
    clearTimer();
    isPlaying = false;
    frames = [];
    currentFrame = 0;
    inputSignature = "";

    const barsContainer = document.getElementById("vizBars");
    const emptyState    = document.getElementById("vizEmpty");
    const binaryInfo    = document.getElementById("searchRangeBar");

    if (barsContainer) barsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "";
    if (binaryInfo) binaryInfo.style.display = "none";

    const explEl = document.getElementById("stepExplText");
    const explBar = document.getElementById("explBar");
    if (explEl) explEl.textContent = "Enter input and click Play to start.";
    if (explBar) explBar.classList.remove("error", "success");

    const stepEl = document.getElementById("stepCounter");
    const compEl = document.getElementById("compCounter");
    const swapEl = document.getElementById("swapCounter");
    if (stepEl) stepEl.textContent = "0 / 0";
    if (compEl) compEl.textContent = "0";
    if (swapEl) swapEl.textContent = "0";

    updateButtons();
    updateStatusBar("Visualization reset.");
  }

  // --- Generate random sort array ---
  function generateRandomArray() {
    const n = 10 + Math.floor(Math.random() * 6);
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
    const input = document.getElementById("arrayInput");
    if (input) input.value = arr.join(", ");
    resetViz();
  }

  function generateRandomSearchArray() {
    const n = 8 + Math.floor(Math.random() * 5);
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1).sort((a,b)=>a-b);
    const uniqueArr = [...new Set(arr)];
    const input = document.getElementById("searchArrayInput");
    if (input) input.value = uniqueArr.join(", ");
    // Pick a random target from the array
    const targetInput = document.getElementById("searchTargetInput");
    if (targetInput) {
      const t = uniqueArr[Math.floor(Math.random() * uniqueArr.length)];
      targetInput.value = t;
    }
    resetViz();
  }

  // --- Info panel update ---
  function updateAlgoInfoPanel(algo) {
    const info = ALGO_INFO[algo];
    if (!info) return;

    const titleEl  = document.getElementById("algoInfoTitle");
    const badgesEl = document.getElementById("complexityRow");
    const stepsEl  = document.getElementById("algoSteps");
    const codeEl   = document.getElementById("algoPseudocode");
    const noteEl   = document.getElementById("algoNote");
    const conceptTitle = document.getElementById("conceptTitle");
    const conceptDesc = document.getElementById("conceptDesc");
    const conceptVisual = document.getElementById("conceptVisual");

    if (titleEl) titleEl.textContent = info.title;
    if (conceptTitle) conceptTitle.textContent = `${info.title}: Core Idea`;
    if (conceptDesc) conceptDesc.textContent = info.definition;
    if (conceptVisual) {
      const diagrams = {
        bubble: "Compare neighbors → swap if needed",
        selection: "Find minimum → place next",
        insertion: "Take next value → insert in order",
        linear: "Check each value from left to right",
        binary: "Check the middle → discard half"
      };
      conceptVisual.textContent = diagrams[algo];
    }

    if (badgesEl) {
      badgesEl.innerHTML = `
        <span class="cx-badge cx-best" title="Best case">Best: ${info.best}</span>
        <span class="cx-badge cx-avg" title="Average case">Avg: ${info.avg}</span>
        <span class="cx-badge cx-worst" title="Worst case">Worst: ${info.worst}</span>
        <span class="cx-badge cx-space" title="Space">Space: ${info.space}</span>
      `;
    }

    if (stepsEl) {
      stepsEl.innerHTML = info.steps.map((step, index) => `<li><span class="step-num">${index + 1}</span>${step}</li>`).join("");
    }
    if (codeEl) codeEl.textContent = info.pseudocode;
    if (noteEl) noteEl.textContent = info.complexityNote;
  }

  // --- Init ---
  function init() {
    // Algorithm tab buttons
    document.querySelectorAll(".algo-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".algo-tab").forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        setAlgorithm(tab.dataset.algo);
      });
    });

    // Playback buttons
    const playPauseBtn = document.getElementById("playPauseBtn");
    const prevStepBtn  = document.getElementById("prevStepBtn");
    const nextStepBtn  = document.getElementById("nextStepBtn");
    const resetVizBtn  = document.getElementById("resetVizBtn");

    if (playPauseBtn) playPauseBtn.addEventListener("click", () => togglePlayPause());
    if (prevStepBtn)  prevStepBtn.addEventListener("click",  () => { pause(); stepBack(); });
    if (nextStepBtn)  nextStepBtn.addEventListener("click",  () => { pause(); stepForward(); });
    if (resetVizBtn)  resetVizBtn.addEventListener("click",  () => resetViz());

    // Sort inputs
    const randomArrayBtn = document.getElementById("randomArrayBtn");
    const resetArrayBtn  = document.getElementById("resetArrayBtn");
    if (randomArrayBtn) randomArrayBtn.addEventListener("click", () => generateRandomArray());
    if (resetArrayBtn)  resetArrayBtn.addEventListener("click",  () => {
      const input = document.getElementById("arrayInput");
      if (input) input.value = "";
      resetViz();
    });

    // Search inputs
    const randomSearchBtn = document.getElementById("randomSearchBtn");
    const resetSearchBtn  = document.getElementById("resetSearchBtn");
    if (randomSearchBtn) randomSearchBtn.addEventListener("click", () => generateRandomSearchArray());
    if (resetSearchBtn)  resetSearchBtn.addEventListener("click",  () => {
      const si = document.getElementById("searchArrayInput");
      const ti = document.getElementById("searchTargetInput");
      if (si) si.value = "";
      if (ti) ti.value = "";
      resetViz();
    });

    // Speed selectors (both sort and search)
    document.querySelectorAll(".speed-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        animationSpeed = parseInt(btn.dataset.speed, 10);
        document.querySelectorAll(".speed-opt").forEach(option => {
          option.classList.toggle("active", option.dataset.speed === btn.dataset.speed);
        });
        updateStatusBar(`Speed set to ${btn.textContent}`);
      });
    });

    // Allow Enter on array input to build + play
    const arrayInput = document.getElementById("arrayInput");
    if (arrayInput) {
      arrayInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { pause(); buildFrames(); play(); }
      });
    }
    ["searchArrayInput", "searchTargetInput"].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          pause();
          buildFrames();
          if (frames.length > 0) play();
        }
      });
    });

    // Initialize with bubble sort info
    updateAlgoInfoPanel("bubble");
    const colorLegend = document.getElementById("colorLegend");
    if (colorLegend) colorLegend.style.display = "flex";
    updateButtons();
    DSTabs.init();
  }

  return { init, pause, play, setAlgorithm, buildFrames, resetViz };
})();


/* ============================================================
   APPLICATION ENTRY POINT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  try {
    NAV.init();
    VizController.init();
    updateStatusBar("DSA Learning Lab loaded. Welcome!");
  } catch(err) {
    console.error("App initialization error:", err);
  }
});
