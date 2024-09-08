const input = document.querySelector('.form__input');
const box = document.querySelector('.box');
const menu = document.querySelector('.list');
let fragment = document.createDocumentFragment();
let repos;

input.addEventListener(
    'input',
    debounce(function (evt) {
        getRequest(evt.target.value, 5);
    }, 400)
);

async function getRequest(value, limit) {
    try {
        if (value.trim() === '') {
            return deletElem();
        }

        deletElem();
        const response = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=${limit}`);
        
        if (!response.ok) {
            throw new Error('Сетевая ошибка: ' + response.statusText);
        }

        const result = await response.json();
        repos = result.items;

        if (repos.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.textContent = 'Ничего не найдено';
            menu.appendChild(noResultsItem);
        } else {
            createElem(repos);
        }
    } catch (err) {
        console.error(err);
    }
}

function debounce(fn, timer) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), timer);
    };
}

function createElem(repos) {
    fragment = document.createDocumentFragment();
    
    repos.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list__item');
        listItem.textContent = item.name;

        fragment.appendChild(listItem);
    });

    menu.appendChild(fragment);
}

function deletElem() {
    menu.innerHTML = '';
}

menu.addEventListener('click', (evt) => {
    const name = evt.target.textContent;
    const elem = repos.find((item) => item.name === name);
    createBox(elem);
});

function createBox(elem) {
    const itemBox = document.createElement('div');
    itemBox.classList.add('box__item');

    itemBox.append(createItemInfo(elem));

    const btn = document.createElement('button');
    btn.classList.add('box__btn');
    itemBox.append(btn);

    btn.addEventListener('click', () => {
        itemBox.remove();
    });

    box.append(itemBox);

    input.value = '';
    deletElem();
}

function createItemInfo({ name, owner, stargazers_count }) {
    const itemInfo = document.createElement('div');
    itemInfo.classList.add('box__info');

    const nameInfo = document.createElement('div');
    nameInfo.textContent = 'Name: ' + name;

    const ownerInfo = document.createElement('div');
    ownerInfo.textContent = 'Owner: ' + owner.login;

    const starsInfo = document.createElement('div');
    starsInfo.textContent = 'Stars: ' + stargazers_count;

    itemInfo.append(nameInfo);
    itemInfo.append(ownerInfo);
    itemInfo.append(starsInfo);
    return itemInfo;
}
