'use strict'

//call file with sql commands - mike
const dbCommandFile = require('./dbCommands')
const dbcommands = new dbCommandFile()

module.exports = class dbLink {
    /**
     * run command to connect to the PostgreSQL Database
     */
    connect() {
        dbcommands.connectDB()
    }

    /**
     * If the command is 'list', then send the db command of listItems()
     *      which resolves into an object listing the database
     * @param {Request} req
     * @param {Response} res
     */
    get(req, res) {
        let command = req.query.cmd
        let username = req.query.username
        let foodname = req.query.foodname

//list all users in db - mike
        if (command === 'listUsers') {
            console.log('list')
            dbcommands
                .listUsers()
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'success', users: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        //get specific list associated with user? - mike
        } else if (command === 'getList') {
            console.log("getting list in dbLink")
            dbcommands
                .getList({username: username})
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'Success', items: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error, problem: "Error in getList Function"})
                })
        //get item description :smile: - mike
        } else if (command === 'getItemDesc') {
            console.log(command)
            console.log(foodname)
            dbcommands
                .getFoodDetails({foodname: foodname})
                .then(data => {
                    res
                        .status(200)
                        .json({status: 'successful edit', items: data})
                })
                .catch(error => {
                    console.error(error)
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }

    /**
     * for now this command just creates a user need to refactor or split to something else
     * @param {Request} req
     * @param {Response} res
     */
    insert(req, res) {
        console.log("inserting")
        let command = req.query.cmd
        let username = req.query.username
        let password = req.query.password
        let newItem = req.query.item
        let oldItem = req.query.oldItem
        let checked = req.query.checked

		//register new user - mike
        if (command === 'register') {
            console.log('register')
            let register = dbcommands.insert({command: 'register', username: username, password: password})
            register.then(resolve => {
                console.log(resolve)
                res
                    .status(200)
                    .json({status: 'successful register'})

            }).catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
            
        //login existing user - mike
        } else if (command === 'login') {
            let login = dbcommands.getLogin({username: username, password: password})
            login.then(resolve => {
                if (resolve) {
                    res
                        .status(200)
                        .json({status: 'successful login', data: resolve.username})
                }
            }).catch(error => {
                res
                    .status(404)
                    .json({status: 'Not Exist', error: error})
            })
        
        //add new item to user list - mike
        } else if (command === 'addItem') {
            console.log("new Item: ", newItem)
            // First Check to make sure that food is in the Database:
            dbcommands
                .getItemInList({foodname: newItem})
                .then(() => {
                    let addItem = dbcommands.insert({command: 'newItem', username: username, newItem: newItem})
                    addItem.then(resolve => {
                        console.log(resolve)
                        res
                            .status(200)
                            .json({status: 'successful add', items: resolve})
                    }).catch(error => {
                        res
                            .status(500)
                            .json({status: 'Error', error: error})
                    })
                })
                .catch(error => {
                    console.log("OMG THERE'S AN ERROR!!! 😵")
                    // Need to embed thens inside thens to make sure it only pushes it if there are
                    // no errors....
                    dbcommands
                    //item added to foods table, then added to list? - mike
                        .insert({command: 'addFood', newItem: newItem})
                        .then(() => {
                            console.log("okay now we've added it to the foods table, next is to add it to the list.")
                            let addItem = dbcommands.insert({command: 'newItem', username: username, newItem: newItem})
                            addItem.then(resolve => {
                                console.log(resolve)
                                res
                                    .status(200)
                                    .json({status: 'successful add', items: resolve})
                            }).catch(error => {
                                res
                                    .status(500)
                                    .json({status: 'Error', error: error})
                            })
                        })
                    console.error(error)
                })
		
		//edit item attributes - mike
        }  else if (command === 'edit') {
            dbcommands
                .getItemInList({foodname: newItem})
                .then(() => {
                    dbcommands
                        .editItem({username: username, newItem: newItem, oldItem: oldItem, checked: checked})
                        .then(resolve => {
                            console.log(resolve)
                            res
                                .status(200)
                                .json({status: 'successful edit', items: resolve})
                        })
                        .catch(error => {
                            res
                                .status(500)
                                .json({status: 'Error', error: error})
                        })
                })
                .catch(error => {
                    console.log("OMG THERE'S AN ERROR!!! 😵")
                    // Need to embed thens inside thens to make sure it only pushes it if there are
                    // no errors....
                    dbcommands
                    //add food to table or list? - mike
                        .insert({command: 'addFood', newItem: newItem})
                        .then(() => {
                            dbcommands
                                .editItem({username: username, newItem: newItem, oldItem: oldItem, checked: checked})
                                .then(resolve => {
                                    console.log(resolve)
                                    res
                                        .status(200)
                                        .json({status: 'successful add', items: resolve})
                                })
                                .catch(error => {
                                    res
                                        .status(500)
                                        .json({status: 'Error', error: error})
                                })
                        })
                    console.error(error)
                })
        //edit food items - mike
        } else if (command === 'editFoods') {
            let foodname = req.query.foodname
            let category = req.query.category
            let type = req.query.type
            let expiration = req.query.expiration
            let storage = req.query.storage

            dbcommands
                .updateFoodDetails({foodname: foodname, category: category, type: type, expiration: expiration, storage: storage})
                .then(data => {
                    console.log(data)
                    res
                        .status(200)
                        .json({status: 'successful edit', items: data})
                })
                .catch(error => {
                    console.error(error)
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }

    /**
     * Send the request to delete column in the database where ID is the name
     * @param {Request} req
     * @param {Response} res
     */
     //delete user from db - mike
    delete(req, res) {
        let cmd = req.query.cmd
        let username = req.query.username
        let item = req.query.item
        console.log("deleting in link")
        console.log("username:", username)
        if (cmd === "delUser") {
            dbcommands
                .delete(username)
                .then(resolve => {
                    console.log("resolve", resolve)
                    if (resolve) {
                        res
                            .status(200)
                            .json({status: 'success'})
                    }
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        //delete item from list - mike
        } else if (cmd === "delItem") {
            dbcommands
                .deleteListItem({item: item, username: username})
                .then(resolve => {
                    console.log("resolve", resolve)
                    if (resolve) {
                        res
                            .status(200)
                            .json({status: 'success'})
                    }
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }
}
