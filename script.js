
let notes = JSON.parse(localStorage.getItem("smartNotes")) || [];
let editId = null;

function updateStorage() {
  localStorage.setItem("smartNotes", JSON.stringify(notes));
}

function openForm(id = null) {
  editId = id;
  document.getElementById("formBox").classList.remove("hidden");

  if (id !== null) {
    const note = notes.find(n => n.id === id);
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("formTitle").innerText = "Edit Note";
  } else {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("formTitle").innerText = "Create Note";
  }
}

function closeForm() {
  document.getElementById("formBox").classList.add("hidden");
  editId = null;
}

function saveNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();

  if (!title || !content) {
    alert("Please enter title and content!");
    return;
  }

  if (editId !== null) {
    const note = notes.find(n => n.id === editId);
    note.title = title;
    note.content = content;
  } else {
    notes.unshift({
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString()
    });
  }

  updateStorage();
  renderNotes();
  closeForm();
}

function deleteNote(id) {
  if (confirm("Delete this note?")) {
    notes = notes.filter(n => n.id !== id);
    updateStorage();
    renderNotes();
  }
}

function renderNotes() {
  const list = document.getElementById("noteList");
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search) ||
    n.content.toLowerCase().includes(search)
  );

  document.getElementById("total").innerText = notes.length;

  const today = new Date().toLocaleDateString();
  document.getElementById("today").innerText =
    notes.filter(n => n.date === today).length;

  if (!filtered.length) {
    list.innerHTML = '<div class="empty">No notes found. Create your first note!</div>';
    return;
  }

  list.innerHTML = filtered.map(n => `
    <div class="note">
      <h3>${escapeHTML(n.title)}</h3>
      <p>${escapeHTML(n.content)}</p>
      <small>${n.date}</small>
      <button class="edit" onclick="openForm(${n.id})">Edit</button>
      <button class="delete" onclick="deleteNote(${n.id})">Delete</button>
    </div>
  `).join("");
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

document.getElementById("search").addEventListener("input", renderNotes);

renderNotes();
