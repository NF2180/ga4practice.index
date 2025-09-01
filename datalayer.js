
window.dataLayer = window.dataLayer || [];
function pushEvent(name,params){
  dataLayer.push(Object.assign({event:name},params||{}));
  console.log('Pushed',name,params);
}
