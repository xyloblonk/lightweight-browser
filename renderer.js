const { ipcRenderer } = require("electron");

let currentTab = 0;

const tabsContainer = document.getElementById("tabs");
const newTabBtn = document.getElementById("new-tab");
const urlInput = document.getElementById("url");
const goBtn = document.getElementById("go");

async function addTabButton(index) {
  const btn = document.createElement("button");
  btn.className = "tab";
  btn.textContent = `Tab ${index + 1}`;
  btn.dataset.index = index;

  btn.onclick = () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    ipcRenderer.send("switch-tab", index);
    currentTab = index;
  };

  tabsContainer.insertBefore(btn, newTabBtn);

  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
}

newTabBtn.onclick = () => {
  ipcRenderer.invoke("new-tab").then((index) => {
    addTabButton(index);
    currentTab = index;
  });
};

goBtn.onclick = () => {
  const val = urlInput.value.trim();
  if (val) ipcRenderer.send("navigate", val);
};

urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goBtn.click();
});

window.addEventListener("DOMContentLoaded", () => {
  addTabButton(0);
});

ipcRenderer.invoke("get-favicon", index).then((src) => {
  const img = document.createElement("img");
  img.src = src;
  img.className = "favicon";
  btn.prepend(img);
});

ipcRenderer.on("update-available", () => {
  alert("An update is available and downloading...");
});

ipcRenderer.on("update-downloaded", () => {
  if (confirm("Update ready. Restart now?")) {
    ipcRenderer.send("restart-to-update");
  }
});
const statusDiv = document.createElement("div");
statusDiv.id = "update-status";
statusDiv.style.cssText = `
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1f1f1f;
  color: #aaa;
  padding: 6px 12px;
  font-size: 12px;
  font-family: monospace;
  border-top: 1px solid #333;
`;
document.body.appendChild(statusDiv);

ipcRenderer.on("update-status", (_, message) => {
  statusDiv.textContent = message;
});
