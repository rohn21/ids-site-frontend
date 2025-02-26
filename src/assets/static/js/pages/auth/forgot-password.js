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
function sendOTP(){
    console.log("button clicked!!!!");
  document.getElementById("otpSection").style.display = "block";
}
