document.getElementById("verifyBtn").addEventListener("click", async function () {
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
    const captchaInput = document.getElementById("captchaInput").value;
    const storedCaptcha = localStorage.getItem("captcha");
    const errorElement = document.getElementById("error");

    if (!identifier || !password) {
        errorElement.textContent = "Please enter both username and password.";
        return;
    }

    if (captchaInput !== storedCaptcha) {
        errorElement.textContent = "Invalid captcha.";
        return;
       }


    errorElement.textContent = ""; 

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
            username: identifier, 
            password: password,
        });
        console.log(response.data)
        console.log(response.data.user.role)


        // Extract JWT tokens
        const { access_token, refresh_token } = response.data;

        // Store tokens in localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        console.log("Access Token:", access_token);
        console.log("Refresh Token:", refresh_token);
        
        if (response.data.user && response.data.user.role && response.data.user.role === 'admin') {
            window.location.href = "/admin-index.html";
        } else {
            window.location.href = "/index.html";
        }

    } catch (error) {
        // Handle errors from Axios
        if (error.response) {
            errorElement.textContent = error.response.data.detail || "Invalid username or password.";
        } else {
            errorElement.textContent = "An error occurred. Please try again.";
        }
    }
});

function toggleForgotPasswordForm() {
            document.getElementById("signInForm").style.display = "none";
            document.getElementById("forgotPasswordForm").style.display = "flex";
}