
// datalayer.js
window.dataLayer = window.dataLayer || [];

function pushEvent(name, params) {
  window.dataLayer.push(Object.assign({ event: name }, params || {}));
  console.log("Pushed event:", name, params || {});
}
