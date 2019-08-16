const API = 'https://test-users-api.herokuapp.com';

const container = document.querySelector('.users');
const userName = document.querySelector('#userName');
const userAge = document.querySelector('#userAge');
const buttonCreate = document.querySelector('#createUser');

function getUsers() {
    return fetch(API + '/users')
    .then(resolve => resolve.json())
    .then((res) => res.data)
    .catch((err) => {
        console.log("Can't GET users", err);
    });
}

function deleteUser(userId) {
    return fetch(API + '/users/' + userId, {
        method: 'DELETE'
    })
    .then(resolve => resolve.json())
    .then((res) => {
        if (res.status !== 200) {
            throw res.errors;
        }
    })
    .catch((err) => {
        console.log("Can't DELETE users", err);
    });
}

function renderUsers(users) {
    container.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'userCard';
        div.innerHTML = `
            <div><b>ID:  </b>${user.id}    </div>
            <div><b>Name:</b> ${user.name}</div> 
            <div><b>Age: </b> ${user.age}  </div>
            `
        const btn = document.createElement('button');
        btn.className = 'button';
        btn.innerText = 'Delete';

        btn.addEventListener('click', () => {
            deleteUser(user.id)
            .then(() => {
                div.remove();
            }).catch(() => {})
        })
        div.append(btn);

        container.append(div);
    });
}

function listUser() {
    getUsers().then((users) => {
        console.log(users);
        //console.log(users[0].name);
        //console.log(users[0].id);
        renderUsers(users.reverse());
    });
}

buttonCreate.addEventListener('click', () => {
    const user = 
        {
            name: userName.value,
            age:  userAge.value
        };

    fetch(API + '/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(resolve => resolve.json())
    .then((res) => res.data)
    .then(({id}) => {
        user.id = id;
        listUser();
        userName.value = ''; 
        userAge.value = '';
    }).catch((err) => {
        console.log(err)
    })
})

listUser();