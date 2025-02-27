let container = document.getElementById('container')

        toggle = () => {
            container.classList.toggle('sign-in')
            container.classList.toggle('sign-up')
        }

        setTimeout(() => {
            container.classList.add('sign-in')
        }, 200)

// forgor-password
  function toggleForgotPasswordForm() {

    document.getElementById("signInForm").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "flex";

}

const forgotPasswordForm = document.querySelector('.forgot-password-form');
const emailRadio = forgotPasswordForm.querySelector('input[id="email"]');
const numberRadio = forgotPasswordForm.querySelector('input[id="number"]');
const phoneNumberInput = forgotPasswordForm.querySelector('.input-group input[type="number"]');

emailRadio.addEventListener("change", function() {
  const inputGroup = forgotPasswordForm.querySelector('.input-group');
  inputGroup.innerHTML = `
      <i class='bx bxs-envelope'></i>
      <input type="email" placeholder="Email">
  `;
});

numberRadio.addEventListener("change", function() {
  const inputGroup = forgotPasswordForm.querySelector('.input-group');
  inputGroup.innerHTML = `
      <i class='bx bxs-user'></i>
      <input type="number" placeholder="Phone Number">
  `;
});

// otp
function sendOTP() {
  console.log("button clicked!!!!");
  document.getElementById("forgotPasswordForm").style.display = "none"; // Hide the forgot password form
  document.getElementById("otpForm").style.display = "flex"; // Show the OTP section
}

// handle-otp start
// document.getElementById("submitOtpBtn").addEventListener("click", async function() {
//   const otpValue = document.getElementById("otpInput").value;
  
//   if (!otpValue) {
//       document.getElementById("error").textContent = "Please enter the OTP.";
//       return;
//   }
  
//   // Call your API to verify the OTP here
//   try {
//       const response = await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
//           otp: otpValue,
//       });
      
//       console.log("OTP verified successfully:", response.data);
//       alert("OTP verified successfully!");
      
//       // Optionally, redirect the user after successful OTP verification
//       // window.location.href = "/dashboard.html";
      
//   } catch (error) {
//       if (error.response) {
//           document.getElementById("error").textContent = error.response.data.detail || "Invalid OTP.";
//       } else {
//           document.getElementById("error").textContent = "An error occurred. Please try again.";
//       }
//   }
// });
// handle-otp end

// signup.js
// Listen for the click event on the "Sign Up" button
document.getElementById("signUpBtn").addEventListener("click", async function (e) {
  e.preventDefault(); // Prevent default form submission


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
    // Optionally, redirect the user after successful sign up:
    // window.location.href = "login.html";

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
