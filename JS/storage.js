import { db } from '../firebase-config.js';
import { doc, setDoc, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

// Execute fetchTasks function when page get loaded
window.addEventListener('load', () => {
    // fetchTasks();
});

// Function to fetch tasks collection from firebase when page gets loaded
async function fetchTasks() {
    // console.log(db);
    const tasksCollection = collection(db, "tasks");
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Tasks:", tasksList); // Tasks im Console-Log anzeigen
}

async function addDocument(params) {
    console.log('Add new document to firebase');

    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "tasks"), 
        params
    );
    // const tasksCollection = collection(db, "tasks");
    // const tasksSnapshot = await getDocs(tasksCollection);
    // console.log(tasksSnapshot);
    // console.log(params);
    // const docRef = await addDoc(collection(db, "tasks"), {
    //     Title: "Read about clean code rules",
    //     Description: "This is my first task added to storage."
    // });
}

export { fetchTasks, addDocument };


// Read and write data to firestore
// Add a new document with a generated id.
// export async function addDocument(tasks) {
//     console.log('Entered addDocument function.');
//     const docRef = await addDoc(collection(db, "tasks"), {
//         tasks
//     });
// }

// getSingleDocRef('tasks','iPFBXVQi22ezPiRyXHYI');

// function getSingleDocRef(collection, id) {
//     const docRef = doc(db, `${collection}`, `${id}`);
//     console.log(docRef.value);
// }