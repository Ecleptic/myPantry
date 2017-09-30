'use strict'
// const CreateItem = document.querySelector('.CreateItem')
// const DeleteItem = document.querySelector('.DeleteItem')
// const ListItem = document.querySelector('.ListItem')

// CreateItem.addEventListener("click", createItem)
// DeleteItem.addEventListener("click", deleteItem)
// ListItem.addEventListener("click", listItem) axios is a really solid http
// request

let registerForm = document.querySelector('.registerForm')
let loginForm = document.querySelector('.loginForm')

registerForm.onsubmit = () => {
    let username = document.querySelector('.RegisterFormUsername')
    let password = document.querySelector('.RegisterFormPassword')

    console.log(username.value)
    console.log(password.value)

    axios
        .post(`/api/pantry/?cmd=register&username=${username.value}&password=${password.value}`)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        });

    username.value = ''
    password.value = ''
    return false
}

loginForm.onsubmit = () => {
    let username = document.querySelector('.LoginFormUsername')
    let password = document.querySelector('.LoginFormUsername')

    axios
        .post(`/api/pantry/?cmd=login&username=${username.value}&password=${password.value}`)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
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
    let id = 1 //TODO: get ID from input
    console.log(id)
    axios.delete(`/api/pantry/?id=${id}`)

}
function listItem() {
    console.log("list")
    axios
        .get('/api/pantry')
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}