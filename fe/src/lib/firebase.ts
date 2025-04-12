// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCy_ECAgYNILrT-kSLb51XcFoXQfBItsp0",
    authDomain: "uniweb-df034.firebaseapp.com",
    projectId: "uniweb-df034",
    storageBucket: "uniweb-df034.firebasestorage.app",
    messagingSenderId: "676847581647",
    appId: "1:676847581647:web:5e956c0c917b3ca2803aba",
    measurementId: "G-11EWFFQGJF"
};
// **Khởi tạo Firebase trước khi sử dụng nó**
const app = initializeApp(firebaseConfig);

// **Khởi tạo các dịch vụ Firebase**
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };