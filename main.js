function User(firstname, lastname, username, password) {
    return {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        contacts: [],
        toDos: [],
        meetings: []
    }
}

function Contact(name, company, phone, email){
    return {
        name: name,
        company: company,
        phone: phone,
        email: email
    }
}

function contactToHTMLString(contact) {
    return `<tr> <td>${contact.name}</td> <td>${contact.company}</td> <td>${contact.phone}</td> <td>${contact.email}</td> </tr>`;
}

const app = {
    init: function() {
        localStorage.setItem("Current User", "");
        localStorage.setItem("Users", "[]");
    },

    login: function() {
        //לא יודעת אם זה עובד אם הטמפלט
        document.querySelector('#login form').addEventListener('submit', (event) => {
            event.preventDefault();

            const username_ = this.username.value;
            const password_ = this.pw.value;
            const currentUser = JSON.parse(localStorage.getItem('Users'))
                .find(user => user.username === username_);

            if (!currentUser) {
                alert('User Not Found');
                return;
            }
            if (currentUser.password !== password_) {
                alert('Password is Incorrect');
                return;
            } 

            localStorage.setItem('Current User', username_);
        });
    },

    register: function() {
        //לא יודעת אם זה עובד אם הטמפלט
        document.querySelector('#register form').addEventListener('submit', (event) => {
            event.preventDefault();

            const username_ = this.newusername.value;
            const password_ = this.newpw.value;
            const confirmPassword = this.confirmpw.value;
            const firstname_ = this.firstname.value;
            const lastname_ = this.lastname.value;
            const users = JSON.parse(localStorage.getItem('Users'));

            if (users.find(user => user.username === username_)) {
                alert('Username is taken, please choose a different username');
                return;
            }
            if (password_ !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const newuser = new User(firstname_, lastname_, username_, password_);
            users.push(newuser);
            localStorage.setItem('Users', JSON.stringify(users));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});