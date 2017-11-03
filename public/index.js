'use strict'
/**
 * Create all variables and set up listeners for them.
 */
const registerForm = document.querySelector('.registerForm')
const loginForm = document.querySelector('.loginForm')

const deleteInput = document.querySelector('.DeleteItemInput')
const deleteButton = document.querySelector('.DeleteItemButton')
deleteButton.addEventListener('click', deleteItem)

const pantryList = document.querySelector('.pantryList')

const modalButton = document.querySelector('.loginButton')
const modal = document.querySelector('#myModal')
const closeSpan = document.querySelector(".close")

const registerButton = document.querySelector('#registerHereButton')
// const loginButton = document.querySelector('.showLogin')
const logoutButton = document.querySelector('.logout')
const registerParagraph = document.querySelector('.registerParagraph')

const usernameSpan = document.querySelector('.usernameSpan')
const itemsListUL = document.querySelector('.itemsList')
const itemsTable = document.querySelector('.itemsTable')

const addItemInput = document.querySelector('.addNewItemInput')
const addItemButton = document.querySelector('.addNewItemButton')
const paragraphBox = document.querySelector('.paragraph-content')
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
    if (event.target === modal) {
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
 * when the button to show register in the modal is clicked, show it and hide the login form
 */
registerButton.addEventListener('click', () => {
    // loginForm     .classList     .add('hidden')
    registerForm
        .classList
        .remove('hidden')
    registerParagraph
        .classList
        .add('hidden')
})

/**
 * when the button to show login in the modal is clicked, show it and hide the register form
 */
// loginButton.addEventListener('click', () => {
//     loginForm
//         .classList
//         .remove('hidden')
//     registerForm
//         .classList
//         .add('hidden')
// })

/**
 * shows the div of pantrylist and later list all items in the DB for the user
 */
function showPantryList() {
    let isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn === 'true') {
        console.log("logged in")
        getUserInfo()
        getListItems()
        pantryList
            .classList
            .remove('hidden')
        modalButton
            .classList
            .add('hidden')
        paragraphBox
            .classList
            .add('hidden')
        logoutButton
            .classList
            .remove('hidden')
    } else if (isLoggedIn === 'false') {
        console.log("not logged in")
        pantryList
            .classList
            .add('hidden')
        modalButton
            .classList
            .remove('hidden')
        paragraphBox
            .classList
            .remove('hidden')
        logoutButton
            .classList
            .add('hidden')

    }
}

/**
 * adds username to the text in usernameSpan
 * TODO: add more to it or put this somewhere else
 */
function getUserInfo() {
    let username = localStorage.getItem("username")
    usernameSpan.innerText = username.toUpperCase()
}

/**
 * Sends a get request for all items with the username saved in localstorage
 * adds each item separately to the list of items then callse showListItems()
 */
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
                listOfItems.push(...items) // push each item separately into the list listOfItems
                showListItems()
            })
            .catch(error => {
                console.error(error)
            })
    }
}

/**
 * Write a list item on the page for every item in listOfItems
 */
function showListItems() {
    // // itemsTable NOT CERTAIN IF WE WANT TO USE TABLES OR LISTS. PROBABLY LIST.
    // for (let i of listOfItems) {     let table = document.createElement('tr') let
    // foodItemTable = document.createElement('td')     let checkBox =
    // document.createElement('td')     let deleteItemButton =
    // document.createElement('td')     let editItemButton =
    // document.createElement('td')     let foodItem =
    // document.createTextNode(i.foodname) }

    for (let i of listOfItems) {
        let li = document.createElement('li')
        let span = document.createElement('span')
        let textNode = document.createTextNode(i.foodname)
        li.appendChild(textNode)
        itemsListUL.appendChild(li)
    }
}

/**
 * When the logout button is clicked, set isLoggedIn to false,
 * remove all data off screen and reload the page
 */
function logout(){
    localStorage.setItem("isLoggedIn", false)
    localStorage.removeItem('username')
    showPantryList()
    location.reload()
}
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
 * Send the command to list everything in the users database
 * (will need to change it to list all questions)
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

/**
 * Gets the text from the input
 * and sends an HTTP post request including username and the new item.
 */
function addItem() {
    let newItem = addItemInput
    let username = localStorage.getItem("username")
    let qty = null

    listOfItems.push({'username': username, 'foodname': newItem.value, 'qty/weight': qty})

    axios
        .post(`/api/pantry/?cmd=addItem&username=${username}&item=${newItem.value}`)
        .then(() => {
            // showPantryList()
            showNewListItem()
            modal.style.display = "none"
        })
        .catch((error) => {
            console.error(error)
        });
    newItem.value = ''
}

/**
 * Whenever a new item is created (instead of pulled from the DB)
 * we then append it to the end of the current list on the DOM
 */
function showNewListItem() {
    let newItem = listOfItems[listOfItems.length - 1]
    let li = document.createElement('li')
    let textNode = document.createTextNode(newItem.foodname)
    li.appendChild(textNode)
    itemsListUL.appendChild(li)
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