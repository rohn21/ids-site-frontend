
        async function fetchProfile() {
        try {
            const access_token = localStorage.getItem("access_token");
    
            if (!access_token) {
                console.error("No access token found.");
                return;
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            };
    
            const response = await axios.get('http://127.0.0.1:8000/api/auth/user/profile/', config);
    
            if (response.status === 200) {
                const profileData = response.data;
    
                // Update avatar image in navbar
                const avatarImage = document.getElementById('avatar-img');
                if (avatarImage && profileData.profile_pic) {
                    avatarImage.src = profileData.profile_pic;
                }
    
                // Update username in navbar
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) {
                    userNameElement.textContent = profileData.user.username || "Guest";
                }
    
                // Store original data for edit detection later
                originalProfile = {
                    username: profileData.user.username,
                    mobile_number: profileData.user.mobile_number
                };
            } else {
                console.error('Error fetching profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }
    window.onload = function () {
        fetchProfile();
    };