'use strict'
const CreateItem = document.querySelector('.CreateItem')
const DeleteItem = document.querySelector('.DeleteItem')
const ListItem = document.querySelector('.ListItem')

CreateItem.addEventListener("click", createItem)
DeleteItem.addEventListener("click", deleteItem)
ListItem.addEventListener("click", listItem)

// axios is a really solid http request
/**
 * sends a post request to create a new item
 */
function createItem() {
    console.log("created")
    axios
        .post('/api/pantry')
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
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
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error)
        })
}