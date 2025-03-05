function loadLoginPage() {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    // Toggle between login and registration forms
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });
}

function handleFormSubmission(){
        
    // Handle form submission
    document.getElementById("app").addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;

        if (form.id === "login-form") {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("pw").value.trim();

            if (manageUsers("login", { username, password })) {
                console.log("Login successful:", username);
             loadHomePage();
            } 

        } else if (form.id === "register-form") {
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
    });
 }
