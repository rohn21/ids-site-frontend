
let isEditing = false;
let originalProfile = {};

async function fetchProfile() {
    try {
        const access_token = localStorage.getItem("access_token");
        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        };

        const response = await axios.get('http://127.0.0.1:8000/api/auth/user/profile/', config);

        if (response.status === 200) {
            const profileData = response.data;

            // Set avatar and name
            const avatarImage = document.getElementById('avatar-img');
            if (avatarImage && profileData.profile_pic) {
                avatarImage.src = `${profileData.profile_pic}?t=${new Date().getTime()}`;
            }

            const profileAvatar = document.getElementById('profile-avatar-img');
            if (profileAvatar && profileData.profile_pic) {
                profileAvatar.src = `${profileData.profile_pic}?t=${new Date().getTime()}`;
            }

            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = profileData.user.username || 'Guest';
            }

            // Fill user detail table
            const userDetails = document.getElementById('user-details');
            if (userDetails) {
                userDetails.innerHTML = `
                    <tr>
                        <td class="text-bold-500">Username</td>
                        <td class="text-bold-500" id="username-value">${profileData.user.username}</td>
                    </tr>
                    <tr>
                        <td class="text-bold-500">Email</td>
                        <td class="text-bold-500" id="email-value">${profileData.user.email}</td>
                        <td><span class="badge bg-light-${profileData.is_email_verified ? 'success' : 'danger'}">${profileData.is_email_verified ? 'Verified' : 'Not Verified'}</span></td>
                    </tr>
                    <tr>
                        <td class="text-bold-500">Phone Number</td>
                        <td class="text-bold-500" id="mobile-value">${profileData.user.mobile_number || 'N/A'}</td>
                    </tr>
                `;
            }

            originalProfile = {
                username: profileData.user.username,
                mobile_number: profileData.user.mobile_number
            };
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function toggleEditMode() {
    const usernameValue = document.getElementById('username-value');
    const emailValue = document.getElementById('email-value');
    const mobileValue = document.getElementById('mobile-value');
    const editBtn = document.getElementById('edit-btn');
    const profileImageUpload = document.getElementById('profile-image-upload');
    const submitProfileImage = document.getElementById('submit-profile-image');

    if (isEditing) {
        // Save
        const updatedUsername = document.getElementById('username-input').value;
        const updatedMobile = document.getElementById('mobile-input').value;

        updateProfile(updatedUsername, updatedMobile);

        if (usernameValue) usernameValue.innerText = updatedUsername;
        if (mobileValue) mobileValue.innerText = updatedMobile;

        editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit';
        isEditing = false;
        profileImageUpload.style.display = 'none';
        submitProfileImage.style.display = 'none';
    } else {
        // Edit mode
        const username = usernameValue ? usernameValue.innerText : '';
        const email = emailValue ? emailValue.innerText : '';
        const mobile = mobileValue ? mobileValue.innerText : '';

        const userDetails = document.getElementById('user-details');
        userDetails.innerHTML = `
            <tr>
                <td class="text-bold-500">Username</td>
                <td><input type="text" id="username-input" value="${username}" class="form-control"></td>
            </tr>
            <tr>
                <td class="text-bold-500">Email</td>
                <td><input type="email" id="email-input" value="${email}" class="form-control" disabled></td>
            </tr>
            <tr>
                <td class="text-bold-500">Phone Number</td>
                <td><input type="text" id="mobile-input" value="${mobile}" class="form-control"></td>
            </tr>
        `;

        editBtn.innerHTML = '<i class="bi bi-check"></i> Save';
        isEditing = true;
        profileImageUpload.style.display = 'block';
        submitProfileImage.style.display = 'none';
    }
}

async function updateProfile(updatedUsername, updatedMobile) {
    try {
        const access_token = localStorage.getItem("access_token");
        const config = {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        };

        const data = { user: {} };

        if (updatedUsername !== originalProfile.username) {
            data.user.username = updatedUsername;
        }

        if (updatedMobile !== originalProfile.mobile_number) {
            data.user.mobile_number = updatedMobile;
        }

        if (Object.keys(data.user).length === 0) {
            console.log("No changes to update.");
            return;
        }

        const response = await axios.patch('http://127.0.0.1:8000/api/auth/user/profile/', data, config);

        if (response.status === 200) {
            console.log("Profile updated successfully!");
            fetchProfile();
        } else {
            console.error("Failed to update profile:", response);
        }
    } catch (error) {
        console.error("Update error:", error);
    }
}

// Profile image logic
document.getElementById('profile-image-upload').addEventListener('change', () => {
    const submitBtn = document.getElementById('submit-profile-image');
    submitBtn.style.display = document.getElementById('profile-image-upload').files.length > 0 ? 'block' : 'none';
});

document.getElementById('submit-profile-image').addEventListener('click', async () => {
    const access_token = localStorage.getItem("access_token");
    const fileInput = document.getElementById('profile-image-upload');

    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append('profile_pic', fileInput.files[0]);

    const config = {
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    try {
        const response = await axios.patch('http://127.0.0.1:8000/api/auth/user/profile/', formData, config);
        if (response.status === 200) {
            const avatarImage = document.getElementById('avatar-img');
            if (avatarImage && response.data.profile_pic) {
                avatarImage.src = `${response.data.profile_pic}?t=${new Date().getTime()}`;
            }
            const profileAvatar = document.getElementById('profile-avatar-img');
            if (profileAvatar && response.data.profile_pic) {
                profileAvatar.src = `${response.data.profile_pic}?t=${new Date().getTime()}`;
            }

            document.getElementById('submit-profile-image').style.display = 'none';
            console.log("Image updated.");
        }
    } catch (error) {
        console.error("Image upload error:", error);
    }
});

document.getElementById('edit-profile-image').addEventListener('click', () => {
    document.getElementById('profile-image-upload').click();
});

document.getElementById('edit-btn').addEventListener('click', function (event) {
    event.preventDefault();
    toggleEditMode();
});

window.onload = function () {
    fetchProfile();
};