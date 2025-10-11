import firebase from "firebase/app";
import "firebase/auth";
import {firebaseConfig} from "../constants/environment"
firebase.initializeApp(firebaseConfig)
export const firebaseAuth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider()
let microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: "consent",
  tenant: 'dc5563df-057f-4f6c-9986-dcb6a3a4b5b2',
})
microsoftProvider.addScope('user.read');
microsoftProvider.addScope('email');
microsoftProvider.addScope('openid');
microsoftProvider.addScope('profile');
microsoftProvider.addScope('offline_access');
// microsoftProvider.addScope('mail.read');
// microsoftProvider.addScope('calendars.read');
export {microsoftProvider}
export const getIdToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken(true).then((idToken) => {
          console.log('getIdToken',user.emailVerified,idToken)
          // if(!user.emailVerified){
          //   user.reload();
          //   return getIdToken()
          // }else{
          //   resolve(idToken);
          // }
          resolve(idToken);
          
        }, (error) => {
          resolve(null);
        });
      } else {
      resolve(null);
      }
    });
  });
};
export const signInWithPhoneNumber = (phone:string) =>{
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container", 
    {
      'size': 'invisible',
      'callback': ()=>{
  
      },
      'expired-callback': ()=>{
        // recaptchaVerifier.render().then(function(widgetId) {
        //   grecaptcha.reset(widgetId);
        // })
      }
    }
  );
  return firebaseAuth.signInWithPhoneNumber(`+84${phone.replace("+84", "")}`, recaptchaVerifier);
};