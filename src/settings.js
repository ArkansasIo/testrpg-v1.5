const fields = ['mute', 'volume', 'alwaysOnTop', 'clickThrough', 'autosaveSeconds'];
const status = document.getElementById('status');
function setForm(settings) {
  for (const key of fields) {
    const el = document.getElementById(key);
    if (!el) continue;
    if (el.type === 'checkbox') el.checked = Boolean(settings[key]);
    else el.value = settings[key];
  }
}
function getForm() {
  return {
    mute: document.getElementById('mute').checked,
    volume: Number(document.getElementById('volume').value),
    alwaysOnTop: document.getElementById('alwaysOnTop').checked,
    clickThrough: document.getElementById('clickThrough').checked,
    autosaveSeconds: Number(document.getElementById('autosaveSeconds').value)
  };
}
async function boot() {
  try {
    const settings = await window.taskbarHeroSettings.load();
    setForm(settings);
  } catch (error) {
    status.textContent = 'Could not load settings';
    console.error(error);
  }
}
document.getElementById('save').addEventListener('click', async () => {
  status.textContent = 'Saving…';
  try {
    await window.taskbarHeroSettings.save(getForm());
    status.textContent = 'Saved';
  } catch (error) {
    status.textContent = 'Save failed';
    console.error(error);
  }
});
boot();
