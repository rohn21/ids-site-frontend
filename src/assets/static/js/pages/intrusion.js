document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("button-addon2");
    const urlInput = document.getElementById("url-input");
    const resultMessage = document.getElementById("result-message");
    const resultContainer = document.querySelector(".card-body p");
    const sectionElement = document.querySelector(".section");

    sectionElement.style.display = "none";

    // Add an event listener to the search button
    searchButton.addEventListener("click", async function () {
        const url = urlInput.value.trim(); 
        if (!url) {
            resultMessage.textContent = "Please enter a URL.";
            resultMessage.style.color = "red";
            return;
        }

        const access_token = localStorage.getItem("access_token"); 

        if (!access_token) {
            alert("You are not authenticated. Please log in.");
            window.location.href = "/login.html";
            return;
        }

        try {
            // Send POST request to the backend API
            const response = await fetch("http://127.0.0.1:8000/api/intrusion-net/url-scan/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url }) 
            });
            console.log("request sent!!!!")

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            
            sectionElement.style.display = "block";
            resultContainer.innerHTML = `Inspection Result: ${JSON.stringify(data)}`;
                
            
            // Display inspection results
            resultMessage.textContent = `URL Status: ${data.status}`;
            resultMessage.style.color = data.status === "unsafe" ? "red" : "green";

        } catch (error) {
            console.error("Error:", error);
            resultMessage.textContent = "An error occurred while inspecting the URL.";
            resultMessage.style.color = "red";
            resultContainer.innerHTML = "An error occurred while fetching data.";
        }
    });
});
