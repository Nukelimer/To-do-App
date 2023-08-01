const API = 'https://api.quotable.io/quotes/random';
const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.tasks');
const taskItems = JSON.parse(localStorage.getItem('taskItems')) || [];
const paragraph = document.querySelector('p');
const quoteParent = document.querySelector('.quote');
const author = document.querySelector('h4');
const submit = document.querySelector('.input-text');
const deleteAll = document.querySelector('.delete');

function getInputTextHandler(event) {
  event.preventDefault();
  const value = this.querySelector('.submit').value;
  taskItem = {
    value,
    state: false,
  };
  taskItems.push(taskItem);
  populateList(taskItems, itemsList);
  localStorage.setItem('taskItems', JSON.stringify(taskItems));
  this.reset();
}

function populateList(task = [], taskList) {
  taskList.innerHTML = task
    .map((tsk, i) => {
      return `
    <li>
    <input type="checkbox" data-index=${i} id="taskItem${i}" ${
        tsk.state ? 'checked' : ''
      } />
    <label for="taskItem${i}">${tsk.value}</label>
    </li>
        `;
    })
    .join('');
}

function toggleDoneHandler(event) {
  if (!event.target.matches('input')) return;
  const element = event.target;
  const index = element.dataset.index;
  taskItems[index].state = !taskItems[index].state;
  localStorage.setItem('taskItems', JSON.stringify(taskItems));
  populateList(taskItems, itemsList);
}

async function getQuote(URL) {
  let fetching = await fetch(URL);
  const fetched = await fetching.json();
  if (fetching.status >= 200 && fetching.status < 299) {
    quoteParent.classList.add('show');
    const content = fetched[0].content;
    const getauthor = `-${fetched[0].author}`;
    paragraph.append(content);
    author.append(getauthor);
  }
}

deleteAll.addEventListener('click', () => {
  itemsList.remove();
  localStorage.clear();
});

submit.addEventListener('submit', getInputTextHandler);
itemsList.addEventListener('click', toggleDoneHandler);
populateList(taskItems, itemsList);
getQuote(API);
