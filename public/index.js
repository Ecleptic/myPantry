'use strict'

const searchItemInput = document.querySelector('.searchItemInput')
searchItemInput.addEventListener("change", displayMatches)
searchItemInput.addEventListener("keyup", displayMatches)

function findMatches(wordToMatch, items) {
    return items.filter(food => {
        const regex = new RegExp(wordToMatch, 'gi')
        return food
            .name
            .match(regex)
    })
}

function displayMatches() {
    const matchArray = findMatches(this.value, items)
    if (this.value === '') {
        populateList(items, itemsList)
    } else {
        let listOfItems = matchArray
        populateList(listOfItems, itemsList)
    }
}

const addItems = document.querySelector('.add-items')
const itemsList = document.querySelector('.itemsList')
addItems.addEventListener('submit', addItem)
itemsList.addEventListener('click', itemSelect)
itemsList.addEventListener("mouseout", mouseOut)
itemsList.addEventListener("mouseover", mouseOver)

const itemModal = document.querySelector('#itemModal')
const modal = document.querySelector('#myModal')
const closeSpan = document.querySelectorAll(".close")

// const items = JSON.parse(localStorage.getItem('items')) || []
const items = []
let username
let isEditing

function addItem(e) {
    e.preventDefault()
    const name = (this.querySelector('[name=item]'))
        .value
        .toLowerCase()
    const item = {
        name,
        checked: false
    }

    {
        axios
            .post(`/api/pantry/?cmd=addItem&username=${username}&item=${name}`)
            .then(() => {
                // showPantryList() showNewListItem() modal.style.display = "none"
            })
            .catch((error) => {
                console.error(error)
            })
    }
    items.push(item)
    populateList(items, itemsList)
    localStorage.setItem('items', JSON.stringify(items))

    this.reset()
}

function populateList(itemsList = [], HTMLlist) {
    HTMLlist.innerHTML = itemsList.map((todo, i) => {
        return `
        <li>
          <input type="checkbox" class="checkbox" data-index=${i} id="item${i}" ${todo.checked
            ? 'checked'
            : ''} />
          <span class="itemName">${todo.name}</span>
          <img class="deleteButton" src="/svg/closedTrashCan.svg" alt="Delete Button">
          <img class="editButton" src="/svg/pencil.svg" alt="Edit Button" >
        </li>
      `
    }).join('')
}

function mouseOver(e) {
    const eClass = e
        .target
        .getAttribute("class")
    if (eClass === 'deleteButton') {
        e.target.src = "/svg/openedTrashCan.svg"
    } else if (eClass === 'editButton') {
        e.target.src = "/svg/pencilPaper.svg"
    }
}
function mouseOut(e) {
    const eClass = e
        .target
        .getAttribute("class")
    if (eClass === 'deleteButton') {
        e.target.src = "/svg/closedTrashCan.svg"
    } else if (eClass === 'editButton') {
        e.target.src = "/svg/pencil.svg"
    }
}

function itemSelect(e) {
    const eClass = e
        .target
        .getAttribute("class")
    if (eClass === 'checkbox') {
        const el = e.target
        const index = el.dataset.index
        console.log(items[index].name)
        items[index].checked = !items[index].checked

        {
            axios.post(`/api/pantry/?cmd=edit&item=${items[index].name}&username=${username}&oldItem=${items[index].name}&checked=${ (e.target.checked)}`).then(response => {
                console.log(response)
            })
        }
        localStorage.setItem('items', JSON.stringify(items))
        populateList(items, itemsList)

    } else if (eClass === 'itemName') {
        console.log(e.target.textContent)
        console.log('item')
        {
            axios
                .get(`/api/pantry/?cmd=getItemDesc&name=${e.target.textContent}`)
                .then(response => {
                    console.log("response:")
                    // console.table(response.data.items[0])
                    showItemModal(response.data.items[0])
                })
                .catch(error => {
                    console.error(error)
                })
        }
    } else if (eClass === 'deleteButton') {
        deleteItemFromList(e)
        populateList(items, itemsList)

    } else if (eClass === 'editButton') {
        // console.log('editButton')
        edit(e)

    }

}

function deleteItemFromList(e) {
    isEditing = false
    {
        axios
            .delete(`/api/pantry/?cmd=delItem&item=${e.target.parentNode.childNodes[3].textContent}&username=${username}`)
            .then(response => {
                console.log(response)
            })
    }

    for (const key in items) {
        if (items[key].name === e.target.parentNode.childNodes[3].textContent) {
            items.splice(key, 1)
        }
    }

}

function edit(e) {
    let currentEditInput = ''
    if (!isEditing) {
        isEditing = true
        // e.target.parentNode.childNodes[1].textContent = "pie" let oldText =
        // e.target.parentNode.childNodes[1].textContent
        let input = document.createElement('input')
        input.type = 'text'
        input.className = 'editInput'
        input.style = 'margin-left:.75rem'
        e
            .target
            .parentNode
            .appendChild(input)
        // debugger;
        let watchInput = document.querySelector('.editInput')
        watchInput.focus()
        watchInput.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                {
                    axios.post(`/api/pantry/?cmd=edit&item=${currentEditInput.toLowerCase()}&username=${username}&oldItem=${e.target.parentNode.childNodes[3].textContent.toLowerCase()}&checked=${e.target.checked}`).then(response => {
                        console.log(response)
                    })
                }

                e.target.parentNode.childNodes[3].textContent = currentEditInput.toLowerCase()
                isEditing = false
                console.log("Yes this is a known error...")
                delInput(e)

            }
            currentEditInput = e.target.value
            // console.log(currentEditInput) console.log(e.target.parentNode.childNodes[9])

        })
        watchInput.addEventListener('focusout', delInput)
        watchInput.addEventListener('keyup', getInputText)
        watchInput.addEventListener('change', getInputText)
        console.log(watchInput)

        // e.target.parentNode.removeChild(e.target.parentNode.childNodes[1]) // remove
        // old text

    }
}
function delInput(e) {
    e
        .target
        .parentNode
        .removeChild(e.target.parentNode.childNodes[9])
    isEditing = false
}
function getInputText() {
    // console.log(this.value)
    return this.value
}

function showItemModal(itemsList) {

    let foodname_h3 = document.querySelector('.foodname_h3')
    let categoryInput = document.querySelector('.categoryInput')
    let typeInput = document.querySelector('.typeInput')
    let expirationInput = document.querySelector('.expirationInput')
    let suggestedStorageInput = document.querySelector('.suggestedStorageInput')
    let updateDescriptionButton = document.querySelector('.updateDescriptionButton')
    updateDescriptionButton.addEventListener('click', updateFoodDetails)
    console.table(itemsList)
    itemModal.style.display = "block"

    foodname_h3.textContent = itemsList
        .name
        .toUpperCase()
    categoryInput.value = itemsList.category
    typeInput.value = itemsList.type
    expirationInput.value = itemsList.expiration
    suggestedStorageInput.value = itemsList.suggestedStorage

}

/**
 * Sends a get request for all items with the username saved in localstorage
 * adds each item separately to the list of items then callse showListItems()
 */
function getListItems() {
    let isLoggedIn = localStorage.getItem("isLoggedIn")

    if (isLoggedIn && username) {
        console.log("getting list of items")
        {
            axios
                .get(`/api/pantry?cmd=getList&username=${username}`)
                .then(response => {
                    let resItems = response.data.items
                    items.push(...resItems) // push each item separately into the list listOfItems
                    populateList(items, itemsList)
                })
                .catch(error => {
                    console.error(error)
                    items.push(...JSON.parse(localStorage.getItem('items'))) // if we can't connect, get it from local storage.
                })
        }
    }
}


function updateFoodDetails() {
    let foodname_h3 = document.querySelector('.foodname_h3')
    let categoryInput = document.querySelector('.categoryInput')
    let typeInput = document.querySelector('.typeInput')
    let expirationInput = document.querySelector('.expirationInput')
    let suggestedStorageInput = document.querySelector('.suggestedStorageInput')
    let name = foodname_h3
        .textContent
        .toLowerCase()
    let category = categoryInput
        .value
        .toLowerCase()
    let type = typeInput
        .value
        .toLowerCase()
    let expiration = expirationInput
        .value
        .toLowerCase()
    let storage = suggestedStorageInput
        .value
        .toLowerCase()

    axios
        .post(`/api/pantry/?cmd=editFoods&name=${name}&category=${category}&type=${type}&expiration=${expiration}&storage=${storage}`)
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function onLogin() {
    username = localStorage.getItem("username")
    const usernameTitleSpan = document.querySelector('.usernameTitleSpan')

    usernameTitleSpan.innerText = username[0].toUpperCase() + username.slice(1)

}

/**
 * When clicking the 'X' on the modal, hide the modal
 */
closeSpan.forEach(key => key.addEventListener("click", () => {
    console.log('click!')
    modal.style.display = "none"
    itemModal.style.display = "none"
}))

/**
 * when the page is loaded, run showPantryList() to check if the user is logged in
 */
window.onload = () => {
    console.log("loaded")
    onLogin()
    getListItems()
}