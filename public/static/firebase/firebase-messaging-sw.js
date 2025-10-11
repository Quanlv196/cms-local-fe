importScripts("https://www.gstatic.com/firebasejs/7.5.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.5.1/firebase-messaging.js");

if (firebase.apps.length < 1) {
  firebase.initializeApp({
    apiKey: "AIzaSyDQOjibMhstB77NcYwVc2Ubs8pnKFNLNjw",
    projectId: "zs-bilet",
    messagingSenderId: "535258981652",
    appId: "1:535258981652:web:b620376ebd859d38a48e01",
  });
}

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  var { data, notification } = payload;
  var title = notification.title;
  var options = {
    ...notification,
    data: data
  };
  return self.registration.showNotification(title || "", options);
});
