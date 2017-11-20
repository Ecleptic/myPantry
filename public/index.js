//i don't understand alot about what's going on in this file lol - mike
'use strict'
/**
 * Create all variables and set up listeners for them.
 */

// my svgs :smile: - mike All of the things. the pantry list and buttons and all
// that - k but I don't know the difference between const and let. Is it that
// let can be changed? -kaylee
const delImg = "svg/closedTrashCan.svg"
const editImg = "svg/pencil.svg"

const registerForm = document.querySelector('.registerForm')
const loginForm = document.querySelector('.loginForm')

const pantryList = document.querySelector('.pantryList')

const modalButton = document.querySelector('.loginButton')
const modal = document.querySelector('#myModal')
const closeSpan = document.querySelectorAll(".close")
let itemModal = document.querySelector('#itemModal')

let foodname_h3 = document.querySelector('.foodname_h3')
let categoryInput = document.querySelector('.categoryInput')
let typeInput = document.querySelector('.typeInput')
let expirationInput = document.querySelector('.expirationInput')
let suggestedStorageInput = document.querySelector('.suggestedStorageInput')
let updateDescriptionButton = document.querySelector('.updateDescriptionButton')
updateDescriptionButton.addEventListener('click', updateFoodDetails)

const registerButton = document.querySelector('#registerHereButton')
const logoutButton = document.querySelector('.logout')
const registerParagraph = document.querySelector('.registerParagraph')

const usernameTitleSpan = document.querySelector('.usernameTitleSpan')
const itemsListUL = document.querySelector('.itemsList')

const addItemInput = document.querySelector('.addNewItemInput')
const addItemButton = document.querySelector('.addNewItemButton')
const paragraphBox = document.querySelector('.paragraphContent')
addItemButton.addEventListener('click', addItem)
addItemButton.addEventListener('touchend', addItem)

//don't really know what this does - kaylee
addItemInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        addItemButton.click()
    }
})

// not sure what this is - mike I think this is the search, but I don't know
// what keyup is - kaylee
const searchItemInput = document.querySelector('.searchItemInput')
searchItemInput.addEventListener("change", displayMatches)
searchItemInput.addEventListener("keyup", displayMatches)

function findMatches(wordToMatch, listOfItems) {
    return listOfItems.filter(food => {
        // find matches
        const regex = new RegExp(wordToMatch, 'gi')
        return food
            .foodname
            .match(regex)
        // console.log(food.foodname)
    })
}

// or this - mike idk what clearlistitems() does, but it looks like this finds
// the value that was searched and displays it? -kaylee
function displayMatches() {
    console.log(this.value)
    const matchArray = findMatches(this.value, allItems)
    console.log(matchArray)
    if (this.value === '') {
        listOfItems = allItems
        clearListItems()
        showListItems()
    } else {
        listOfItems = matchArray
        clearListItems()
        showListItems()
    }
}

//create empty lists? - mike agreed -kaylee
let allItems = []
let listOfItems = []
let isEditing = false
let CurrentEditInput = ''

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

// 'eventlistener' some kind of input from user, click or hover, etc. - mike
// when what modal is clicked? I though the modal came up automatically - kaylee
modalButton.addEventListener('click', () => {
    console.log("click")
    modal.style.display = "block"

})

/**
 * When clicking the 'X' on the modal, hide the modal
 */
//I understand -kaylee
closeSpan.forEach(key => key.addEventListener("click", () => {
    console.log('click!')
    modal.style.display = "none"
    itemModal.style.display = "none"
}))

/**
 * When clicking off the modal, hide the modal
 */
//I also understand - kaylee
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none"
    } else if (event.target === itemModal) {
        itemModal.style.display = "none"
    }
}

/**
 * When submitting the register form, send a post request to the server with the username and password
 *  and then if the response is true, then login, else catch the error
 */
//register - mike I agree - kaylee
registerForm.onsubmit = () => {
    let username = document.querySelector('.RegisterFormUsername')
    let password = document.querySelector('.RegisterFormPassword')

    localStorage.setItem('username', username.value.toLowerCase())
    axios
        .post(`/api/pantry/?cmd=register&username=${username.value}&password=${password.value}`)
        .then(response => {
            console.log("register response", response)
            localStorage.setItem("isLoggedIn", true)
            showPantryList()
            modal.style.display = "none"
            itemModal.style.display = "none"
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
//login - mike agree - kaylee
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
            showErrorMessage()
            // alert(error)
        });
    username.value = ''
    password.value = ''

    return false
}
//if there's an error - kaylee
function showErrorMessage() {
    document
        .querySelector('.loginError')
        .classList
        .remove('hidden')
}

/**
 * when the button to show register in the modal is clicked, show it and hide the login form
 */
//i understand - kaylee
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
// loginButton.addEventListener('click', () => {     loginForm .classList
// .remove('hidden')     registerForm         .classList    .add('hidden') })

/**
 * shows the div of pantrylist and later list all items in the DB for the user
 */
// display list when user is logged in - mike showing pantry list and hiding all
// the other stuff -kaylee
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

//not sure what this is about - mike
/**
 * adds username to the text in usernameTitleSpan
 * TODO: add more to it or put this somewhere else
 */
// supposed to be like "welcome username"? add the username to the title? -
// kaylee
function getUserInfo() {
    let username = localStorage.getItem("username")
    usernameTitleSpan.innerText = username[0].toUpperCase() + username.slice(1)
}

/**
 * Sends a get request for all items with the username saved in localstorage
 * adds each item separately to the list of items then callse showListItems()
 */
//get's the specific user's list - kaylee
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
                allItems.push(...items) // push each item separately into the list listOfItems
                showListItems()
            })
            .catch(error => {
                console.error(error)
            })
    }
}
//shows the user's list and all the delete and edit buttons - kaylee
function showListItems() {
    for (let i of listOfItems) {
        let li = document.createElement("li")
        let span = document.createElement("span")
        span.textContent = i.foodname
        span.className = "itemName"

        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "checkbox"
        checkbox.checked = i.checked
        if (i.checked)
            li.classList.add('isChecked')

        let deleteButton = document.createElement("img")
        deleteButton.className = "deleteButton"

        deleteButton.src = delImg
        deleteButton.alt = "Delete Button"

        let editButton = document.createElement("img")
        editButton.src = editImg
        editButton.alt = "Edit Button"
        editButton.className = "editButton"

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(deleteButton)
        li.appendChild(editButton)
        itemsListUL.appendChild(li)
    }
    // TODO: Sort items by checked and maybe by alphabetical too. listen for all of
    // the buttons to be clicked - kaylee
    let deleteButtons = document.querySelectorAll(".deleteButton")
    deleteButtons.forEach(key => key.addEventListener("click", del))

    deleteButtons.forEach(key => key.addEventListener("mouseover", delMouseOver))
    deleteButtons.forEach(key => key.addEventListener("mouseout", delMouseOut))

    let editButtons = document.querySelectorAll(".editButton")
    editButtons.forEach(key => key.addEventListener("click", edit))

    editButtons.forEach(key => key.addEventListener("mouseover", editMouseOver))
    editButtons.forEach(key => key.addEventListener("mouseout", editMouseOut))

    let checkboxes = document.querySelectorAll(".checkbox")
    checkboxes.forEach(key => {
        key.addEventListener('change', checked)
    })
    let textItems = document.querySelectorAll('.itemName')
    textItems.forEach(key => {
        key.addEventListener('click', itemClick)
    })
}
//don't know - kaylee
function itemClick(e) {
    // console.log("clicked item")
    let foodname = e
        .srcElement
        .innerText
        .toLowerCase()
    console.log(foodname)
    // show modal, then send http requests

    axios
        .get(`/api/pantry/?cmd=getItemDesc&foodname=${foodname}`)
        .then(response => {
            console.log("response:")
            // console.table(response.data.items[0])
            showItemModal(response.data.items[0])
        })
        .catch(error => {
            console.error(error)
        })
}
//don't know what item modal is - kaylee
function showItemModal(itemsList) {

    console.table(itemsList)
    itemModal.style.display = "block"

    foodname_h3.textContent = itemsList
        .foodname
        .toUpperCase()
    categoryInput.value = itemsList.category
    typeInput.value = itemsList.type
    expirationInput.value = itemsList.expiration
    suggestedStorageInput.value = itemsList.suggestedStorage

}

function delMouseOver(e) {
    console.log("mouseovering", e.target.src)
    e.target.src = "/svg/openedTrashCan.svg"
}
function delMouseOut(e) {
    console.log("mouseouting", e.target.src)
    e.target.src = "/svg/closedTrashCan.svg"

}
function editMouseOver(e) {
    console.log("mouseovering", e.target.src)
    e.target.src = "/svg/pencilPaper.svg"

}
function editMouseOut(e) {
    console.log("mouseouting", e.target.src)
    e.target.src = "/svg/pencil.svg"

}
// i get that all of these are the attributes in the table but I don't know what
// it actually does, other than convert it all to lower case - kaylee
function updateFoodDetails() {

    let foodname = foodname_h3
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
        .post(`/api/pantry/?cmd=editFoods&foodname=${foodname}&category=${category}&type=${type}&expiration=${expiration}&storage=${storage}`)
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error(error)
        })
}
//delete something with the username in the table - kaylee
function del(e) {
    let username = localStorage.getItem("username")
    isEditing = false
    axios
        .delete(`/api/pantry/?cmd=delItem&item=${e.target.parentNode.childNodes[1].textContent}&username=${username}`)
        .then(response => {
            console.log(response)
        })
    e
        .target
        .parentNode
        .parentNode
        .removeChild(e.target.parentNode)
}
//edit stuff - kaylee
function edit(e) {
    if (!isEditing) {
        let username = localStorage.getItem("username")

        isEditing = true
        // e.target.parentNode.childNodes[1].textContent = "pie" let oldText =
        // e.target.parentNode.childNodes[1].textContent
        let input = document.createElement('input')
        input.type = 'text'
        input.className = 'editInput'
        input.style = 'margin-left:.75rem;'
        e
            .target
            .parentNode
            .appendChild(input)
        let watchInput = document.querySelector('.editInput')
        watchInput.focus()
        watchInput.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                axios.post(`/api/pantry/?cmd=edit&item=${CurrentEditInput.toLowerCase()}&username=${username}&oldItem=${e.target.parentNode.childNodes[1].textContent.toLowerCase()}&checked=${e.target.checked}`).then(response => {
                    console.log(response)
                })
                e.target.parentNode.childNodes[1].textContent = CurrentEditInput.toLowerCase()
                e
                    .target
                    .parentNode
                    .removeChild(e.target.parentNode.childNodes[4]) // remove input box
                isEditing = false

            }
        })
        watchInput.addEventListener('focusout', e => {
            e
                .target
                .parentNode
                .removeChild(e.target.parentNode.childNodes[4])
            isEditing = false
        })
        watchInput.addEventListener('keyup', getInputText)
        watchInput.addEventListener('change', getInputText)
        console.log(watchInput)

        // e.target.parentNode.removeChild(e.target.parentNode.childNodes[1]) // remove
        // old text

    }
}
//if you check the item.. but I don't know what a lot of it means- kaylee
function checked(e) {
    // console.log("checked") console.log(e.target.checked)
    let username = localStorage.getItem("username")

    CurrentEditInput = e
        .target
        .parentNode
        .childNodes[1]
        .textContent
        .toLowerCase()

    if (e.target.checked === true) {
        axios.post(`/api/pantry/?cmd=edit&item=${CurrentEditInput}&username=${username}&oldItem=${e.target.parentNode.childNodes[1].textContent}&checked=${ (e.target.checked)}`).then(response => {
            console.log(response)
        })
        e
            .target
            .parentNode
            .classList
            .add('isChecked')
    } else {
        console.log("not checked")
        console.log((e.target.checked))
        axios.post(`/api/pantry/?cmd=edit&item=${CurrentEditInput}&username=${username}&oldItem=${e.target.parentNode.childNodes[1].textContent}&checked=${ (e.target.checked)}`).then(response => {
            console.log(response)
        })
        e
            .target
            .parentNode
            .classList
            .remove('isChecked')
    }

}
function getInputText() {
    console.log(this.value)
    CurrentEditInput = this.value
}

/**
 * When the logout button is clicked, set isLoggedIn to false,
 * remove all data off screen and reload the page
 */
//logout. call showpantrylist to reset all the hidden stuff - kaylee
function logout() {
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
// i get that this is to create an item, but I don't understand post requests,
// really - kaylee
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
// same as above - kaylee
function deleteUser() {
    console.log("deleted")
    let id = deleteInput.value
    let username = localStorage.getItem("username")
    console.log("delete:", id)
    axios
        .delete(`/api/pantry/?cmd=delUser,id=${id}`)
        .then(response => {
            console.log(response)
        })
    deleteInput.value = ''
}
/**
 * Send the command to list everything in the users database
 * (will need to change it to list all questions)
 */
//idk - kaylee
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
//add item to listofitems and allitems - kaylee
function addItem() {
    let newItem = addItemInput
    let username = localStorage
        .getItem("username")
        .toLowerCase()
    let checked = false

    listOfItems.push({
        'username': username,
        'foodname': newItem
            .value
            .toLowerCase(),
        'checked': checked
    })
    allItems.push({
        'username': username,
        'foodname': newItem
            .value
            .toLowerCase(),
        'checked': checked
    })

    axios.post(`/api/pantry/?cmd=addItem&username=${username}&item=${newItem.value.toLowerCase()}`).then(() => {
        // showPantryList()
        showNewListItem()
        modal.style.display = "none"
    }).catch((error) => {
        console.error(error)
    });
    newItem.value = ''
}

/**
 * Whenever a new item is created (instead of pulled from the DB)
 * we then append it to the end of the current list on the DOM
 */
//don't know that the DOM is - kaylee
function showNewListItem() {
    let newItem = listOfItems[listOfItems.length - 1]

    let li = document.createElement("li")
    let span = document.createElement("span")
    span.textContent = newItem.foodname
    span.className = "itemName"

    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "checkbox"

    let deleteButton = document.createElement("img")
    deleteButton.className = "deleteButton"

    deleteButton.src = delImg
    deleteButton.alt = "Delete Button"

    let editButton = document.createElement("img")
    editButton.src = editImg
    editButton.alt = "Edit Button"
    editButton.className = "editButton"

    deleteButton.addEventListener("click", del)
    deleteButton.addEventListener("mouseover", delMouseOver)
    deleteButton.addEventListener("mouseover", "mouseout", delMouseOut)

    editButton.addEventListener("click", edit)
    editButton.addEventListener("mouseover", editMouseOver)
    editButton.addEventListener("mouseout", editMouseOut)
    span.addEventListener('click', itemClick)
    checkbox.addEventListener('change', checked)
    // deleteButton.addEventListener("touchend", del)
    // editButton.addEventListener("touchend", edit)

    li.appendChild(checkbox)
    li.appendChild(span)
    li.appendChild(deleteButton)
    li.appendChild(editButton)

    itemsListUL.appendChild(li)
}

/**
 * Clearing the list holding the items so we can rebuild it
 */
// I don't at all understand what this does. Does it just set listofitems back
// to empty, so that we won't have a bunch of duplicate stuff added to it every
// time the list is modified? - kaylee
function clearListItems() {
    console.log("clearing list items")
    if (itemsListUL) {
        while (itemsListUL.firstElementChild) {
            console.log("removing:", itemsListUL.firstChild)
            itemsListUL.removeChild(itemsListUL.firstChild)
        }
    }
}
//check an item off the list? - kaylee
function check() {
    document
        .getElementById("myCheck")
        .checked = true;
}
//uncheck the item in the list? -kaylee
function uncheck() {
    document
        .getElementById("myCheck")
        .checked = false;
}
