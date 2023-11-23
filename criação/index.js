
 
 
var todoList = [{
  'todo': 'Do task 0',
  'id': 'todo0'
}, {
  'todo': 'Do task 1',
  'id': 'todo1'
}, {
  'todo': 'Do task 2',
  'id': 'todo2'
}, {
  'todo': 'Do task 3',
  'id': 'todo3'
}, {
  'todo': 'Do task 4',
  'id': 'todo4'
}, {
  'todo': 'Do task 5',
  'id': 'todo5'
}, {
  'todo': 'Do task 6',
  'id': 'todo6'
}, {
  'todo': 'Do task 7',
  'id': 'todo7'
}, {
  'todo': 'Do task 8',
  'id': 'todo8'
}, {
  'todo': 'Do task 9',
  'id': 'todo9'
}, {
  'todo': 'Do task 10',
  'id': 'todo10'
}, {
  'todo': 'Do task 11',
  'id': 'todo11'
}, {
  'todo': 'Do task 12',
  'id': 'todo12'
}, {
  'todo': 'Do task 13',
  'id': 'todo13'
}, {
  'todo': 'Do task 14',
  'id': 'todo14'
}];

var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;

function newElement() {
  var inputUrs = document.getElementById('urs').value,
    inputDate = document.getElementById('due-date').value,
    todo = '';
  if (inputUrs === '') {
    alert("Por favor preencha o campo cronograma");
    return;
  } else {
    todo = inputUrs;
    if (inputUrs != '') {
      todo = inputUrs + " needs to " + inputDate;
    }
    if (inputDate != '') {
      todo = todo + " by " + inputDate
    }
  }
  var newTodoId = findNextId(),
    newTodo = {
      'todo': todo,
      'id': 'todo' + newTodoId
    };
  todoList.push(newTodo);
  sortElementsById();
  clearFields();
}

function fetchIdFromObj(todo) {
  return parseInt(todo.id.slice(4));
}

function findNextId() {
  if (todoList.length === 0) {
    return 0;
  }
  var lastElementId = fetchIdFromObj(todoList[todoList.length - 1]),
    firstElementId = fetchIdFromObj(todoList[0]);
  return (firstElementId >= lastElementId) ? (firstElementId + 1) : (lastElementId + 1);
}

function clearFields() {
  document.getElementById('urs').value = '';
  document.getElementById('due-date').value = '';
}

function deleteElement(event) {
  var idOfEltToBeDeleted = event.target.parentElement.id;
  var arrayIndex = todoList.findIndex(function(singleTodo) {
    return singleTodo.id === idOfEltToBeDeleted;
  });
  if (arrayIndex !== -1) {
    todoList.splice(arrayIndex, 1);
  }
  load(todoList);
}

function displayOneElement(todoObject) {
  var li_element = document.createElement("li");
  var p_element = document.createElement("p");
  p_element.className = "task-name";
  li_element.appendChild(p_element);
  li_element.setAttribute("id", todoObject.id);
  var text_node = document.createTextNode(todoObject.todo);
  p_element.appendChild(text_node);
  var span_element = document.createElement("SPAN");
  span_element.className = "close";
  var txt_node = document.createTextNode("\u00D7");
  span_element.appendChild(txt_node);
  span_element.onclick = deleteElement;
  li_element.appendChild(span_element);
  document.getElementById("task-list").appendChild(li_element);
}


function getNumberOfPages(manyTodos) {
  return Math.ceil(manyTodos.length / numberPerPage);
}

function gotoPage(event) {
  currentPage = parseInt(event.target.id);
  loadList(todoList);
}

function refreshPaginations() {
  var paginationTarget = document.getElementById('pagination'),
    setActiveClass = false;
  paginationTarget.innerHTML = '';
  for (var i = 1; i <= numberOfPages; i++) {
    var li_element = document.createElement("li"),
      a_element = document.createElement('a');
    if (i === currentPage) {
      li_element.className = 'active';
      setActiveClass = true;
    } else {
      a_element.onclick = gotoPage;
    }
    a_element.setAttribute('id', i);
    a_element.innerHTML = i;
    li_element.appendChild(a_element);
    paginationTarget.appendChild(li_element);
  }
  if (numberOfPages > 0 && setActiveClass === false) {
    currentPage = 1;
    refreshPaginations();
    loadList(todoList);
  }
}

function loadList(manyTodos) {
  var begin = ((currentPage - 1) * numberPerPage);
  var end = begin + numberPerPage;
  pageList = manyTodos.slice(begin, end);
  refreshPaginations();
  drawList(pageList);
}

function drawList(manyTodos) {
  document.getElementById("task-list").innerHTML = "";
  manyTodos.forEach(function(singleTodo) {
    displayOneElement(singleTodo);
  });
}

function load(manyTodos) {
  numberOfPages = getNumberOfPages(manyTodos);
  loadList(manyTodos);
}

window.onload = function() {
  sortElementsById();
}

if(formgroup !== null && formgroup !== ''){
  document.getElementsById("gravar").desabled=false;

} else{
  document.getElementById("gravar").disabled=true;
}



if(formulario !== null && formulario !== ''){
  document.getElementsById("submit").desabled=false;

} else{
  document.getElementById("reset").disabled=true;
}

