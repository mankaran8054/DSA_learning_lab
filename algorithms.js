/**
 * algorithms.js
 * Implements sorting and searching algorithms as step generators.
 * Each function returns an array of "frames" — snapshots of state
 * at each meaningful step — rather than mutating state during playback.
 *
 * A frame object contains:
 *   { array, highlights: {comparing:[], swapping:[], sorted:[], current:[]},
 *     explanation, comparisons, swaps }
 */

"use strict";

/* ============================================================
   ALGORITHM METADATA
   Used to populate the info panel.
   ============================================================ */
const ALGO_INFO = {
  bubble: {
    title: "Bubble Sort",
    definition: "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. Each pass bubbles the largest unsorted element to its correct position.",
    steps: [
      "Start from the first element.",
      "Compare the current element with the next.",
      "If current > next, swap them.",
      "Move to the next pair.",
      "After each full pass, the largest unsorted element is in its final position.",
      "Repeat until no swaps occur in a pass (array is sorted)."
    ],
    best:  "O(n) — already sorted array",
    avg:   "O(n²)",
    worst: "O(n²) — reverse sorted array",
    space: "O(1) — in-place",
    pseudocode:
`for i = 0 to n-1:
  swapped = false
  for j = 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
      swapped = true
  if not swapped: break`,
    complexityNote: "Bubble Sort is O(n²) in average and worst cases because for each of the n elements we may do up to n comparisons. The best case is O(n) with an early-exit flag: if a complete pass makes no swaps, the array is already sorted. Space is O(1) because we sort in-place with only a flag variable."
  },

  selection: {
    title: "Selection Sort",
    definition: "Selection Sort divides the array into a sorted and an unsorted region. In each pass, it finds the minimum element in the unsorted region and swaps it into the correct position.",
    steps: [
      "Start with the full array as unsorted.",
      "Find the minimum element in the unsorted region.",
      "Swap it with the first element of the unsorted region.",
      "Expand the sorted region by one.",
      "Repeat until the entire array is sorted."
    ],
    best:  "O(n²) — always performs the same number of comparisons",
    avg:   "O(n²)",
    worst: "O(n²)",
    space: "O(1) — in-place",
    pseudocode:
`for i = 0 to n-1:
  minIdx = i
  for j = i+1 to n-1:
    if arr[j] < arr[minIdx]:
      minIdx = j
  swap(arr[i], arr[minIdx])`,
    complexityNote: "Selection Sort always performs exactly n(n-1)/2 comparisons regardless of the initial order, so it is always O(n²). It performs at most n-1 swaps, which can be an advantage when writes are expensive. Space is O(1)."
  },

  insertion: {
    title: "Insertion Sort",
    definition: "Insertion Sort builds a sorted sub-array one element at a time. It picks each element and inserts it into its correct position in the already-sorted portion, shifting larger elements right.",
    steps: [
      "Consider the first element as a sorted sub-array of size 1.",
      "Pick the next element (the 'key').",
      "Compare the key with elements in the sorted portion, moving right-to-left.",
      "Shift each element that is greater than the key one position to the right.",
      "Insert the key into the gap left.",
      "Repeat for all remaining elements."
    ],
    best:  "O(n) — already sorted array",
    avg:   "O(n²)",
    worst: "O(n²) — reverse sorted array",
    space: "O(1) — in-place",
    pseudocode:
`for i = 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
    complexityNote: "Insertion Sort is O(n²) in average and worst cases but O(n) for nearly sorted data, making it practical for small or almost-sorted arrays. Like Bubble Sort, it is stable (equal elements preserve their original order). Space is O(1)."
  },

  linear: {
    title: "Linear Search",
    definition: "Linear Search sequentially checks each element in a list until the target is found or the list is exhausted. It works on both sorted and unsorted arrays.",
    steps: [
      "Start at the first element (index 0).",
      "Compare the current element with the target.",
      "If they match, return the current index.",
      "Otherwise, move to the next element.",
      "If the end of the array is reached, the target is not present."
    ],
    best:  "O(1) — target is the first element",
    avg:   "O(n)",
    worst: "O(n) — target is last or absent",
    space: "O(1)",
    pseudocode:
`for i = 0 to n-1:
  if arr[i] == target:
    return i
return -1`,
    complexityNote: "Linear Search checks up to n elements in the worst case, so it is O(n). No pre-sorting is needed. For small lists or unsorted data, it is simple and effective. For large sorted data, Binary Search is much faster."
  },

  binary: {
    title: "Binary Search",
    definition: "Binary Search works on a sorted array by repeatedly halving the search range. It compares the target with the middle element and eliminates half the remaining elements at each step.",
    steps: [
      "Ensure the array is sorted.",
      "Set low = 0, high = n-1.",
      "Calculate mid = (low + high) / 2.",
      "If arr[mid] == target, return mid.",
      "If arr[mid] < target, set low = mid + 1.",
      "If arr[mid] > target, set high = mid - 1.",
      "Repeat until low > high (target not found)."
    ],
    best:  "O(1) — target is the middle element",
    avg:   "O(log n)",
    worst: "O(log n) — target absent or at extremes",
    space: "O(1) — iterative",
    pseudocode:
`low = 0; high = n-1
while low <= high:
  mid = (low + high) / 2
  if arr[mid] == target:
    return mid
  elif arr[mid] < target:
    low = mid + 1
  else:
    high = mid - 1
return -1`,
    complexityNote: "Each comparison halves the search space, giving O(log n) time. For 1,000 elements the worst case is only ~10 comparisons; for 1,000,000 it's ~20. The array MUST be sorted first. The iterative version uses O(1) space; a recursive version uses O(log n) stack space."
  }
};


/* ============================================================
   HELPER: Deep-clone array state for a frame
   ============================================================ */
function makeFrame(arr, highlights, explanation, comparisons, swaps) {
  return {
    array: [...arr],
    highlights: {
      comparing: highlights.comparing ? [...highlights.comparing] : [],
      swapping:  highlights.swapping  ? [...highlights.swapping]  : [],
      sorted:    highlights.sorted    ? [...highlights.sorted]     : [],
      current:   highlights.current   ? [...highlights.current]   : []
    },
    explanation,
    comparisons: comparisons || 0,
    swaps: swaps || 0
  };
}


/* ============================================================
   BUBBLE SORT
   Returns an array of frames.
   ============================================================ */
function bubbleSortFrames(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  const sorted = [];
  let comparisons = 0;
  let swaps = 0;

  // Initial frame
  frames.push(makeFrame(arr, { sorted }, "Starting Bubble Sort. We will compare adjacent pairs and bubble up larger elements.", comparisons, swaps));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      // Comparison frame
      frames.push(makeFrame(arr, { comparing: [j, j+1], sorted },
        `Pass ${i+1}: Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}.`, comparisons, swaps));

      if (arr[j] > arr[j+1]) {
        swaps++;
        // Swap frame
        frames.push(makeFrame(arr, { swapping: [j, j+1], sorted },
          `arr[${j}]=${arr[j]} > arr[${j+1}]=${arr[j+1]}. Swapping them!`, comparisons, swaps));
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        // After swap
        frames.push(makeFrame(arr, { comparing: [j, j+1], sorted },
          `Swapped! arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}.`, comparisons, swaps));
        swapped = true;
      } else {
        frames.push(makeFrame(arr, { comparing: [j, j+1], sorted },
          `arr[${j}]=${arr[j]} ≤ arr[${j+1}]=${arr[j+1]}. No swap needed.`, comparisons, swaps));
      }
    }
    // Mark last element of this pass as sorted
    sorted.unshift(n - i - 1);
    frames.push(makeFrame(arr, { sorted },
      `End of pass ${i+1}. Element ${arr[n-i-1]} is now in its final position.`, comparisons, swaps));

    if (!swapped) {
      // Early exit
      for (let k = 0; k < n - i - 1; k++) sorted.unshift(k);
      frames.push(makeFrame(arr, { sorted: [...Array(n).keys()] },
        `No swaps in this pass — array is already sorted! Early exit.`, comparisons, swaps));
      break;
    }
  }

  // Final sorted state
  const allSorted = [...Array(n).keys()];
  frames.push(makeFrame(arr, { sorted: allSorted },
    `Bubble Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`, comparisons, swaps));

  return frames;
}


/* ============================================================
   SELECTION SORT
   ============================================================ */
function selectionSortFrames(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  const sortedSet = [];
  let comparisons = 0;
  let swaps = 0;

  frames.push(makeFrame(arr, { sorted: sortedSet },
    "Starting Selection Sort. We will repeatedly find the minimum in the unsorted region.", comparisons, swaps));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    frames.push(makeFrame(arr, { current: [i], sorted: [...sortedSet] },
      `Pass ${i+1}: Looking for the minimum element from index ${i} to ${n-1}. Current min: arr[${i}]=${arr[i]}.`, comparisons, swaps));

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      frames.push(makeFrame(arr, { comparing: [minIdx, j], current: [minIdx], sorted: [...sortedSet] },
        `Comparing current min arr[${minIdx}]=${arr[minIdx]} with arr[${j}]=${arr[j]}.`, comparisons, swaps));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        frames.push(makeFrame(arr, { current: [minIdx], sorted: [...sortedSet] },
          `New minimum found! arr[${minIdx}]=${arr[minIdx]}.`, comparisons, swaps));
      }
    }

    if (minIdx !== i) {
      swaps++;
      frames.push(makeFrame(arr, { swapping: [i, minIdx], sorted: [...sortedSet] },
        `Swapping minimum arr[${minIdx}]=${arr[minIdx]} into position ${i}.`, comparisons, swaps));
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      frames.push(makeFrame(arr, { sorted: [...sortedSet] },
        `Swapped! arr[${i}]=${arr[i]} is now in its final position.`, comparisons, swaps));
    } else {
      frames.push(makeFrame(arr, { sorted: [...sortedSet] },
        `arr[${i}]=${arr[i]} is already the minimum — no swap needed.`, comparisons, swaps));
    }

    sortedSet.push(i);
    frames.push(makeFrame(arr, { sorted: [...sortedSet] },
      `Position ${i} is finalized with value ${arr[i]}.`, comparisons, swaps));
  }

  sortedSet.push(n - 1);
  frames.push(makeFrame(arr, { sorted: [...Array(n).keys()] },
    `Selection Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`, comparisons, swaps));

  return frames;
}


/* ============================================================
   INSERTION SORT
   ============================================================ */
function insertionSortFrames(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  let swaps = 0;

  frames.push(makeFrame(arr, { sorted: [0] },
    "Starting Insertion Sort. Index 0 is trivially sorted. We'll insert each subsequent element into its correct position.", comparisons, swaps));

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    const sortedIndices = [...Array(i).keys()];

    frames.push(makeFrame(arr, { current: [i], sorted: sortedIndices },
      `Picking arr[${i}]=${key} as the key element to insert into the sorted portion.`, comparisons, swaps));

    while (j >= 0 && arr[j] > key) {
      comparisons++;
      frames.push(makeFrame(arr, { comparing: [j, j+1], sorted: sortedIndices },
        `arr[${j}]=${arr[j]} > key=${key}. Shifting arr[${j}] right to make room.`, comparisons, swaps));
      arr[j + 1] = arr[j];
      swaps++;
      frames.push(makeFrame(arr, { swapping: [j, j+1], sorted: sortedIndices },
        `Shifted arr[${j}]=${arr[j]} to position ${j+1}.`, comparisons, swaps));
      j--;
    }
    if (j >= 0) {
      comparisons++;
      frames.push(makeFrame(arr, { comparing: [j, j+1], sorted: sortedIndices },
        `arr[${j}]=${arr[j]} ≤ key=${key}. Correct position found: index ${j+1}.`, comparisons, swaps));
    }

    arr[j + 1] = key;
    const newSorted = [...Array(i + 1).keys()];
    frames.push(makeFrame(arr, { sorted: newSorted, current: [j+1] },
      `Inserted key=${key} at index ${j+1}. Sorted portion is now indices 0–${i}.`, comparisons, swaps));
  }

  frames.push(makeFrame(arr, { sorted: [...Array(n).keys()] },
    `Insertion Sort complete! Total comparisons: ${comparisons}, swaps: ${swaps}.`, comparisons, swaps));

  return frames;
}


/* ============================================================
   LINEAR SEARCH
   Returns frames for search visualization.
   Each frame: { array, target, highlights: {current, found, checked:[]},
     explanation, comparisons, foundAt }
   ============================================================ */
function linearSearchFrames(inputArr, target) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  const checked = [];

  frames.push({
    array: [...arr], target,
    highlights: { current: -1, found: -1, checked: [] },
    explanation: `Linear Search for target=${target}. We check each element from left to right.`,
    comparisons: 0, foundAt: -1, done: false
  });

  for (let i = 0; i < n; i++) {
    comparisons++;
    frames.push({
      array: [...arr], target,
      highlights: { current: i, found: -1, checked: [...checked] },
      explanation: `Checking index ${i}: arr[${i}]=${arr[i]}. Is it equal to ${target}?`,
      comparisons, foundAt: -1, done: false
    });

    if (arr[i] === target) {
      frames.push({
        array: [...arr], target,
        highlights: { current: -1, found: i, checked: [...checked] },
        explanation: `✅ Found! arr[${i}]=${arr[i]} equals target ${target}. Search complete in ${comparisons} comparison${comparisons>1?'s':''}.`,
        comparisons, foundAt: i, done: true
      });
      return frames;
    }

    checked.push(i);
    frames.push({
      array: [...arr], target,
      highlights: { current: -1, found: -1, checked: [...checked] },
      explanation: `arr[${i}]=${arr[i]} ≠ ${target}. Moving to next element.`,
      comparisons, foundAt: -1, done: false
    });
  }

  frames.push({
    array: [...arr], target,
    highlights: { current: -1, found: -1, checked: [...checked] },
    explanation: `❌ Target ${target} was not found in the array after ${comparisons} comparison${comparisons>1?'s':''}.`,
    comparisons, foundAt: -1, done: true
  });
  return frames;
}


/* ============================================================
   BINARY SEARCH
   Requires sorted array. Will sort internally and note it.
   ============================================================ */
function binarySearchFrames(inputArr, target) {
  // Sort and remember original
  const arr = [...inputArr].sort((a, b) => a - b);
  const wasSorted = inputArr.every((v, i) => i === 0 || inputArr[i-1] <= v);
  const n = arr.length;
  const frames = [];
  let comparisons = 0;
  let low = 0;
  let high = n - 1;

  const noteSort = wasSorted ? "" : " (Array has been sorted for Binary Search.)";
  frames.push({
    array: [...arr], target,
    highlights: { current: -1, found: -1, eliminated: [], low: 0, high: n-1, mid: -1 },
    explanation: `Binary Search for target=${target}.${noteSort} Initial range: [0, ${n-1}].`,
    comparisons: 0, foundAt: -1, done: false, low, high, mid: -1, eliminated: []
  });

  const eliminated = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;

    frames.push({
      array: [...arr], target,
      highlights: { current: mid, found: -1, eliminated: [...eliminated], low, high, mid },
      explanation: `Range [${low}, ${high}]. Mid = (${low}+${high})/2 = ${mid}. Checking arr[${mid}]=${arr[mid]}.`,
      comparisons, foundAt: -1, done: false, low, high, mid, eliminated: [...eliminated]
    });

    if (arr[mid] === target) {
      frames.push({
        array: [...arr], target,
        highlights: { current: -1, found: mid, eliminated: [...eliminated], low, high, mid },
        explanation: `✅ Found! arr[${mid}]=${arr[mid]} equals target ${target}. Found in ${comparisons} comparison${comparisons>1?'s':''}.`,
        comparisons, foundAt: mid, done: true, low, high, mid, eliminated: [...eliminated]
      });
      return frames;
    } else if (arr[mid] < target) {
      // Eliminate left half
      for (let k = low; k <= mid; k++) eliminated.push(k);
      frames.push({
        array: [...arr], target,
        highlights: { current: -1, found: -1, eliminated: [...eliminated], low: mid+1, high, mid },
        explanation: `arr[${mid}]=${arr[mid]} < ${target}. Target is in the right half. Eliminating indices ${low}–${mid}. New range: [${mid+1}, ${high}].`,
        comparisons, foundAt: -1, done: false, low: mid+1, high, mid, eliminated: [...eliminated]
      });
      low = mid + 1;
    } else {
      // Eliminate right half
      for (let k = mid; k <= high; k++) eliminated.push(k);
      frames.push({
        array: [...arr], target,
        highlights: { current: -1, found: -1, eliminated: [...eliminated], low, high: mid-1, mid },
        explanation: `arr[${mid}]=${arr[mid]} > ${target}. Target is in the left half. Eliminating indices ${mid}–${high}. New range: [${low}, ${mid-1}].`,
        comparisons, foundAt: -1, done: false, low, high: mid-1, mid, eliminated: [...eliminated]
      });
      high = mid - 1;
    }
  }

  frames.push({
    array: [...arr], target,
    highlights: { current: -1, found: -1, eliminated: [...Array(n).keys()], low, high, mid: -1 },
    explanation: `❌ Target ${target} is not in the array. Search space is empty after ${comparisons} comparison${comparisons>1?'s':''}.`,
    comparisons, foundAt: -1, done: true, low, high, mid: -1, eliminated: [...Array(n).keys()]
  });
  return frames;
}

