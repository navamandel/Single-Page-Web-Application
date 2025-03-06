function loadLoginPage() {
    initializePage("login");
    // Toggle between login and registration forms
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });
}

function handleFormSubmission(action){
        
    // Handle form submissio
        if (action === "Log In") {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("pw").value.trim();

            if (manageUsers("login", { username, password })) {
                console.log("Login successful:", username);
             loadHomePage();
            } 

        } else if (action === "Sign up") {
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

            if (manageUsers("register",{ username, password })) {
                loadHomePage();
            }
        }
 }
