const incomeBtn = document.getElementById("incomeBtn");
const expenseBtn = document.getElementById("expenseBtn");
const submitBtn = document.getElementById("submit");

const descInput = document.getElementById("description");
const amtInput = document.getElementById("amount");

const list = document.getElementById("list");

const balanceEl = document.getElementById("bal-amt");
const incomeEl = document.getElementById("inc-amt");
const expenseEl = document.getElementById("exp-amt");

let selectedType = "income";
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

incomeBtn.addEventListener("click", () => {
  selectedType = "income";
  incomeBtn.classList.add("active");
  expenseBtn.classList.remove("active");
});

expenseBtn.addEventListener("click", () => {
  selectedType = "expense";
  expenseBtn.classList.add("active");
  incomeBtn.classList.remove("active");
});

submitBtn.addEventListener("click", () => {
  const description = descInput.value.trim();
  const amount = Number(amtInput.value.trim());

  if (!description || !amount) {
    alert("Please enter description and amount!");
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type: selectedType,
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  updateSummary();

  descInput.value = "";
  amtInput.value = "";
});

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((t) => {
    const div = document.createElement("div");
    div.className = "trans " + (t.type === "income" ? "inc" : "exp");

    div.innerHTML = `
      <div class="trans-content">
        <span class="desc">${escapeHtml(t.description)}</span>
        <span class="amt">₹${Number(t.amount).toFixed(2)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete transaction">✖</button>
    `;

    const delBtn = div.querySelector(".delete-btn");

    delBtn.addEventListener("click", () => {
      transactions = transactions.filter((item) => item.id !== t.id);
      saveTransactions();
      renderTransactions();
      updateSummary();
    });

    delBtn.addEventListener("mouseenter", () => div.classList.add("deleting"));
    delBtn.addEventListener("mouseleave", () => div.classList.remove("deleting"));

    list.appendChild(div);
  });
}

function updateSummary() {
  let income = 0,
    expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
    }
  });

  const balance = income - expense;

  balanceEl.textContent = `₹${balance.toFixed(2)}`;
  incomeEl.textContent = `₹${income.toFixed(2)}`;
  expenseEl.textContent = `₹${expense.toFixed(2)}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderTransactions();
updateSummary();
