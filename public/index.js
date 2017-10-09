'use strict'
/**
 * Create all variables and set up listeners for them.
 */
const registerForm = document.querySelector('.registerForm')
const loginForm = document.querySelector('.loginForm')

const deleteInput = document.querySelector('.DeleteItemInput')
const deleteButton = document.querySelector('.DeleteItemButton')
deleteButton.addEventListener('click', deleteItem)

const listButton = document.querySelector('.ListItemButton')
listButton.addEventListener('click', listItem)

const pantryList = document.querySelector('.pantryList')

const modalButton = document.querySelector('.loginButton')
const modal = document.querySelector('#myModal')
const closeSpan = document.querySelector(".close")

const registerButton = document.querySelector('.showRegister')
const loginButton = document.querySelector('.showLogin')
const logoutButton = document.querySelector('.logout')

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

    console.log(username.value)
    console.log(password.value)

    axios
        .post(`/api/pantry/?cmd=register&username=${username.value}&password=${password.value}`)
        .then(response => {
            console.log("register response", response)
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem('username', username.value)
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
    axios
        .post(`/api/pantry/?cmd=login&username=${username.value}&password=${password.value}`)
        .then((response) => {
            console.log("login response", response)
            localStorage.setItem("isLoggedIn", true)
            localStorage.setItem('username', username.value)
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
function listItem() {
    console.log("list")
    axios
        .get(`/api/pantry/?cmd=list&username=${ 'username'}`)
        .then((response) => {
            console.log("response: ")
            console.table(response.data.data)
            // console.table(response.data.foods) console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}

/**
 * shows the div of pantrylist and later list all items in the DB for the user
 */
function showPantryList() {
    let isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn == 'true') {
        console.log("logged in")
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
