class UserController {

    //pegar o id
    constructor(formId, formUpdateEL, tableId) {

        this.formEl = document.getElementById(formId)
        this.formUpdateEL = document.getElementById(formUpdateEL)
        this.tableEL = document.getElementById(tableId)

        this.takeInputError()
        this.onEditAndCancel()

        this.listUsers()

    }

    //retorna um array de elementos do formulário
    getFormCreateItens() {
        //espalhando os elementos do formulário em um array
        return [...this.formEl.elements]
    }

    getFormUpdateItens() {
        //espalhando os elementos do formulário em um array
        return [...this.formUpdateEL.elements]
    }

    //tirar remover a classe do erro do pai dos elementos
    takeInputError() {

        this.getFormCreateItens().forEach(element => {

            element.addEventListener('click', e => {

                if (['name', 'email', 'password'].indexOf(element.name) > -1) {

                    element.parentElement.classList.remove('has-error')

                }

            })

        })

        this.getFormUpdateItens().forEach(element => {

            element.addEventListener('click', e => {

                if (['name', 'email', 'password'].indexOf(element.name) > -1) {

                    element.parentElement.classList.remove('has-error')

                }

            })

        })
    }

    //retorna os dados do usuário do formulário
    getValues(formEL) {
        //criar um objecto vazio
        let user = {}

        //variavel auxiliar para vericação dos campos vazios
        let isValid = true

        //pegar dados de cada input do array elementos do formulário
        formEL.forEach(field => {

            //verificar os campos vazios
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                //adicionar atributo de erro no pai do elemento
                field.parentElement.classList.add('has-error')

                isValid = false
            }

            //pegar dados do radio que está selecionado
            if (field.name == "gender") {

                if (field.checked) {
                    user[field.name] = field.value
                }

            }
            //verificar se o checkbox e pegar o dados
            else if (field.name == "admin") {

                user[field.name] = field.checked

            } else {

                user[field.name] = field.value

            }

        })

        //verrificar se o auxiliar é falso e retornar um falso 
        if (!isValid) {

            return false

        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        )

    }

    //actualizar os numeros de usuários na tela
    updateUsersNumberOnScreen() {

        let usersNumber = 0
        let adminUsersNumber = 0

        let tableItens = [...this.tableEL.children]

        tableItens.forEach(element => {

            usersNumber++

            //pegar os dados do usuário no dataset da tag tr e converter no formato padrão
            let user = JSON.parse(element.dataset.user)

            //contar os numeros de administrador
            if (user._admin) {

                adminUsersNumber++

            }

        })

        //adicionar valores no html
        document.getElementById('users-number').innerHTML = usersNumber
        document.getElementById('admin-users-number').innerHTML = adminUsersNumber

    }

    //adicionar na tela
    addLine(userData) {

        //adicionar dados do usuário e retornar a tr co os dados do usuario
        let tr = this.getTr(userData)

        //adicionar oos dados na tela 
        this.tableEL.appendChild(tr)

        //ação do botão excluir e actualizar
        this.listenEventTr(tr)

        this.updateUsersNumberOnScreen()
    }

    //adicionar os dados na tr
    getTr(userData, tr = null) {

        if (!tr) {

            //cria um elemento
            tr = document.createElement('tr')

        }

        //colocar os dados do usuário no dataset da tag tr em string
        tr.dataset.user = JSON.stringify(userData)

        tr.innerHTML = `
            <tr>
                <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${userData.name}</td>
                <td>${userData.email}</td>
                <td>${(userData.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.getFormatDate(userData.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-update btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-delete btn-flat">Excluir</button>
                </td>
            </tr> 
        `

        // evento de editar e excluir
        this.listenEventTr(tr)

        return tr

    }

    //eventos dos botões editar e excluir da tr
    listenEventTr(tr) {

        //botão editar
        tr.querySelector('.btn-update').addEventListener('click', e => {

            //pegar os dados do user que está na tr
            let userData = JSON.parse(tr.dataset.user)

            //passar o inde da tr no dataset do formulário
            this.formUpdateEL.dataset.trIndex = tr.sectionRowIndex

            //fazer um loop no objecto
            for (const name in userData) {

                //pegar o input pelo nome 
                let field = this.formUpdateEL.querySelector('[name=' + name.replace('_', '') + ']')

                //verificar se o campo não é vazio
                if (field) {

                    switch (field.type) {

                        //se for um file
                        case 'file':
                            continue
                        //se for um radio
                        case 'radio':
                            //adicionar o valor no input e adicionar e checar como verdadeiro
                            field = this.formUpdateEL.querySelector('[name=' + name.replace('_', '') + '][value=' + userData[name] + ']')
                            field.checked = true
                            break
                        //se for um checkbox
                        case 'checkbox':
                            //adicionar o valor no input
                            field.checked = userData[name]
                            break
                        default:
                            field.value = userData[name]
                            break

                    }

                }

            }


            //adicionar o valor da foto na tag img
            this.formUpdateEL.querySelector('.photo').src = userData._photo

            //mostrar o formulário de editar
            this.showUpdateForm()
        })

        //botão excluir
        tr.querySelector('.btn-delete').addEventListener('click', event => {

            if (confirm("Deseja excluir?")) {
                //pegar os dados do user no dataset da tr
                let userData = JSON.parse(tr.dataset.user)

                //criar um objecto user
                let user = new User()

                //passar os dados para um objecto usuário
                user.loadFromJSON(userData)

                //removert os dados no localStorage
                user.remove()

                //remover tr
                tr.remove()

                //actualizar dados
                this.updateUsersNumberOnScreen()

            }

        })

    }

    //ação dos botões editar e cancelar do formulário update
    onEditAndCancel() {

        //botão cancelar 
        this.formUpdateEL.querySelector('.btn-cancel').addEventListener('click', e => {

            //mostrar o formulário de criar user
            this.showCreateForm()

        })

        //botão editar
        this.formUpdateEL.addEventListener('submit', event => {
            //desabilitar os eventos pradão do formulário
            event.preventDefault()

            //pegar o botão do formulário
            let btn = this.formUpdateEL.querySelector('[type=submit]')

            //desactivar o botão
            btn.disabled = true

            //pegar os elementos formulário
            let formItens = this.getFormUpdateItens()

            //retorna os dados do usuario ou um boolean
            let userValues = this.getValues(formItens)

            //caso userValues for false 
            if (!userValues) {

                btn.disabled = false

                return false

            }

            //pegar o index no dataset do formEl
            let index = this.formUpdateEL.dataset.trIndex

            //pegar a tr na tabela
            let tr = this.tableEL.rows[index]

            //pegar os dados antigos do usuário
            let oldUserData = JSON.parse(tr.dataset.user)

            //juntar os dados atingos com o novo
            let newUserData = Object.assign({}, oldUserData, userValues)

            //promide de foto
            this.getPhoto(formItens).then(
                //pegar a foto para adicionar nos dados do usuário
                (content) => {
                    //verificar se o foto dos novos dados está vazio
                    if (!userValues.photo) {

                        newUserData._photo = oldUserData._photo

                    }
                    //adicionar nova foto
                    else {

                        newUserData._photo = content

                    }

                    //criar um objecto user
                    let user = new User()

                    //passar os dados para um objecto usuário
                    user.loadFromJSON(newUserData)

                    //actualizar os dados no localStorage
                    user.save()

                    //passar os dados na tela
                    this.getTr(user, tr)

                    //limpar os dados do formulário
                    this.formUpdateEL.reset()

                    //activar o botão
                    btn.disabled = false

                    //mostrar formulário de criação
                    this.showCreateForm()
                },
                //caso haja falha
                (error) => {

                    console.error(error)

                }
            )


        })

    }

    //mostrar formulário de editar e desabilitar o de criar
    showUpdateForm() {

        document.getElementById('box-user-update').style.display = 'block'
        document.getElementById('box-user-create').style.display = 'none'

    }

    //mostrar o formulário de criar e desabilitar o de actualizar
    showCreateForm() {

        document.getElementById('box-user-create').style.display = 'block'
        document.getElementById('box-user-update').style.display = 'none'

    }

    //pegar foto
    getPhoto(formEl) {

        return new Promise((resolve, reject) => {

            //criando um FileReader para ler arquivo
            let fileReader = new FileReader()

            //retorna um array com o elemnto input de photo que está no array de elementos do formulário
            let photoInputArray = formEl.filter(item => {
                //verificar o input com o name == photo
                if (item.name == "photo") {

                    return item

                }

            })

            //pegar o ficheiro no photoInputArray que está na primeira posição
            let file = photoInputArray[0].files[0]

            //verificar se o usuario mandou o ficheiro 
            if (file) {
                //ler a url do ficheiro
                fileReader.readAsDataURL(file)
            }
            //se não mandou retorna uma foto da pasta dist
            else {
                //promise retorna o directório
                resolve('dist/img/boxed-bg.jpg')
            }

            //carregar o ficheiro
            fileReader.onload = () => {
                //promise retorna a url do ficheiro
                resolve(fileReader.result)
            }

            //caso falhar ao carregar o ficheiro
            fileReader.onerror = (e) => {
                //promise retorna um erro
                reject(e)
            }

        })

    }

    //escutando o eventoID para adicionar na tela 
    onSubmit() {

        //escuntando o evento do formulário
        this.formEl.addEventListener('submit', event => {
            //desabilitar os eventos pradão do formulário
            event.preventDefault()

            //pegar o botão do formulário
            let btn = this.formEl.querySelector('[type=submit]')

            //desactivar o botão
            btn.disabled = true

            //pegar os elementos formulário
            let formItens = this.getFormCreateItens()

            //retorna os dados do usuario ou um boolean
            let userValues = this.getValues(formItens)

            //caso userValues for false 
            if (!userValues) {

                btn.disabled = false

                return false

            }

            this.getPhoto(formItens).then(
                //pegar a foto para adicionar nos dados do usuário
                (content) => {

                    userValues.photo = content

                    //criar um objecto do user
                    let user = new User()

                    //passar os dados para um objecto usuário
                    user.loadFromJSON(userValues)

                    //guardar os dados no localStorage
                    user.save()

                    this.addLine(user)

                    //limpar os dados do formulário
                    this.formEl.reset()

                    //activar o botão
                    btn.disabled = false
                },
                //caso haja falha
                (error) => {

                    console.error(error)

                }
            )


        })
    }

    //listar todos os user na tela
    listUsers() {
        //pegar todos os user da localStorage
        let users = User.getAllUsers()

        //adicionar na tela
        users.forEach(userData => {
           
            //criar um objecto do user
            let user = new User()

            //passar os dados para um objecto usuário
            user.loadFromJSON(userData)

            //adicionar na tela
            this.addLine(user)

        })
    }
}