'use strict'
const registerForm = document.querySelector('.registerForm')
const loginForm = document.querySelector('.loginForm')

const deleteInput = document.querySelector('.DeleteItemInput')
const deleteButton = document.querySelector('.DeleteItemButton')
deleteButton.addEventListener('click', deleteItem)


const listButton = document.querySelector('.ListItemButton')
listButton.addEventListener('click', listItem)

registerForm.onsubmit = () => {
    let username = document.querySelector('.RegisterFormUsername')
    let password = document.querySelector('.RegisterFormPassword')

    console.log(username.value)
    console.log(password.value)

    axios
        .post(`/api/pantry/?cmd=register&username=${username.value}&password=${password.value}`)
        .then(response => {
            console.log("register response", response)
        })
        .catch((error) => {
            console.error(error)
        });

    username.value = ''
    password.value = ''
    return false
}

loginForm.onsubmit = () => {
    let username = document.querySelector('.LoginFormUsername')
    let password = document.querySelector('.LoginFormPassword')
    axios
        .post(`/api/pantry/?cmd=login&username=${username.value}&password=${password.value}`)
        .then((response) => {
            console.log("login response", response)
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
    let id = deleteInput.value //TODO: get ID from input
    console.log("delete:", id)
    axios
        .delete(`/api/pantry/?id=${id}`)
        .then(response => {
            console.log(response)
        })

}

function listItem() {
    console.log("list")
    axios
        .get('/api/pantry/?cmd=list')
        .then((response) => {
            console.log("response: ")
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}