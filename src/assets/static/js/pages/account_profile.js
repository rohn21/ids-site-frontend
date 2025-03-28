async function fetchProfile() {
    try {
        
        const access_token = localStorage.getItem("access_token")
        console.log(access_token)


        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        };

        const response = await axios.get('/api/auth/profile/', config); 
        const avatarImage = document.getElementById('avatar-img');
        const userNameElement = document.getElementById('user-name');

        if (response.status === 200) {
            const profileData = response.data;
            console.log(profileData.profile_pic);
            console.log("profile image ");

            if (avatarImage && userNameElement) {
                try {
                
                    const access = localStorage.getItem("access_token")
                    console.log(access)
                    const response = await axios.get('/api/auth/profile/', config);
                    const profileData = response.data;

                    // Set profile picture and username
                    avatarImage.src = profileData.profile_pic || '/assets/static/images/default-avatar.jpg';
                    console.log(profileData.profile_pic);
                    userNameElement.textContent = profileData.username || 'Guest';
                    console.log(profileData.username);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
    } else {
        console.error("Elements not found in DOM.");
    }
        } else {
            console.error('Error fetching profile data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = function () {
    fetchProfile();
};