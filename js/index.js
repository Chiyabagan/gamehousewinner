// form submission handling
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABz1VFPnvjKTGV9ILda8OftEZJ8OLoVfI",
    authDomain: "chiya-bagan-344e2.firebaseapp.com",
    projectId: "chiya-bagan-344e2",
    storageBucket: "chiya-bagan-344e2.firebasestorage.app",
    messagingSenderId: "716025843763",
    appId: "1:716025843763:web:50a3b34a65904007de1346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore CORRECTLY

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const datePickerElement = document.getElementById("datePicker");
const tableBody = document.getElementById("winnerTableBody");

async function fetchWinnersByDate() {
    const selectedDate = datePickerElement.value || getTodayDate(); // Get date from input
    const formattedSelectedDate = formatDateString(selectedDate); // Format it to MM-DD-YYYY

    tableBody.innerHTML = ""; // Clear previous data

    try {
        const q = query(collection(db, "users"), where("lastWon", "==", formattedSelectedDate));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="4">No winners found for ${formattedSelectedDate}</td></tr>`;
            return;
        }

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const row = `<tr>
                <td>${data.name}</td>
                <td>${data.mobile}</td>
                <td>${data.correctAnswerCount}</td>
                <td>${data.lastWon}</td> <!-- Display as string -->
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching winners:", error);
        tableBody.innerHTML = `<tr><td colspan="4">Error fetching data. See console.</td></tr>`;
    }
}

// Helper function to format date to MM-DD-YYYY
function formatDateString(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`; // Format: MM-DD-YYYY
}



// Set default date to today & fetch winners on page load
document.addEventListener('DOMContentLoaded', () => {
    datePickerElement.value = getTodayDate();
    fetchWinnersByDate();

    datePickerElement.addEventListener('change', fetchWinnersByDate); // Attach event listener correctly
});
