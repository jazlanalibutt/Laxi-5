// ================= SEARCH BAR =================
let debounceTimer;
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const wordList = document.getElementById("wordList");
const wordCount = document.getElementById("wordCount");
const clearBtn = document.getElementById("clearBtn");

// Smart search function
function smartSearch() {
  const input = searchInput.value.toLowerCase().trim();
  const type = searchType.value;

  if (!input) {
    wordList.innerHTML = '';
    wordCount.textContent = '';
    return;
  }

  const results = words.filter(word => {
    if (type === 'contains') return word.includes(input);
    if (type === 'starts') return word.startsWith(input);
    if (type === 'ends') return word.endsWith(input);
  });

  wordCount.textContent = `Found ${results.length} words`;

  wordList.innerHTML = results
    .slice(0, 1000)
    .map(word => {
      let displayWord = word;
      if (type === 'contains') {
        const regex = new RegExp(`(${input})`, 'gi');
        displayWord = word.replace(regex, '<span class="highlight">$1</span>');
      } else if (type === 'starts') {
        displayWord = `<span class="highlight">${word.slice(0, input.length)}</span>${word.slice(input.length)}`;
      } else if (type === 'ends') {
        displayWord = `${word.slice(0, word.length - input.length)}<span class="highlight">${word.slice(-input.length)}</span>`;
      }
      return `<li>${displayWord}</li>`;
    }).join('');
}

// ================= EVENT LISTENERS =================
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(smartSearch, 200);
});
searchType.addEventListener("change", smartSearch);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  wordList.innerHTML = "";
  wordCount.textContent = "";
  searchInput.focus();
});

// Copy word to clipboard with toast
const toast = document.createElement("div");
toast.id = "copyToast";
toast.textContent = "Copied!";
toast.style.cssText = `
  position: fixed; bottom: 30px; right: 30px;
  background: #111; color: #fff; padding: 10px 18px;
  border-radius: 8px; opacity: 0; transform: translateY(20px);
  transition: 0.3s ease; pointer-events: none;
`;
document.body.appendChild(toast);

wordList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    navigator.clipboard.writeText(e.target.textContent).then(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
      }, 1500);
    });
  }
});

// Clear search on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    wordList.innerHTML = "";
    wordCount.textContent = "";
  }
});

// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("themeToggle");

// Initialize theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
} else {
  document.body.classList.remove("dark");
  themeToggle.textContent = "🌙";
}

// Toggle dark/light theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});
// ================= SUBSCRIBE TOAST =================
const subscribeToast = document.createElement("div");
subscribeToast.id = "subscribeToast";
subscribeToast.textContent = "Subscribed!";
subscribeToast.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  opacity: 0;
  transform: translateY(20px);
  transition: 0.3s ease;
  pointer-events: none;
  z-index: 1000;
  color: white;
  background: #2563eb; /* default for light mode */
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
`;
document.body.appendChild(subscribeToast);

// Function to show toast with theme check
function showSubscribeToast() {
  if (document.body.classList.contains("light-mode")) {
    subscribeToast.style.background = "#2563eb"; // blue for light mode
    subscribeToast.style.color = "#fff";
  } else {
    subscribeToast.style.background = "#1e293b"; // dark gray for dark mode
    subscribeToast.style.color = "#cbd5e1";
  }

  subscribeToast.style.opacity = "1";
  subscribeToast.style.transform = "translateY(0)";
  setTimeout(() => {
    subscribeToast.style.opacity = "0";
    subscribeToast.style.transform = "translateY(20px)";
  }, 1800);
}

// Attach to newsletter subscribe button
const subscribeBtn = document.querySelector(".newsletter button");
subscribeBtn.addEventListener("click", () => {
  const emailInput = document.querySelector(".newsletter input");
  if (emailInput.value.trim() !== "") {
    // Here you can also send email to backend or API
    emailInput.value = ""; // clear input
    showSubscribeToast();
  } else {
    emailInput.focus();
  }
});