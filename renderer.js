const { ipcRenderer } = require('electron');
let currentTab = 0;
const tabsContainer = document.getElementById('tabs');
const newTabBtn = document.getElementById('new-tab');
const urlInput = document.getElementById('url');
const goBtn = document.getElementById('go');
function addTabButton(index) {
  const btn = document.createElement('button');
  btn.className = 'tab';
  btn.textContent = `Tab ${index + 1}`;
  btn.dataset.index = index;
  btn.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    ipcRenderer.send('switch-tab', index);
    currentTab = index;
  };
  tabsContainer.insertBefore(btn, newTabBtn);
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}
newTabBtn.onclick = () => {
  ipcRenderer.invoke('new-tab').then(index => {
    addTabButton(index);
    currentTab = index;
  });
};
goBtn.onclick = () => {
  const val = urlInput.value.trim();
  if (val) ipcRenderer.send('navigate', val);
};
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') goBtn.click();
});
window.addEventListener('DOMContentLoaded', () => {
  addTabButton(0);
});
