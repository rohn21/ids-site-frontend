document.getElementById("signUpBtn").addEventListener("click", async function (e) {
    e.preventDefault();
  
  
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");
  
    if (!username || !email || !phone || !password || !confirmPassword) {
      errorMessage.textContent = "All fields are required.";
      return;
    }
  
    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      return;
    }
  
    errorMessage.textContent = "";
  
    const payload = {
      username: username,
      email: email,
      phone: phone,
      password: password,
      confirm_password: confirmPassword  
    };
  
    try {
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/", 
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
  
      console.log("Sign Up Successful:", response.data);
      alert("Sign Up Successful! Please proceed to login.");
      
    //   window.location.href = "login.html";
  
    } catch (error) {
      // Handle errors from Axios
      if (error.response) {
        // Display error message returned from the server
        errorMessage.textContent = error.response.data.detail || "Sign up failed. Please check your data.";
      } else {
        errorMessage.textContent = "An error occurred. Please try again.";
      }
      console.error("Error during sign up:", error);
    }
  });