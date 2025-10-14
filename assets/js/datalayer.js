// assets/js/datalayer.js
// Minimal, global helper to push events consistently and log them.
// Attach to window so inline scripts can call pushEvent(...)

(function(){
  window.dataLayer = window.dataLayer || [];

  // helper which always pushes an object with {event: ..., ecommerce: ...}
  window.pushEvent = function(eventName, payload) {
    // Normalize payload: if ecommerce given directly as items array, keep;
    // otherwise allow ecommerce under payload.ecommerce.
    var pushObj = { event: eventName };

    // If payload is undefined, keep only event
    if (payload && typeof payload === 'object') {
      // If payload already contains ecommerce, merge it
      if (payload.ecommerce) {
        pushObj.ecommerce = payload.ecommerce;
      } else {
        // If payload looks like item-level (id/name/price), nest it under ecommerce.items[0]
        var hasItemKeys = payload.item_id || payload.itemName || payload.item_name || payload.price;
        if (hasItemKeys) {
          pushObj.ecommerce = {
            items: [{
              item_id: payload.item_id || payload.itemId || payload.itemID || payload.item_id,
              item_name: payload.item_name || payload.itemName || payload.name || payload.itemname,
              price: payload.price != null ? payload.price : payload.value,
              quantity: payload.quantity != null ? payload.quantity : 1,
              currency: payload.currency || 'INR',
              item_category: payload.item_category || payload.category || ''
            }]
          };
        } else {
          // just attach remaining keys as top-level fields (rare)
          Object.keys(payload).forEach(function(k){
            pushObj[k] = payload[k];
          });
        }
      }
    }

    window.dataLayer.push(pushObj);
    // Helpful console log for debugging
    try {
      console.log('pushEvent ->', JSON.stringify(pushObj));
    } catch(e){
      console.log('pushEvent ->', pushObj);
    }
    return pushObj;
  };

  // small helper to write lastItem to sessionStorage for checkout usage
  window.storeLastItemForCheckout = function(itemObj) {
    try {
      sessionStorage.setItem('lastItem', JSON.stringify(itemObj));
      console.log('storeLastItemForCheckout ->', itemObj);
    } catch(e) {
      console.warn('Could not store lastItem', e);
    }
  };

  // optional: small convenience seeder you can run in console during tests
  window.seedTestData = function(){
    pushEvent('view_item', { ecommerce: { items:[{ item_id:'SKU1', item_name:'Red Hoodie', price:49.99, currency:'INR' }] } });
    pushEvent('add_to_cart', { ecommerce: { items:[{ item_id:'SKU1', item_name:'Red Hoodie', price:49.99, currency:'INR', quantity:1 }] } });
    pushEvent('begin_checkout', { ecommerce: { items:[{ item_id:'SKU1', item_name:'Red Hoodie', price:49.99, currency:'INR', quantity:1 }] } });
    pushEvent('purchase', { ecommerce: { transaction_id: 'T-TEST-'+Date.now(), value:49.99, currency:'INR', items:[{ item_id:'SKU1', item_name:'Red Hoodie', price:49.99, quantity:1 }] } });
    pushEvent('thank_you', { ecommerce: { items:[{ item_id:'SKU1', item_name:'Red Hoodie', price:49.99, quantity:1 }] } });
    console.log('seedTestData complete');
  };
})();
