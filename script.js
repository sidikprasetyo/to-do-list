// Date
const currentDate = new Date();
const formatDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
const formartingDate = currentDate.toLocaleDateString("id-ID", formatDate);
document.querySelector("#date").textContent = formartingDate;

// Search
const btnView = document.querySelector("#btn-search");
const search = document.querySelector(".search");
btnView.addEventListener("click", function () {
    search.classList.add("active");
    search.style.zIndex = "99";
});

// Close search
const btnClose = document.querySelector("#btn-close");
btnClose.addEventListener("click", () => {
    search.classList.remove("active");
    search.style.zIndex = "-1";
});

// Input
const input = document.querySelector("#input");
const btnAdd = document.querySelector("#btn-add");
const content = document.querySelector(".content");
const inputSearch = document.querySelector("#input-search");
const activity = document.querySelector('#activity');

// Function to load tasks from local storage
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
};

// Function to add task to the DOM
const addTaskToDOM = (taskText, completed = false) => {
    const newValue = `<div class="content d-flex mx-auto input-group p-2 rounded-3 container-task py-3 input-background mt-3">
        <span class="form-control me-2 task ${completed ? 'completed' : ''}">${taskText}</span>
        <div>
            <button class="btn btn-danger button">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>`;
    const newList = document.createElement('div');
    newList.innerHTML = newValue;
    activity.prepend(newList);
};

// Function to save tasks to local storage
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        tasks.push({
            text: task.textContent.trim(),
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

btnAdd.addEventListener('click', () => {
    if (input.value.trim() === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Input your activity!',
        icon: 'error',
        confirmButtonText: 'OK'
    });
        return;
    }

    addTaskToDOM(input.value);
    saveTasks();
    input.value = '';
});

// Event delegation for delete button with confirmation
activity.addEventListener('click', (event) => {
  if (event.target.closest('.button')) {
      Swal.fire({
          title: 'Are you sure?',
          text: 'Have you completed the activity?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel'
      }).then((result) => {
          if (result.isConfirmed) {
              event.target.closest('.content').remove();
              saveTasks();
              Swal.fire(
                  'Deleted!',
                  'Your activity has been deleted.',
                  'success'
              );
          }
      });
  }
});

// Done
activity.addEventListener('click', (event) => {
    if (event.target.classList.contains('task')) {
        event.target.classList.toggle('completed');
        saveTasks();
    }
});

// Search
const searchTasks = () => {
    const searchText = inputSearch.value.toLowerCase();
    document.querySelectorAll('.content').forEach(taskElement => {
        const taskText = taskElement.querySelector('.task').textContent.toLowerCase();
        if (taskText.includes(searchText)) {
            taskElement.classList.remove('hidden');
        } else {
            taskElement.classList.add('hidden');
        }
    });
};

inputSearch.addEventListener('input', searchTasks);

// Event listener for search close button
btnClose.addEventListener('click', () => {
  inputSearch.value = ''; // Clear the search input
  searchTasks(); // Show all tasks
});

// Load tasks from local storage on page load
window.addEventListener('load', loadTasks);
