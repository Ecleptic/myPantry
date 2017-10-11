'use strict'
/**
 * Create all variables and set up listeners for them.
 */
const registerForm = document.querySelector('.registerForm')
const loginForm = document.querySelector('.loginForm')

const deleteInput = document.querySelector('.DeleteItemInput')
const deleteButton = document.querySelector('.DeleteItemButton')
deleteButton.addEventListener('click', deleteItem)

const listUserButton = document.querySelector('.ListUserButton')
listUserButton.addEventListener('click', listUsers)

const listItemButton = document.querySelector('.ListItemButton')
listItemButton.addEventListener('click', getListItems)

const pantryList = document.querySelector('.pantryList')

const modalButton = document.querySelector('.loginButton')
const modal = document.querySelector('#myModal')
const closeSpan = document.querySelector(".close")

const registerButton = document.querySelector('.showRegister')
const loginButton = document.querySelector('.showLogin')
const logoutButton = document.querySelector('.logout')

const usernameSpan = document.querySelector('.usernameSpan')
const itemsListUL = document.querySelector('.itemsList')

const addItemInput = document.querySelector('.addNewItemInput')
const addItemButton = document.querySelector('.addNewItemButton')
addItemButton.addEventListener('click', addItem)

let listOfItems = []

/**
 * when the page is loaded, run showPantryList() to check if the user is logged in
 */
window.onload = () => {
    console.log("loaded")
    showPantryList()
}

/**
 * when the button to show register in the modal is clicked, show it and hide the login form
 */
registerButton.addEventListener('click', () => {
    loginForm
        .classList
        .add('hidden')
    registerForm
        .classList
        .remove('hidden')
})

/**
 * when the button to show login in the modal is clicked, show it and hide the register form
 */
loginButton.addEventListener('click', () => {
    loginForm
        .classList
        .remove('hidden')
    registerForm
        .classList
        .add('hidden')
})

/**
 * When the modal is clicked, show it.
 */
modalButton.addEventListener('click', () => {
    console.log("click")
    modal.style.display = "block"
})

/**
 * When clicking the 'X' on the modal, hide the modal
 */
closeSpan.addEventListener('click', () => {
    modal.style.display = "none"
})

/**
 * When clicking off the modal, hide the modal
 */
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}

/**
 * When submitting the register form, send a post request to the server with the username and password
 *  and then if the response is true, then login, else catch the error
 */
registerForm.onsubmit = () => {
    let username = document.querySelector('.RegisterFormUsername')
    let password = document.querySelector('.RegisterFormPassword')

    localStorage.setItem('username', username.value)

    axios
        .post(`/api/pantry/?cmd=register&username=${username.value}&password=${password.value}`)
        .then(response => {
            console.log("register response", response)
            localStorage.setItem("isLoggedIn", true)
            showPantryList()
            modal.style.display = "none"
        })
        .catch((error) => {
            console.error(error)
        });
    username.value = ''
    password.value = ''
    return false
}

/**
 * When submitting the login form, send a post request to the server with the username and password
 *  and then if the response is true, then login, else catch the error
 */
loginForm.onsubmit = () => {
    let username = document.querySelector('.LoginFormUsername')
    let password = document.querySelector('.LoginFormPassword')

    localStorage.setItem('username', username.value)
    axios
        .post(`/api/pantry/?cmd=login&username=${username.value}&password=${password.value}`)
        .then((response) => {
            console.log("login response", response)
            localStorage.setItem("isLoggedIn", true)
            showPantryList()
            modal.style.display = "none"

        })
        .catch((error) => {
            console.log(error)
            alert(error)
        });
    username.value = ''
    password.value = ''

    return false
}

/**
 * When the logout button is clicked, set isLoggedIn to false, remove all data off screen and reload the page
 */
logoutButton.addEventListener('click', () => {
    localStorage.setItem("isLoggedIn", false)
    localStorage.removeItem('username')
    showPantryList()
    location.reload()
})

/**
 * sends a post request to create a new item
 */
function createItem() {
    console.log("created")
    axios
        .post('/api/pantry')
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * sends a new post request to delete an item at id
 */
function deleteItem() {
    console.log("deleted")
    let id = deleteInput.value
    console.log("delete:", id)
    axios
        .delete(`/api/pantry/?id=${id}`)
        .then(response => {
            console.log(response)
        })
    deleteInput.value = ''
}
/**
 * Send the command to list everything in the users database (will need to change it to list all questions)
 */
function listUsers() {
    console.log("listUsers")
    axios
        .get(`/api/pantry/?cmd=listUsers&username=${ 'username'}`)
        .then((response) => {
            console.log("response: ")
            console.table(response.data.users)
            // console.table(response.data.foods) console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

function getListItems() {
    let isLoggedIn = localStorage.getItem("isLoggedIn")
    let username = localStorage.getItem("username")

    if (isLoggedIn && username) {
        console.log("getting list of items")
        axios
            .get(`/api/pantry?cmd=getList&username=${username}`)
            .then(response => {
                let items = response.data.items
                console.log("Response: " + response)
                listOfItems.push(...items)
                showListItems()
            })
            .catch(error => {
                console.error(error)
            })
    }
}

/**
 * shows the div of pantrylist and later list all items in the DB for the user
 */
function showPantryList() {
    let isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn == 'true') {
        console.log("logged in")
        getUserInfo()
        getListItems()
        pantryList
            .classList
            .remove('hidden')
        modalButton
            .classList
            .add('hidden')
    } else if (isLoggedIn == 'false') {
        console.log("not logged in")
        pantryList
            .classList
            .add('hidden')
        modalButton
            .classList
            .remove('hidden')

    }
}

function getUserInfo() {
    let username = localStorage.getItem("username")
    let isLoggedIn = localStorage.getItem("isLoggedIn")

    usernameSpan.innerText = username.toUpperCase()
}

 function showListItems() {
        for (let i of listOfItems) {
            let li = document.createElement('li')
            let textNode = document.createTextNode(i.foodName)
            li.appendChild(textNode)
            itemsListUL.appendChild(li)
        }
}

function showNewListItem(newItem){
    let li = document.createElement('li')
    let textNode = document.createTextNode()

}

function addItem() {
    let newItem = addItemInput
    let username = localStorage.getItem("username")

    console.log("newItemValue: ", newItem.value)
    axios
        .post(`/api/pantry/?cmd=addItem&username=${username}&item=${newItem.value}`)
        .then(() => {
            showPantryList()
            modal.style.display = "none"
        })
        .catch((error) => {
            console.error(error)
        });
    newItem.value = ''
}

/**
 * Clearing the list holding the items so we can rebuild it
 */
  function clearListItems() {
        console.log("clearing list items")
        if (itemsListUL) {
            while (itemsListUL.firstElementChild) {
                console.log("removing:", itemsListUL.firstChild)
                itemsListUL.removeChild(itemsListUL.firstChild)
            }
        }
}