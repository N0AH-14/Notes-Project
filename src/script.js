//Variables

let refreshTimer = setInterval(()=>{
  console.log("Refreshed!");
  fetchNotes();
}, 1000);
let refreshTimer2;
const noteForm = document.getElementById("noteForm");
const editForm = document.getElementById("editForm");
const newNoteBtn = document.getElementById("newNoteBtn");
const titleBtn = document.getElementById("titleBtn");
const titleEditBtn = document.getElementById("titleEditBtn");
const textBtn = document.getElementById("textBtn");
const textEditBtn = document.getElementById("textEditBtn");
const newNoteForm = document.getElementById("newNoteForm");
const editNoteForm = document.getElementById("editNoteForm");
const list = document.getElementsByTagName("ol");
const searchBtn = document.getElementById("searchBtn");
const searchForm = document.getElementById("searchForm");
const heading = document.getElementById("heading");
const searchResults = document.getElementById("searchResults");
const saveNoteBtn = document.getElementById("saveNote");
let notesList = {};   //Object to store Notes{Title:Notes text}

//Functions

function newNote() //Show New Notes form
{
  noteForm.removeAttribute("hidden");
  newNoteBtn.hidden = true;
  titleBtn.focus();
}
function addNote() //Insert New Note to Notes List & Hide New Notes Form
{
  noteForm.hidden = true;
  newNoteBtn.removeAttribute("hidden");
  let title = titleBtn.value;
  let text = textBtn.value;
  notesList[title] = text;
  newNoteForm.reset();
}
function fetchNotes() //Function to fetch notes from Notes List & Display on screen
{
  list[0].innerHTML="";
  if (Object.keys(notesList).length != 0) {
    for (const title in notesList) {
      const note = document.createElement("li");
      note.id = `note-${title}`;
      const titleBox = document.createElement("div");
      const textBox = document.createElement("div");
      const editBtn = document.createElement("button");
      editBtn.id = `edit-${title}`;
      editBtn.onclick = function (){
        edit(title);
      };
      editBtn.textContent+="Edit";
      titleBox.textContent = title;
      textBox.textContent = notesList[title];
      note.prepend(titleBox);
      note.append(textBox);
      note.append(editBtn);
      list[0].append(note);
    }
  }
}
function search() //Search by title in Notes List
{
  searchResults.innerHTML="<h5>Search Results:</h5>";
  clearInterval(refreshTimer);
  clearInterval(refreshTimer2);
  const searchQuery = searchBtn.value;
  searchResults.removeAttribute("hidden");
  heading.hidden = true;
  searchForm.reset()
  ;
  if (searchQuery in notesList) {
    for (const Title in notesList) {
      if (searchQuery != Title) {
        let note = document.getElementById(`note-${Title}`);
        note.style.display="none";
        console.log(`Hidden:\t${Title}`);
      }
    }
  } else {
    list[0].hidden=true;
    const results = document.createElement("div");
    results.innerHTML = `No Results Found for ${searchQuery}`;
    searchResults.append(results);
  }
}
function home() //Reset all forms & take back to home page
{
  clearInterval(refreshTimer);
  clearInterval(refreshTimer2);
  refreshTimer2 = setInterval(()=>{
    console.log("Hello");
    fetchNotes();
  }, 1000);
  searchResults.hidden = true;
  editForm.hidden=true;
  noteForm.hidden=true;
  heading.removeAttribute("hidden");
  newNoteBtn.removeAttribute("hidden");
  newNoteForm.reset();
  editNoteForm.reset();
  for (const Title in notesList) {
    const note = document.getElementById(`note-${Title}`);
    note.style.display="flex";
  }
  list[0].removeAttribute("hidden");
}
function edit(title) //Show Edit form & get data from where it was called
{
  editForm.removeAttribute("hidden");
  newNoteBtn.hidden = true;
  titleEditBtn.value = `${title}`;
  textEditBtn.value = `${notesList[title]}`;
  saveNoteBtn.onclick=function(e){
    alert("Hello");
    e.preventDefault();
    editNote(title);
  };
  textEditBtn.addEventListener("keypress", (e) => {
    e.stopPropagation();
    if (e.key == "Enter") {
      e.preventDefault();
      editNote(title);
    }
  });
}
function editNote(oldTitle) //Modify new data in Notes List
{
  const newTitle = titleEditBtn.value;
  const newText = textEditBtn.value;
  if (newTitle != oldTitle) {
    delete notesList[oldTitle];
    notesList[newTitle] = newText;
  }
  else
  {
    notesList[oldTitle] = newText;

  }
  editForm.hidden = true;
  newNoteBtn.removeAttribute("hidden");
}

//Event Listeners

titleBtn.addEventListener("keypress", (e) => {
  e.stopPropagation();
  if (e.key == "Enter") {
    e.preventDefault();
    textBtn.focus();
  }
});

textBtn.addEventListener("keypress", (e) => {
  e.stopPropagation();
  if (e.key == "Enter") {
    e.preventDefault();
    addNote();
  }
});

searchBtn.addEventListener("keypress", (e) => {
  e.stopPropagation();
  if (e.key == "Enter") {
    e.preventDefault();
    search();
  }
});

titleEditBtn.addEventListener("keypress", (e) => {
  e.stopPropagation();
  if (e.key == "Enter") {
    e.preventDefault();
    textEditBtn.focus();
  }
});

searchBtn.addEventListener("focus", ()=>{
  newNoteBtn.removeAttribute("hidden");
  noteForm.hidden=true;
  editForm.hidden=true;
  newNoteForm.reset();
  editNoteForm.reset();
})