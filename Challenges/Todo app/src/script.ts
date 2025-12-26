let todos: Todo[] = [];

document.addEventListener("DOMContentLoaded", () => {
    init();
    setupEvents();
});

function init(){
    initTodos();
}

function initTodos(){
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);

        if(key && key.startsWith("task_")){
            const item = localStorage.getItem(key);
            if(item) {
                const task: Todo= JSON.parse(item);
                todos.push(task);
            }
        }
    }
    refreshTodosList();
}

function getAutoIncrementedId(){
    let lastTodoId: string = todos[todos.length - 1]?.Id ?? "task_1";

    let newId: number = parseInt(lastTodoId.replace("task_", "")) + 1;
    return newId.toString();
}

function setupEvents(){
    document.getElementById("theme-btn")?.addEventListener("click", () => {
        document.getElementById("body")?.classList.toggle("light-theme");
    });  

    document.getElementById("create-todo-btn")?.addEventListener("click", () => {
        const createInput = document.getElementById("create-todo-description") as HTMLInputElement;

        if(!createInput) return;

        let newTodo: Todo = {
            Id: getAutoIncrementedId(),
            Description: createInput.value ?? "",
            IsCompleted: false
        };

        SaveTodo(newTodo);
        createInput.value = "";
    });  

    document.getElementById("create-todo-description")?.addEventListener("keydown", (event) => {   
        console.log("teste32dsfsdfsd")    
        if (event.key === "Enter") {                
            const createInput = document.getElementById("create-todo-description") as HTMLInputElement;

            if(!createInput) return;

            let newTodo: Todo = {
                Id: getAutoIncrementedId(),
                Description: createInput.value ?? "",
                IsCompleted: false
            };

            SaveTodo(newTodo);
            createInput.value = "";
        }
    });

    let todosFilters = document.querySelectorAll("search.todos-filter");

    todosFilters.forEach(filter => {
        filter.querySelector("#all-filter-btn")?.addEventListener("click", () => {
            resetFilters();
        });
        filter.querySelector("#active-filter-btn")?.addEventListener("click", () => {
            FilterActive(false);
        });
        filter.querySelector("#completed-filter-btn")?.addEventListener("click", () => {
            FilterActive(true);
        });
    });

    document.getElementById("clear-all-todos")?.addEventListener("click", () => {
        let completedTodos = todos.filter(todo => todo.IsCompleted === true);

        completedTodos.forEach(todo => {
            deleteTodo(todo.Id);
        });

        refreshTodosList();
    });    
}

function SaveTodo(task:Todo){
    localStorage.setItem(`task_${task.Id}`, JSON.stringify(task));
    todos.push(task);
    refreshTodosList();
}

function updateTodo(updatedTodo: Todo){
    localStorage.setItem(`task_${updatedTodo.Id}`, JSON.stringify(updatedTodo));
    todos = todos.map(task => task.Id === updatedTodo.Id ? updatedTodo : task);
    refreshTodosList();
}

function deleteTodo(taskIdNumber: string){
    localStorage.removeItem(`task_${taskIdNumber}`);

    todos = todos.filter(task => task.Id !== taskIdNumber)
}

function refreshTodosList(){
    let todosContainer = document.getElementById("todo-list");
    if(!todosContainer) return;

    let html = "";  
    todos.sort((a, b) => Number(a.Id) - Number(b.Id));  
    if(todos.length > 0){
        todos.forEach(task => {
            html += `
            <div class="container-row todo-item" data-rowId="${task.Id}" data-completed="${task.IsCompleted}">
                <div class="checkbox-container"></div>          
                <input type="text" for="Description" value="${task.Description}"/>
                <div class="delete-btn" id="delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                </div>          
            </div>`;
        });
    } else {
        html += "<div class='container-row'>No todos</div>"
    }

    todosContainer.innerHTML = html;
    updateTodosCounter();
    setupTodoEvents();
}

function updateTodosCounter(){
    let activeTodosCounter = todos.filter(todo => todo.IsCompleted != true).length;
    document.getElementById("todos-counter")!.textContent = activeTodosCounter.toString();
}

function setupTodoEvents(){
    let todoItems = document.querySelectorAll(`.container-row.todo-item`);

    if(!todoItems) return;

    todoItems.forEach(todo => {
        let checkboxContainer = todo.querySelector<HTMLElement>(".checkbox-container");
        let input = todo.querySelector<HTMLInputElement>("input[type='text']");
        let deleteBtn = todo.querySelector<HTMLElement>("#delete-btn");

        if(!checkboxContainer || !input || !deleteBtn) {
            // todo.classList.add("hidden");
            return;
        }

        let task: Todo = {
            Id: todo.getAttribute("data-rowId") ?? "0",
            Description: input.value ?? "",
            IsCompleted: todo.getAttribute("data-completed") === "true"
        };

        checkboxContainer.addEventListener("click", () => {
            task.IsCompleted = !task.IsCompleted;
            updateTodo(task);
        });

        input.addEventListener("keydown", (event) => {            
            if (event.key === "Enter") {                
                event.preventDefault(); 
                task.Description = todo.querySelector<HTMLInputElement>("input[type='text']")?.value ?? task.Description;
                updateTodo(task);
            }
        });

        deleteBtn.addEventListener("click", () => {
            deleteTodo(task.Id);
            refreshTodosList();
        });
    });       
}

function resetFilters(){
    let todoItems = document.querySelectorAll(`.container-row.todo-item`);

    todoItems.forEach(todo => {
        todo.classList.remove("hidden");
    });

    toggleClass(".active-filter-btn", "active", true);
    toggleClass(".all-filter-btn", "active", false);
    toggleClass(".completed-filter-btn", "active", true);
}

function toggleClass(selector:string, className:string, remove:boolean){
    let elements = document.querySelectorAll(selector);

    elements.forEach(element => {
        if(remove){
            element.classList.remove(className);
        } else {
            element.classList.add(className);
        }
    });    
}

function FilterActive(filterIsComplete: boolean){
    resetFilters();
    let todoItems = document.querySelectorAll(`.container-row.todo-item[data-completed="${!filterIsComplete}"]`);

    todoItems.forEach(todo => {
        todo.classList.add("hidden");
    });

    if(filterIsComplete) {
        toggleClass(".active-filter-btn", "active", true);
        toggleClass(".all-filter-btn", "active", true);
        toggleClass(".completed-filter-btn", "active", false);
    }
    else {
        toggleClass(".active-filter-btn", "active", false);
        toggleClass(".all-filter-btn", "active", true);
        toggleClass(".completed-filter-btn", "active", true);
    }
}

interface Todo {
    Id:string,
    Description:string,
    IsCompleted:boolean
}