import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcQfJ9CO3yCCmv2JEJbSv4tWSmf9_f3xw",
    authDomain: "manage-io-ee9fc.firebaseapp.com",
    projectId: "manage-io-ee9fc",
    storageBucket: "manage-io-ee9fc.firebasestorage.app",
    messagingSenderId: "748168850381",
    appId: "1:748168850381:web:69d0449c4a639b04863284"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Sign-Up fnc
const signUpBtn = document.querySelector('#signUpBtn');
if (signUpBtn) {
    signUpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value.trim();
        const userName = document.querySelector('#name').value.trim();

        if (!email || !password || !userName) {
            Swal.fire({
                icon: 'warning',
                title: 'All Fields Required',
                text: 'Please fill out all the fields.',
                confirmButtonColor: '#006239',
                background: '#111',
                color: 'gainsboro',
                heightAuto: false,
                focusConfirm: false
            });
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = { email, userName, password };

                const docRef = doc(db, "users", user.uid);
                return setDoc(docRef, userData);
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created',
                    text: 'Your account has been created successfully!',
                    confirmButtonColor: '#006239',
                    background: '#111',
                    color: 'gainsboro',
                    heightAuto: false,
                    focusConfirm: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = errorCode === 'auth/email-already-in-use'
                    ? 'An account with this email already exists.'
                    : 'Invalid Input. Please try again.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: '#006239',
                    background: '#111',
                    color: 'gainsboro',
                    heightAuto: false,
                    focusConfirm: false
                });
            });
    });
}

// Login fnc
const loginBtn = document.querySelector('#loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value.trim();

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Fields Missing',
                text: 'Both email and password are required.',
                confirmButtonColor: '#006239',
                background: '#111',
                color: 'gainsboro',
                heightAuto: false,
                focusConfirm: false
            });
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Retrieve user's data from Firestore
                const docRef = doc(db, "users", user.uid);
                return getDoc(docRef);
            })
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    localStorage.setItem('userName', userData.userName); // Store username
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome back!',
                        confirmButtonColor: '#006239',
                        background: '#111',
                        color: 'gainsboro',
                        heightAuto: false,
                        focusConfirm: false
                    }).then(() => {
                        window.location.href = 'homePage.html';
                    });
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = errorCode === 'auth/wrong-password'
                    ? 'The password you entered is incorrect.'
                    : errorCode === 'auth/user-not-found'
                        ? 'No account exists with this email.'
                        : 'Unable to log in. Please try again.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: '#006239',
                    background: '#111',
                    color: 'gainsboro',
                    heightAuto: false,
                    focusConfirm: false
                });
            });
    });
}

// Log Out fnc
document.addEventListener('DOMContentLoaded', () => {
    const logOutButton = document.querySelector('#logOut');
    if (logOutButton) {
        logOutButton.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged Out',
                        text: 'You have been logged out successfully!',
                        confirmButtonColor: '#006239',
                        background: '#111',
                        color: 'gainsboro',
                        heightAuto: false,
                        focusConfirm: false
                    }).then(() => {
                        localStorage.removeItem('userName');
                        window.location.href = 'login.html';
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout Failed',
                        text: 'Unable to log out. Please try again.',
                        confirmButtonColor: '#006239',
                        background: '#111',
                        color: 'gainsboro',
                        heightAuto: false,
                        focusConfirm: false
                    });
                    console.error('Logout Error:', error);
                });
        });
    } else {
        console.warn('Logout button not found!');
    }
});



// Display the logged-in user's name
const displayName = document.querySelector('#displayName');
const userName = localStorage.getItem('userName');
if (userName) {
    displayName.innerHTML = `${userName}`;
}


// Forgot password functionality
const forgotPass = document.querySelector('#forgotPass');

let forgotPassword = () => {
    // Retrieve the email from the input field
    const email = document.querySelector('#email').value.trim();

    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Email Required',
            text: 'Please enter your email address.',
            confirmButtonColor: '#006239',
            background: '#111',
            color: 'gainsboro',
            heightAuto: false,
            focusConfirm: false
        });
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Password Reset',
                text: 'Check your email for the reset link!',
                confirmButtonColor: '#006239',
                background: '#111',
                color: 'gainsboro',
                heightAuto: false,
                focusConfirm: false
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = 'Something went wrong. Please try again.';
            if (errorCode === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#006239',
                background: '#111',
                color: 'gainsboro',
                heightAuto: false,
                focusConfirm: false
            });
        });
}

forgotPass.addEventListener('click', forgotPassword);
