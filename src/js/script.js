let titels = [];
let notes = [];
let titel = '';
let note = '';
let localKeyNotes = 'notes';
let localKeyTitels = 'titel';
let localKeyDelNotes = 'delNotes';
let localKeyDelTitles = 'delTitles';
let delTitels = [];
let delNotes = [];
let searchNotes = [];
let searchTitles = [];
let searchIdNotes = [];

function saveArrayToLocalStorage(key, array) { //With this Function you are able to save Arrays in local Storage
    localStorage.setItem(key, JSON.stringify(array)); //This line compile an Array into JSON witch is saved on localstorage
}

function loadArrayFromLocalStorage(key) { //With this Function you are able to load an Array from local Storage
    return JSON.parse(localStorage.getItem(key)); //This line reads a JSON from local Storage and compiles it into an Array
}

/**
 * first function wich is startet (Body onload)
 * Call function include HTML to add 'Nav Bar' 'aside-Block' and 'insertBlock'
 * Checking if there is local Data. if there is Data it will be saved into the Arrays
 * Calling function displayNotes, to show them in HTML
 */
function render() {
    includeHTML()
    removeclassesToElements()
    if (loadArrayFromLocalStorage(localKeyTitels)) {
        titels = loadArrayFromLocalStorage(localKeyTitels);
        notes = loadArrayFromLocalStorage(localKeyNotes);
    }

    displayNotes();
}

/**
 * This function starts a loop as many Times the Array titels length.
 * in every Loop it adds an own div Block for every value in the Arrays
 */
function displayNotes() {
    let notesBlock = document.getElementById('notes');
    notesBlock.innerHTML = '';
    if (titels.length > 0) {
        for (let i = 0; i < titels.length; i++) {
            notesBlock.innerHTML += returnNote(i);
        }
    } else {
        notesBlock.innerHTML += `
            <div class="noDataNotes">
                <h3>Sie haben noch keine Notizen eingegeben</h3>
            </div>
        `
    }
}

/**
 * @param {Integer} id  - The Id from the position of the note in the Array
 * @returns Returns the Div Container with Titel text and id(position in Array Titles and Notes) for the Delete Button
 */
function returnNote(id) {
    let returnString = `
    <div class="note">
        <h2>${titels[id]}</h2>
        <p>${notes[id]}</p>
        <div class="noteButtons">
            <button class="btn" onClick="addToDel(${id})"><img src="src/img/aside/trash.png" alt="delete Button" title="Notiz löschen"></button>
        </div>
    </div>
        `;
    return returnString
}

/**
 * Function to delete a Note and Titel on Position index and calls the Function to save the Arrays locally
 */
function deleteNote(index) {
    titels.splice(index, 1);
    notes.splice(index, 1);
    saveToLocal();
}

/**
 * Adding the Titel and Note from the Input Fields into the Arrays if the Values are not empty and calls Function to Save the Arrays locally
 */
function addNote() {
    titelElement = document.getElementById('inputTitel');
    noteElement = document.getElementById('inputNote');
    titel = titelElement.value;
    note = noteElement.value;
    if (note != '' && titel != '') {
        notes.push(note);
        titels.push(titel);
        saveToLocal();
        titelElement.value = '';
        noteElement.value = '';
    }
}

/**
 * Save the Arrays local in Local Storage
 */
function saveToLocal() {
    saveArrayToLocalStorage(localKeyNotes, notes);
    saveArrayToLocalStorage(localKeyTitels, titels);
    render();
}

/**
 * Function to show deleted Notes
 * Check if there is any Data of deleted Items, if there is any Data, it will saved into the Arrays
 */
function renderDeletedNotes() {
    includeHTML()
    if (loadArrayFromLocalStorage(localKeyDelTitles)) {
        delTitels = loadArrayFromLocalStorage(localKeyDelTitles);
        delNotes = loadArrayFromLocalStorage(localKeyDelNotes);
    }
    displayDeletedNotes();
}



/**
 * clears the notes Block
 * call function addClassesToElements
 * generate as many note Blocks as there are Data in the Arrays
 */
function displayDeletedNotes() {
    document.getElementById('notes').innerHTML = '';
    addclassesToElements();
    if (delTitels.length > 0) {
        for (let i = 0; i < delTitels.length; i++) {
            document.getElementById('notes').innerHTML += returnDeleteNote(i);
        }
    } else {
        document.getElementById('notes').innerHTML += `
            <div class="noDataNotes">
                <h3>Sie haben keine gelöschten Notizen.</h3>
            </div>
        `
    }
}

/**
 * @param {Integer} id  - The Id from the position of the note in the Array
 * @returns Returns the Div Container with Titel text and id(position in Array delTitles and delNotes) for the Delete Button
 */
function returnDeleteNote(id) {
    let returnString =
        `
    <div class="note">
        <h2>${delTitels[id]}</h2>
        <p>${delNotes[id]}</p>
        <div class="noteButtons">
            <button class="btn" onClick="deleteNoteComplete(${id})"><img src="src/img/aside/trash.png" alt="delete Button" title="Notiz endgültig löschen"></button>
        </div>
    </div>
        `
    return returnString
}

/**
 * Function to add classes to two Elements
 * 1. hide the input Block
 * 2. change position of notes Block
 */
function addclassesToElements() {
    let insertBlock = document.getElementById('insertBlock');
    let notes = document.getElementById('notes');
    let titletrash = document.getElementById('titleTrashBin');
    insertBlock.classList.add('d-none');
    notes.classList.add('notesTop');
    titletrash.classList.remove('d-none');
}

/**
 * Function to delete classes from Elements
 * 1. show the input Block
 * 2. change position of notes Block
 */
function removeclassesToElements() {
    let insertBlock = document.getElementById('insertBlock');
    let notes = document.getElementById('notes');
    let titletrash = document.getElementById('titleTrashBin');
    insertBlock.classList.remove('d-none');
    notes.classList.remove('notesTop');
    titletrash.classList.add('d-none');
}

/** 
 *  Delete a Note finally from localstorage
 */
function deleteNoteComplete(index) {
    delTitels.splice(index, 1);
    delNotes.splice(index, 1);
    saveToLocalDel();
    renderDeletedNotes();
}

/**
 * Save the deleted Notes to localstore
 */
function saveToLocalDel() {
    saveArrayToLocalStorage(localKeyDelNotes, delNotes);
    saveArrayToLocalStorage(localKeyDelTitles, delTitels);

}

/**
 *  Add a note to deleted notes
 */
function addToDel(inputKey) {
    if (loadArrayFromLocalStorage(localKeyDelTitles)) {
        delTitels = loadArrayFromLocalStorage(localKeyDelTitles);
        delNotes = loadArrayFromLocalStorage(localKeyDelNotes);
    }
    delTitels.push(titels[inputKey]);
    delNotes.push(notes[inputKey]);
    deleteNote(inputKey);
    saveToLocalDel();
}

/**
 * Function to clear Arrays
 */
function clearArrays() {
    searchNotes = [];
    searchTitles = [];
    searchIdNotes = [];
}

/**
 * Function to search a String in the notes
 * @param {String} input - String which is Searched in the Notes and Titels
 */
function searchNote(input) {
    clearArrays();
    if (loadArrayFromLocalStorage(localKeyTitels)) {
        titels = loadArrayFromLocalStorage(localKeyTitels);
        notes = loadArrayFromLocalStorage(localKeyNotes);
        for (i = 0; i < titels.length; i++) {
            if (titels[i].toLowerCase().includes(input.toLowerCase()) || notes[i].toLowerCase().includes(input)) {
                searchNotes.push(notes[i]);
                searchTitles.push(titels[i]);
                searchIdNotes.push(i);
            }
        }
        displaySearchNotes();
    }
}

/**
 * Display all notes, which have the searchNote Function found
 */
function displaySearchNotes() {
    let notesBlock = document.getElementById('notes');
    notesBlock.innerHTML = '';
    if (searchTitles.length > 0) {
        for (let i = 0; i < searchTitles.length; i++) {
            console.log(searchTitles);
            notesBlock.innerHTML += returnSearchElements(searchTitles[i], searchNotes[i], searchIdNotes[i])
        }
    } else {
        notesBlock.innerHTML += `
            <div class="noDataNotes">
                <h3>Keine passenden Notizen gefunden.</h3>
            </div>`
    }
}

/**
 * 
 * @param {String} titel - The Titles of the Note
 * @param {String} note  - The note-Text
 * @param {integer} id - The Id from the position of the note in the Array
 * @returns 
 */
function returnSearchElements(titel, note, id) {
    let returnString = `
    <div class="note">
        <h2>${titel}</h2>
        <p>${note}</p>
        <div class="noteButtons">
            <button class="btn" onClick="addToDel(${id})"><img src="src/img/aside/trash.png" alt="delete Button" title="Notiz löschen"></button>
        </div>
    </div>
        `;
    return returnString;
}