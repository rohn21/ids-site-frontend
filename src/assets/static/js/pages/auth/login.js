
        document.getElementById("verifyBtn").addEventListener("click", async function () {
            const identifier = document.getElementById("identifier").value;
            const password = document.getElementById("password").value;
            const errorElement = document.getElementById("error");

            if (!identifier || !password) {
                errorElement.textContent = "Please enter both username and password.";
                return;
            }

            errorElement.textContent = ""; 

            try {
                const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                    username: identifier, // Change to 'username' if needed
                    password: password,
                });

                // Extract JWT tokens
                const { access, refresh } = response.data;

                // Store tokens in localStorage
                localStorage.setItem("accessToken", access);
                localStorage.setItem("refreshToken", refresh);

                console.log("Access Token:", access);
                console.log("Refresh Token:", refresh);

                alert("Login successful!");

                // Optionally, redirect after successful login
                // window.location.href = "/dashboard.html";
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