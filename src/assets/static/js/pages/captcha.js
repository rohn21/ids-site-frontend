function generateCaptcha() {
  const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lengthOtp = 6;
  let captcha = [];

  for (let i = 0; i < lengthOtp; i++) {
      let index = Math.floor(Math.random() * charsArray.length);
      captcha.push(charsArray[index]);
  }

  const canv = document.createElement("canvas");
  canv.id = "captchaCanvas";
  canv.width = 200;
  canv.height = 50;

  const ctx = canv.getContext("2d");
  ctx.font = "30px Georgia";
  ctx.strokeText(captcha.join(""), 10, 40);

  document.getElementById("captcha").appendChild(canv);

  // Store the captcha for validation
  localStorage.setItem("captcha", captcha.join(""));
}

// Generate captcha on page load
generateCaptcha();

function refreshCaptcha() {
  document.getElementById("captcha").innerHTML = "";
  generateCaptcha();
  document.getElementById("captchaInput").value = "";
}