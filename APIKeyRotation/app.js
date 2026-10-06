const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const backdrop = document.getElementById("backdrop");
const dialog = document.getElementById("dialog");
const confirmStep = document.getElementById("confirm-step");
const successStep = document.getElementById("success-step");
const newKeyInput = document.getElementById("new-key");
const maskedKey = document.getElementById("masked-key");
const keyCreated = document.getElementById("key-created");
const copyNew = document.getElementById("copy-new");
const copyTooltip = document.getElementById("copy-tooltip");

let currentKey = "09yWmomSVrJFdeTSJ37cQblSt3nHkrKj";
let generatedKey = "";
let lastFocus = null;

function generateKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
  return `be_live_${body}`;
}

function maskKey(key) {
  if (key.length <= 10) return key;
  return `${key.slice(0, 10)}••••••••••••••••••`;
}

function formatCreated(date) {
  return `Created on ${date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function setStep(step) {
  const showingSuccess = step === "success";
  confirmStep.hidden = showingSuccess;
  successStep.hidden = !showingSuccess;
  dialog.setAttribute("aria-labelledby", showingSuccess ? "success-title" : "dialog-title");
  dialog.setAttribute("aria-describedby", showingSuccess ? "success-desc" : "dialog-desc");
}

function openDialog() {
  lastFocus = document.activeElement;
  document.querySelector('input[name="old-key-handling"][value="grace"]').checked = true;
  resetCopyButton();
  setStep("confirm");
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  dialog.focus();
}

function closeDialog() {
  backdrop.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function resetCopyButton() {
  copyTooltip.textContent = "Copy";
  copyNew.setAttribute("aria-label", "Copy");
}

async function copyText(value, button) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  if (button) {
    const previous = button.getAttribute("aria-label");
    button.setAttribute("aria-label", "Copied");
    window.setTimeout(() => {
      if (previous) button.setAttribute("aria-label", previous);
    }, 1600);
  }
}

const rail = document.getElementById("rail");
const productMenu = document.getElementById("product-menu");
const productToggle = document.getElementById("product-toggle");
const productName = document.getElementById("product-name");
const productChevron = document.getElementById("product-chevron");

function setProductOpen(open) {
  productMenu.hidden = !open;
  productToggle.setAttribute("aria-expanded", String(open));
  productChevron.textContent = open ? "keyboard_arrow_up" : "keyboard_arrow_down";
  rail.classList.toggle("is-open", open);
}

productToggle.addEventListener("click", () => {
  setProductOpen(productMenu.hidden);
});

document.querySelectorAll(".product-option").forEach((option) => {
  option.addEventListener("click", () => {
    productName.textContent = option.dataset.product;
    document.querySelectorAll(".product-option").forEach((item) => {
      item.querySelector(".product-check").textContent = item === option ? "check" : "";
    });
    setProductOpen(false);
  });
});

document.querySelectorAll(".rail-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".rail-item").forEach((entry) => {
      entry.classList.toggle("is-active", entry === item);
    });
    document.getElementById("topnav-title").textContent = item.dataset.title;
  });
});

document.addEventListener("mousedown", (event) => {
  if (!document.getElementById("rail-brand").contains(event.target)) setProductOpen(false);
});

document.getElementById("open-rotate").addEventListener("click", openDialog);

if (location.hash === "#rotate") openDialog();
if (location.hash === "#rotated") {
  generatedKey = generateKey();
  newKeyInput.value = generatedKey;
  openDialog();
  setStep("success");
}

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", closeDialog);
});

document.getElementById("done").addEventListener("click", () => {
  if (generatedKey) {
    currentKey = generatedKey;
    maskedKey.textContent = maskKey(generatedKey);
    keyCreated.textContent = formatCreated(new Date());
  }
  closeDialog();
});

document.getElementById("confirm-rotate").addEventListener("click", () => {
  generatedKey = generateKey();
  newKeyInput.value = generatedKey;
  resetCopyButton();
  setStep("success");
  copyNew.focus();
});

copyNew.addEventListener("click", async () => {
  await copyText(generatedKey);
  copyTooltip.textContent = "Copied";
  copyNew.setAttribute("aria-label", "Copied");
});

copyNew.addEventListener("mouseleave", resetCopyButton);
copyNew.addEventListener("blur", resetCopyButton);

document.getElementById("copy-current").addEventListener("click", (event) => {
  copyText(currentKey, event.currentTarget);
});

document.querySelector("[data-copy]").addEventListener("click", (event) => {
  copyText(event.currentTarget.dataset.copy, event.currentTarget);
});

const alertEmails = [
  "ashish.garg@birdeye.com",
  "aparg9582@gmail.com",
  "yogesh.sharma@birdeye.com",
  "rakesh.dwivedi@birdeye.com",
  "koushal.goyal@birdeye.com",
];
const emailChips = document.getElementById("email-chips");
const alertEmailInput = document.getElementById("alert-email");
const passwordInput = document.getElementById("sftp-password");
const passwordIcon = document.getElementById("password-icon");

function renderEmails() {
  emailChips.replaceChildren(
    ...alertEmails.map((email) => {
      const chip = document.createElement("span");
      chip.className = "email-chip";
      const label = document.createElement("span");
      label.textContent = email;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${email}`);
      remove.innerHTML = '<span class="material-symbols-outlined">close</span>';
      remove.addEventListener("click", () => {
        const index = alertEmails.indexOf(email);
        if (index >= 0) alertEmails.splice(index, 1);
        renderEmails();
      });
      chip.append(label, remove);
      return chip;
    })
  );
}

function addAlertEmail() {
  const email = alertEmailInput.value.trim();
  if (!email.includes("@") || alertEmails.includes(email)) return;
  alertEmails.push(email);
  alertEmailInput.value = "";
  renderEmails();
}

renderEmails();

alertEmailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addAlertEmail();
  }
});
alertEmailInput.addEventListener("blur", addAlertEmail);

document.getElementById("toggle-password").addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  passwordIcon.textContent = showing ? "visibility" : "visibility_off";
  document.getElementById("toggle-password").setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

document.getElementById("save-sftp").addEventListener("click", () => {
  addAlertEmail();
  const note = document.getElementById("save-note");
  note.hidden = false;
  window.setTimeout(() => {
    note.hidden = true;
  }, 1800);
});

document.addEventListener("keydown", (event) => {
  if (backdrop.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDialog();
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...dialog.querySelectorAll("button:not([hidden]), input:not([hidden])")].filter(
    (node) => !node.closest("[hidden]") && !node.disabled
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
