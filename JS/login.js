function loadLoginPage() {
    initializePage("login");

    let registerBtn=document.getElementById("register-btn");
    let loginBtn=document.getElementById("login-btn");

    // Toggle between login and registration forms
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    document.getElementById("register-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleFormSubmission("Sign Up");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });

    document.getElementById("login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleFormSubmission("Log In");
    });
}

function handleFormSubmission(action){
    // Handle form submissio
        if (action === "Log In") {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("pw").value.trim();

            manageUsers("login", { username, password }, (res) => {
                if (res) loadHomePage();
            });

            //if (manageUsers("login", { username, password }) {
            //    console.log("Login successful:", username);
            // loadHomePage();
            //} 

        } else if (action === "Sign Up") {
            const firstname = document.getElementById("firstname").value.trim();
            const lastname = document.getElementById("lastname").value.trim();
            const username = document.getElementById("newusername").value.trim();
            const password = document.getElementById("newpw").value.trim();
            const confirmPassword = document.getElementById("confirmpw").value.trim();

            if (!username || !password) {
                alert("All fields are required!");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            //if (manageUsers("register",{ firstname,lastname,username, password } )) {
            //    loadHomePage();
            //}

            manageUsers("register",{ firstname,lastname,username, password }, (res) => {
                if (res) loadLoginPage();
            });
        }
 }
