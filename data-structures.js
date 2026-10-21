/**
 * data-structures.js
 * Interactive Stack, Queue, and Linked List implementations with DOM visualization.
 * Each operation animates the visual representation and shows a result message.
 */

"use strict";

/* ============================================================
   STACK
   ============================================================ */
const Stack = (() => {
  const MAX_SIZE = 15;
  let items = [];

  function setResult(msg, type = "") {
    const el = document.getElementById("stackResult");
    if (!el) return;
    el.textContent = msg;
    const resultType = { error: "err", success: "ok", info: "inf" }[type] || "";
    el.className = "glass-inner ds-result" + (resultType ? " " + resultType : "");
  }

  function updateSizeDisplay() {
    const el = document.getElementById("stackSize");
    if (el) el.textContent = items.length;
  }

  function render(highlightTop = false, removingTop = false) {
    const container = document.getElementById("stackViz");
    if (!container) return;
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = '<div class="ds-empty">Stack is empty</div>';
      return;
    }

    // Display top-to-bottom (index = last item first)
    items.slice().reverse().forEach((val, revIdx) => {
      const isTop = revIdx === 0;
      const block = document.createElement("div");
      block.className = "stack-block" + (isTop ? " top" : "");

      if (isTop && removingTop) block.classList.add("removing");

      const valSpan = document.createElement("span");
      valSpan.textContent = val;

      const label = document.createElement("span");
      label.className = "stack-top-badge";
      label.textContent = isTop ? "TOP" : "";

      block.appendChild(valSpan);
      block.appendChild(label);
      container.appendChild(block);
    });
  }

  function push(val) {
    if (val === null || val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    if (items.length >= MAX_SIZE) {
      setResult(`❌ Stack is full (capacity: ${MAX_SIZE}). Pop an element first.`, "error"); return;
    }
    items.push(Number(val));
    render();
    updateSizeDisplay();
    setResult(`✅ Pushed ${val} onto the stack. Size: ${items.length}.`, "success");
  }

  function pop() {
    if (items.length === 0) {
      setResult("❌ Stack Underflow! Cannot pop from an empty stack.", "error"); return null;
    }
    const val = items.pop();
    render();
    updateSizeDisplay();
    setResult(`Popped ${val} from the stack. Size: ${items.length}.`, "success");
    return val;
  }

  function peek() {
    if (items.length === 0) {
      setResult("❌ Stack is empty. Nothing to peek at.", "error"); return null;
    }
    const val = items[items.length - 1];
    render(true);
    setResult(`👁 Top of stack: ${val}. Size unchanged: ${items.length}.`, "info");
    return val;
  }

  function clear() {
    items = [];
    render();
    updateSizeDisplay();
    setResult("🗑 Stack cleared.", "");
  }

  function init() {
    const pushBtn  = document.getElementById("stackPushBtn");
    const popBtn   = document.getElementById("stackPopBtn");
    const peekBtn  = document.getElementById("stackPeekBtn");
    const clearBtn = document.getElementById("stackClearBtn");
    const input    = document.getElementById("stackInput");

    if (!pushBtn) return;

    pushBtn.addEventListener("click", () => {
      push(input.value.trim());
      input.value = "";
    });
    popBtn.addEventListener("click", () => pop());
    peekBtn.addEventListener("click", () => peek());
    clearBtn.addEventListener("click", () => clear());

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { push(input.value.trim()); input.value = ""; }
    });

    render();
  }

  return { init, push, pop, peek, clear };
})();


/* ============================================================
   QUEUE
   ============================================================ */
const Queue = (() => {
  const MAX_SIZE = 10;
  let items = [];

  function setResult(msg, type = "") {
    const el = document.getElementById("queueResult");
    if (!el) return;
    el.textContent = msg;
    const resultType = { error: "err", success: "ok", info: "inf" }[type] || "";
    el.className = "glass-inner ds-result" + (resultType ? " " + resultType : "");
  }

  function updateSizeDisplay() {
    const el = document.getElementById("queueSize");
    if (el) el.textContent = items.length;
  }

  function render() {
    const container = document.getElementById("queueViz");
    if (!container) return;
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = '<div class="ds-empty">Queue is empty</div>';
      return;
    }

    items.forEach((val, idx) => {
      if (idx > 0) {
        const arrow = document.createElement("span");
        arrow.className = "q-arrow";
        arrow.textContent = "→";
        container.appendChild(arrow);
      }

      const block = document.createElement("div");
      const isFront = idx === 0;
      const isBack  = idx === items.length - 1;
      block.className = "queue-block" + (isFront ? " front" : "") + (isBack && !isFront ? " rear" : "");

      const valSpan = document.createElement("div");
      valSpan.textContent = val;

      const label = document.createElement("div");
      label.className = "q-label";
      label.textContent = isFront ? "FRONT" : (isBack ? "REAR" : "");

      block.appendChild(valSpan);
      block.appendChild(label);
      container.appendChild(block);
    });
  }

  function enqueue(val) {
    if (val === null || val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    if (items.length >= MAX_SIZE) {
      setResult(`❌ Queue is full (capacity: ${MAX_SIZE}). Dequeue first.`, "error"); return;
    }
    items.push(Number(val));
    render();
    updateSizeDisplay();
    setResult(`✅ Enqueued ${val} at the rear. Size: ${items.length}.`, "success");
  }

  function dequeue() {
    if (items.length === 0) {
      setResult("❌ Queue Underflow! Cannot dequeue from an empty queue.", "error"); return null;
    }
    const val = items.shift();
    render();
    updateSizeDisplay();
    setResult(`✅ Dequeued ${val} from the front. Size: ${items.length}.`, "success");
    return val;
  }

  function peek() {
    if (items.length === 0) {
      setResult("❌ Queue is empty. Nothing to peek at.", "error"); return null;
    }
    const val = items[0];
    setResult(`👁 Front of queue: ${val}. Size unchanged: ${items.length}.`, "info");
    return val;
  }

  function clear() {
    items = [];
    render();
    updateSizeDisplay();
    setResult("🗑 Queue cleared.", "");
  }

  function init() {
    const enqBtn   = document.getElementById("queueEnqBtn");
    const deqBtn   = document.getElementById("queueDeqBtn");
    const peekBtn  = document.getElementById("queuePeekBtn");
    const clearBtn = document.getElementById("queueClearBtn");
    const input    = document.getElementById("queueInput");

    if (!enqBtn) return;

    enqBtn.addEventListener("click", () => {
      enqueue(input.value.trim());
      input.value = "";
    });
    deqBtn.addEventListener("click", () => dequeue());
    peekBtn.addEventListener("click", () => peek());
    clearBtn.addEventListener("click", () => clear());

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { enqueue(input.value.trim()); input.value = ""; }
    });

    render();
  }

  return { init, enqueue, dequeue, peek, clear };
})();


/* ============================================================
   LINKED LIST (Singly)
   ============================================================ */
const LinkedList = (() => {
  // Each node: { val, next: node | null }
  let head = null;
  let size = 0;

  function setResult(msg, type = "") {
    const el = document.getElementById("llResult");
    if (!el) return;
    el.textContent = msg;
    const resultType = { error: "err", success: "ok", info: "inf" }[type] || "";
    el.className = "glass-inner ds-result" + (resultType ? " " + resultType : "");
  }

  function updateSizeDisplay() {
    const el = document.getElementById("llSize");
    if (el) el.textContent = size;
  }

  /** Convert linked list to array for rendering */
  function toArray() {
    const arr = [];
    let cur = head;
    while (cur) { arr.push(cur.val); cur = cur.next; }
    return arr;
  }

  /** Render the linked list with optional highlighted index */
  function render(highlightIndex = -1, foundIndex = -1) {
    const container = document.getElementById("llViz");
    if (!container) return;
    container.innerHTML = "";

    const arr = toArray();
    if (arr.length === 0) {
      container.innerHTML = '<div class="ds-empty">Linked list is empty</div>';
      return;
    }

    // HEAD label
    const headLabel = document.createElement("span");
    headLabel.className = "ll-head-label";
    headLabel.textContent = "HEAD";
    container.appendChild(headLabel);

    arr.forEach((val, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "ll-node-wrap";

      // Arrow before node (except first after HEAD label)
      if (idx > 0) {
        const arrow = document.createElement("div");
        arrow.className = "ll-arrow-sym";
        arrow.textContent = "→";
        wrap.appendChild(arrow);
      } else {
        const arrow = document.createElement("div");
        arrow.className = "ll-arrow-sym";
        arrow.textContent = "→";
        wrap.appendChild(arrow);
      }

      const nodeDiv = document.createElement("div");
      nodeDiv.className = "ll-node";

      const box = document.createElement("div");
      box.className = "ll-node-box";
      if (idx === highlightIndex) box.classList.add("hl");
      if (idx === foundIndex) box.classList.add("found-hl");

      const valDiv = document.createElement("div");
      valDiv.className = "ll-val";
      valDiv.textContent = val;

      const nextDiv = document.createElement("div");
      nextDiv.className = "ll-ptr";
      nextDiv.textContent = idx < arr.length - 1 ? "→" : "∅";

      box.appendChild(valDiv);
      box.appendChild(nextDiv);

      const indexDiv = document.createElement("div");
      indexDiv.className = "ll-idx";
      indexDiv.textContent = `[${idx}]`;

      nodeDiv.appendChild(box);
      nodeDiv.appendChild(indexDiv);
      wrap.appendChild(nodeDiv);
      container.appendChild(wrap);
    });

    // NULL tail
    const nullSpan = document.createElement("span");
    nullSpan.className = "ll-null";
    nullSpan.textContent = "NULL";
    container.appendChild(nullSpan);
  }

  function insertBegin(val) {
    if (val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    const node = { val: Number(val), next: head };
    head = node;
    size++;
    render(0);
    updateSizeDisplay();
    setResult(`✅ Inserted ${val} at the beginning. New HEAD. Size: ${size}.`, "success");
  }

  function insertEnd(val) {
    if (val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    const node = { val: Number(val), next: null };
    if (!head) {
      head = node;
    } else {
      let cur = head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    size++;
    render(size - 1);
    updateSizeDisplay();
    setResult(`✅ Inserted ${val} at the end (index ${size-1}). Size: ${size}.`, "success");
  }

  function insertAt(val, index) {
    if (val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    const idx = index === "" ? NaN : Number(index);
    if (!Number.isSafeInteger(idx) || idx < 0 || idx > size) {
      setResult(`❌ Invalid index ${index}. Valid range: 0 to ${size}.`, "error"); return;
    }
    if (idx === 0) { insertBegin(val); return; }
    if (idx === size) { insertEnd(val); return; }

    const node = { val: Number(val), next: null };
    let cur = head;
    for (let i = 0; i < idx - 1; i++) cur = cur.next;
    node.next = cur.next;
    cur.next = node;
    size++;
    render(idx);
    updateSizeDisplay();
    setResult(`✅ Inserted ${val} at index ${idx}. Size: ${size}.`, "success");
  }

  function deleteByValue(val) {
    if (val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    const target = Number(val);
    if (!head) {
      setResult("❌ Linked list is empty.", "error"); return;
    }

    if (head.val === target) {
      head = head.next;
      size--;
      render();
      updateSizeDisplay();
      setResult(`✅ Deleted ${target} from the beginning. Size: ${size}.`, "success");
      return;
    }

    let cur = head;
    while (cur.next && cur.next.val !== target) cur = cur.next;
    if (!cur.next) {
      setResult(`❌ Value ${target} not found in the list.`, "error"); return;
    }
    cur.next = cur.next.next;
    size--;
    render();
    updateSizeDisplay();
    setResult(`✅ Deleted ${target} from the list. Size: ${size}.`, "success");
  }

  function search(val) {
    if (val === "" || !Number.isSafeInteger(Number(val))) {
      setResult("Please enter a valid integer.", "error"); return;
    }
    const target = Number(val);
    let cur = head;
    let idx = 0;
    while (cur) {
      if (cur.val === target) {
        render(-1, idx);
        setResult(`🔍 Found ${target} at index ${idx}!`, "info");
        return idx;
      }
      cur = cur.next;
      idx++;
    }
    setResult(`❌ Value ${target} not found in the list.`, "error");
    return -1;
  }

  function clear() {
    head = null;
    size = 0;
    render();
    updateSizeDisplay();
    setResult("🗑 Linked list cleared.", "");
  }

  function init() {
    const llInsertBeginBtn = document.getElementById("llInsertBeginBtn");
    const llInsertEndBtn   = document.getElementById("llInsertEndBtn");
    const llInsertAtBtn    = document.getElementById("llInsertAtBtn");
    const llDeleteBtn      = document.getElementById("llDeleteBtn");
    const llSearchBtn      = document.getElementById("llSearchBtn");
    const llClearBtn       = document.getElementById("llClearBtn");
    const llInput          = document.getElementById("llInput");
    const llIndex          = document.getElementById("llIndex");

    if (!llInsertBeginBtn) return;

    llInsertBeginBtn.addEventListener("click", () => { insertBegin(llInput.value.trim()); llInput.value = ""; });
    llInsertEndBtn.addEventListener("click",   () => { insertEnd(llInput.value.trim());   llInput.value = ""; });
    llInsertAtBtn.addEventListener("click",    () => { insertAt(llInput.value.trim(), llIndex.value.trim()); llInput.value = ""; llIndex.value = ""; });
    llDeleteBtn.addEventListener("click",      () => { deleteByValue(llInput.value.trim()); llInput.value = ""; });
    llSearchBtn.addEventListener("click",      () => { search(llInput.value.trim()); });
    llClearBtn.addEventListener("click",       () => clear());

    llInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { insertEnd(llInput.value.trim()); llInput.value = ""; }
    });

    render();
  }

  return { init, insertBegin, insertEnd, insertAt, deleteByValue, search, clear };
})();