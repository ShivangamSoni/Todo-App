const LOCAL_STORAGE_TASKS_LIST_KEY = "task.list";
const tasksList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_LIST_KEY)) || [];
let activeSection = false;

const allTasksContainer = document.querySelector(".mainAll");
const oneTasksContainer = document.querySelector(".mainOne");
const empty = document.querySelector(".empty");

const goBackBtn = document.querySelector("#goBack");
goBackBtn.addEventListener("click", toggleSections);

const addListBtn = document.querySelector("#addList");
addListBtn.addEventListener("click", openModal);

const modalCloseBtns = document.querySelectorAll(".modal__close");
modalCloseBtns.forEach((btn) => btn.addEventListener("click", closeModal));

const modalSubmit = document.querySelectorAll(".modal__btn");
modalSubmit.forEach((btn) => btn.addEventListener("click", submit));

render();

function render() {
  if (tasksList.length === 0) {
    empty.classList.remove("empty--hidden");
  } else {
    empty.classList.add("empty--hidden");
  }

  if (activeSection === false) {
    clearElements(allTasksContainer);
    tasksList.forEach((task) => {
      const card = createCard(task);
      const completeChecks = card.querySelectorAll("input");
      completeChecks.forEach((check) => check.addEventListener("click", completeTask));
      const deleteBtn = card.querySelectorAll(".card__deleteList");
      deleteBtn.forEach((btn) => btn.addEventListener("click", deleteList));
      allTasksContainer.appendChild(card);
    });

    const listTitles = document.querySelectorAll(".card__title");
    listTitles.forEach((title) => title.addEventListener("click", openIndividualList));
  } else {
    clearElements(oneTasksContainer);
    const card = createCard(tasksList[activeSection]);
    oneTasksContainer.appendChild(card);

    const oneTitle = document.querySelector(".oneTitle__span");
    oneTitle.textContent = tasksList[activeSection].title;

    const addItemBtn = card.querySelector(".card__addTask");
    addItemBtn.addEventListener("click", openModal);

    const completeChecks = card.querySelectorAll("input");
    completeChecks.forEach((check) => check.addEventListener("click", completeTask));
  }
}

function createCard(task) {
  const card = document.createElement("div");
  card.classList.add("card");

  const title = document.createElement("a");
  title.classList.add("card__title");
  title.dataset.id = task.id;
  title.textContent = task.title;

  card.appendChild(title);

  const list = document.createElement("ul");
  list.classList.add("card__list");
  task.tasks.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("card__task");
    if (item.complete) {
      listItem.classList.add("card__task--complete");
    } else {
      listItem.classList.add("card__task--pending");
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.dataset.id = task.id;
      listItem.appendChild(input);
    }
    listItem.append(` ${item.desc}`);
    list.appendChild(listItem);
  });
  card.appendChild(list);

  const addBtn = document.createElement("a");
  addBtn.classList.add("fas", "fa-plus-circle", "card__addTask");
  addBtn.dataset.for = "newItem";
  addBtn.dataset.section = "one";
  card.appendChild(addBtn);

  const deleteBtn = document.createElement("a");
  deleteBtn.classList.add("fas", "fa-trash", "card__deleteList");
  deleteBtn.dataset.id = task.id;
  card.appendChild(deleteBtn);

  return card;
}

function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_TASKS_LIST_KEY, JSON.stringify(tasksList));
}

function saveAndRender() {
  save();
  render();
}

function createNewList(title) {
  const list = {
    id: Date.now().toString(),
    title: title,
    tasks: [],
  };
  tasksList.push(list);
}

function createNewTask(desc) {
  const task = {
    desc: desc,
    complete: false,
  };
  tasksList[activeSection].tasks.push(task);
}

function openIndividualList(e) {
  const id = e.target.dataset.id;
  const taskIndex = tasksList.findIndex((element) => element.id === id);
  toggleSections(taskIndex);
}

function submit(e) {
  const input = e.target.previousElementSibling;
  const value = input.value.trim();
  if (value === "") return;
  if (activeSection !== false) {
    createNewTask(value);
  } else {
    createNewList(value);
  }
  input.value = "";
  const modalClose = e.target.parentElement.previousElementSibling;
  modalClose.click();
  saveAndRender();
}

function completeTask(e) {
  const input = e.target;
  const taskText = input.nextSibling.textContent.trim();
  const id = input.dataset.id;
  const selectedList = tasksList.find((item) => item.id === id);
  const selectedTask = selectedList.tasks.find((task) => task.desc === taskText);
  selectedTask.complete = true;
  saveAndRender();
}

function deleteList(e) {
  const id = e.target.dataset.id;
  const selectedList = tasksList.findIndex((item) => item.id !== id);
  tasksList.splice(selectedList, 1);
  saveAndRender();
}

function toggleSections(active) {
  activeSection = activeSection !== false ? false : active;
  render();
  const all = document.querySelector(".all");
  all.classList.toggle("all--hidden");
  const one = document.querySelector(".one");
  one.classList.toggle("one--hidden");
}

function openModal(e) {
  const sectionData = e.target.dataset.section;
  const section = document.querySelector(`.${sectionData}`);
  section.classList.add(`${sectionData}--blur`);
  const modalData = e.target.dataset.for;
  const modal = document.querySelector(`div[data-modal-type="${modalData}"]`);
  modal.classList.remove("modal--hidden");
}

function closeModal(e) {
  const modal = e.target.parentElement;
  modal.classList.add("modal--hidden");
  const sectionData = modal.dataset.section;
  const section = document.querySelector(`.${sectionData}`);
  section.classList.remove(`${sectionData}--blur`);
}
