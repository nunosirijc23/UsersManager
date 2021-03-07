class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._id
        this._name = name
        this._gender = gender
        this._birth = birth
        this._country = country
        this._email = email
        this._password = password
        this._photo = photo
        this._admin = admin
        this._register = new Date()

    }

    get id() {
        return this._id
    }

    set id(value) {
        this._id = value
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    get gender() {
        return this._gender
    }

    set gender(value) {
        this._gender = value
    }

    get birth() {
        return this._birth
    }

    set birth(value) {
        this._birth = value
    }

    get country() {
        return this._country
    }

    set country(value) {
        this._country = value
    }

    get email() {
        return this._email
    }

    set email(value) {
        this._email = value
    }

    get password() {
        return this._password
    }

    set password(value) {
        this._password = value
    }

    get photo() {
        return this._photo
    }

    set photo(value) {
        this._photo = value
    }

    get admin() {
        return this._admin
    }

    set admin(value) {
        this._admin = value
    }

    get register() {
        return this._register
    }

    set register(value) {
        this.register = value
    }

    //transformar um user json é um objecto user
    loadFromJSON(json) {

        for (let name in json) {

            switch (name) {

                case '_register':
                    this[name] = new Date(json[name])
                    break;
                default:
                    this[name] = json[name]
            }

        }

    }

    //pegar todos usuario nas local storage
    static getAllUsers() {

        let users = []

        //verificar se o está vazio
        if (localStorage.getItem('users')) {

            //pegar os dados de users na localstorage
            users = JSON.parse(localStorage.getItem('users'))

        }

        return users

    }

    //atribuir id em um user
    getnNewID() {
        //pegar o número actual de id dos user no localStorage
        let userID = JSON.parse(localStorage.getItem('userID'))

        //verificar o se userID é vazio
        if (!(userID > 0)) {

            userID = 0

        }

        userID++

        //colocar o número de usuário no localStorage
        localStorage.setItem('userID', JSON.stringify(userID))

        return userID

    }

    //guardar e actualizar dados de user
    save() {

        let users = User.getAllUsers()

        //verificar se o user tem um id
        if (this._id > 0) {

            //actualizar os dados do user
            users.map(user => {
                //verificar se os id são iguais
                if (this._id == user._id) {

                    //actualizar os dados
                    Object.assign(user, this)

                    return user

                }

            })

        }
        // atribuir um novo id a um usuário
        else {

            this._id = this.getnNewID()

            //adicionar no user
            users.push(this)

        }

        //adicionar no localstorage
        localStorage.setItem('users', JSON.stringify(users))

    }

    //remover um dado
    remove() {

        //pegar os dados dos user
        let users = User.getAllUsers()

        //procurar o user
        users.array.forEach((user, index) => {

            //verificar se os id são iguais
            if (user._id == this._id) {
                //apagar o dados do user
                users.splice(index, 1)

            }

        });

        //actualizar no localstorage
        localStorage.setItem('users', JSON.stringify(users))

    }

}