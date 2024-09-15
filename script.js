// Toggle upload password visibility
document.getElementById('toggle-upload-password').addEventListener('click', function () {
    const passwordField = document.getElementById('upload-password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});

// Toggle delete password visibility
document.getElementById('toggle-delete-password').addEventListener('click', function () {
    const passwordField = document.getElementById('delete-password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});

// Handle file upload with progress
document.getElementById('upload-btn').addEventListener('click', function () {
    const file = document.getElementById('file-input').files[0];
    const password = document.getElementById('upload-password').value;

    if (!file || !password) {
        document.getElementById('upload-message').textContent = 'Please enter password and select a file.';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // Track the upload progress
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            document.getElementById('progress-bar').value = percentComplete;
            document.getElementById('progress-text').textContent = `Upload Progress: ${Math.round(percentComplete)}%`;
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            document.getElementById('upload-message').textContent = response.message;
            if (response.success) {
                document.getElementById('progress-bar').value = 0;
                document.getElementById('progress-text').textContent = '';
                loadFiles(); // Refresh the file list
            }
        } else {
            document.getElementById('upload-message').textContent = 'Upload failed. Please try again.';
        }
    };

    xhr.send(formData);
});

// Handle file deletion
document.getElementById('delete-btn').addEventListener('click', function () {
    const filename = document.getElementById('file-to-delete').value;
    const password = document.getElementById('delete-password').value;

    if (!filename || !password) {
        document.getElementById('delete-message').textContent = 'Please enter password and file name.';
        return;
    }

    fetch('/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, code: password })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('delete-message').textContent = data.message;
            if (data.success) {
                loadFiles(); // Refresh the file list
            }
        });
});

// Load the list of uploaded files
function loadFiles() {
    fetch('/files')
        .then(response => response.json())
        .then(data => {
            const filesList = document.getElementById('files-list');
            filesList.innerHTML = '<ul>';
            data.files.forEach(file => {
                filesList.innerHTML += `<li>${file.name} - Uploaded on: ${file.uploadTime} <a href="/download/${file.name}">Download</a></li>`;
            });
            filesList.innerHTML += '</ul>';
        });
}

// Load files on page load
document.addEventListener('DOMContentLoaded', loadFiles);
