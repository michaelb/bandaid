
async function saveOptions(e) {
  e.preventDefault();
  await browser.storage.local.set({
    dts: document.querySelector("#dts").value
  });
  await browser.storage.local.set({
    dtl: document.querySelector("#dtl").value
  });
}

async function restoreOptions() {
  let res = await browser.storage.local.get('dts');
  document.querySelector("#dts").value = res.dts || 50;
  res = await browser.storage.local.get('dtl');
  document.querySelector("#dtl").value = res.dtl || 25;
}

async function resetOptions() {
  browser.storage.local.clear()
    .then(() => {
      console.log("All local storage cleared!");
    })
    .catch(error => {
      console.error(`Error clearing local storage: ${error}`);
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", resetOptions);
