// script.js

// Variables
let refreshTimer = setInterval(fetchNotes, 1000);
let refreshTimer2;
const noteForm = document.getElementById("noteForm");
const editForm = document.getElementById("editForm");
const newNoteBtn = document.getElementById("newNoteBtn");
const titleInput = document.getElementById("titleInput");
const editTitleInput = document.getElementById("editTitleInput");
const textInput = document.getElementById("textInput");
const editTextInput = document.getElementById("editTextInput");
const newNoteForm = document.getElementById("newNoteForm");
const editNoteForm = document.getElementById("editNoteForm");
const list = document.querySelectorAll("ol");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const heading = document.getElementById("heading");
const searchResults = document.getElementById("searchResults");
const saveNoteBtn = document.getElementById("saveNote");
let notesList = JSON.parse(localStorage.getItem("notesList")) || {};

// Functions

function newNote() {
    noteForm.removeAttribute("hidden");
    newNoteBtn.hidden = true;
    titleInput.focus();
}

function addNote() {
    const title = titleInput.value.trim();
    const text = textInput.value.trim();
    if (title && text) {
        notesList[title] = text;
        localStorage.setItem("notesList", JSON.stringify(notesList));
        newNoteForm.reset();
        fetchNotes();
    }
    noteForm.hidden = true;
    newNoteBtn.removeAttribute("hidden");
}

function fetchNotes() {
  list[0].innerHTML = "";
  if (Object.keys(notesList).length != 0) {
      for (const title in notesList) {
          const note = document.createElement("li");
          note.id = `note-${title}`;
          const titleBox = document.createElement("div");
          const textBox = document.createElement("div");
          const editBtn = document.createElement("button");
          const deleteBtn = document.createElement("button");
          editBtn.id = `edit-${title}`;
          editBtn.onclick = function () {
              edit(title);
          };
          deleteBtn.id = `delete-${title}`;
          deleteBtn.onclick = function () {
              deleteNote(title);
          };
          editBtn.textContent += "Edit";
          deleteBtn.textContent += "Delete";
          deleteBtn.classList.add("delete");
          titleBox.textContent = title;
          textBox.textContent = notesList[title];
          note.prepend(titleBox);
          note.append(textBox);
          note.append(editBtn);
          note.append(deleteBtn);
          list[0].append(note);
      }
  }
}

function search(e) {
    e.preventDefault();
    const searchQuery = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "<h5>Search Results:</h5>";
    clearInterval(refreshTimer);
    clearInterval(refreshTimer2);
    searchResults.removeAttribute("hidden");
    heading.hidden = true;
    searchForm.reset();

    const results = Object.keys(notesList).filter(title =>
        title.toLowerCase().includes(searchQuery)
    );

    if (results.length) {
        results.forEach(title => {
            const note = document.getElementById(`note-${title}`);
            if (note) note.style.display = "flex";
        });
        Object.keys(notesList).forEach(title => {
            if (!results.includes(title)) {
                const note = document.getElementById(`note-${title}`);
                if (note) note.style.display = "none";
            }
        });
    } else {
        list[0].innerHTML = `<div>No Results Found for "${searchQuery}"</div>`;
        list[0].hidden = true;
    }
}

function home() {
    clearInterval(refreshTimer);
    clearInterval(refreshTimer2);
    refreshTimer2 = setInterval(fetchNotes, 1000);
    searchResults.hidden = true;
    editForm.hidden = true;
    noteForm.hidden = true;
    heading.removeAttribute("hidden");
    newNoteBtn.removeAttribute("hidden");
    newNoteForm.reset();
    editNoteForm.reset();
    list.hidden = false;
    Object.keys(notesList).forEach(title => {
        const note = document.getElementById(`note-${title}`);
        if (note) note.style.display = "flex";
    });
}

function edit(title) {
    editForm.removeAttribute("hidden");
    newNoteBtn.hidden = true;
    editTitleInput.value = title;
    editTextInput.value = notesList[title];
    editTitleInput.setAttribute("data-old-title", title);
}

function editNote() {
    const oldTitle = editTitleInput.getAttribute("data-old-title");
    const newTitle = editTitleInput.value.trim();
    const newText = editTextInput.value.trim();
    if (newTitle && newText) {
        if (newTitle !== oldTitle) {
            delete notesList[oldTitle];
        }
        notesList[newTitle] = newText;
        localStorage.setItem("notesList", JSON.stringify(notesList));
        fetchNotes();
    }
    editForm.hidden = true;
    newNoteBtn.removeAttribute("hidden");
}

function deleteNote(title) {
  if (confirm(`Are you sure you want to delete this note "${title}"?`)) {
      delete notesList[title];
      localStorage.setItem("notesList", JSON.stringify(notesList));
      fetchNotes();
  }
}

// Event Listeners
document.getElementById("homeBtn").addEventListener("click", home);
newNoteBtn.addEventListener("click", newNote);

newNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNote();
});

editNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    editNote();
});

searchForm.addEventListener("submit", search);

titleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        textInput.focus();
    }
});

textInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addNote();
    }
});

editTitleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        editTextInput.focus();
    }
});

searchInput.addEventListener("focus", () => {
    newNoteBtn.removeAttribute("hidden");
    noteForm.hidden = true;
    editForm.hidden = true;
    newNoteForm.reset();
    editNoteForm.reset();
});
