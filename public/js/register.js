document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra nếu đã đăng nhập thì tự động chuyển hướng
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
        window.location.href = 'dashboard.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const alertContainer = document.getElementById('alertContainer');
    const btnRegister = document.getElementById('btnRegister');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // 2. Lắng nghe sự kiện nộp form Đăng ký
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value.trim();

        // Bật trạng thái loading
        setLoading(true);

        try {
            // 3. Gọi API Đăng ký
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, age, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                // 4. Đăng ký thành công
                showAlert('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...', 'success');
                registerForm.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                // 5. Hiển thị lỗi validation từ backend express-validator
                if (data.errors && Array.isArray(data.errors)) {
                    let alertList = '<ul class="mb-0 ps-3">';
                    data.errors.forEach(err => {
                        alertList += `<li>${err.msg}</li>`;
                        // Hiển thị highlight đỏ bên dưới ô input nếu có path
                        if (err.path || err.param) {
                            const fieldName = err.path || err.param;
                            const inputEl = document.getElementById(fieldName);
                            const errEl = document.getElementById(`err-${fieldName}`);
                            if (inputEl) inputEl.classList.add('is-invalid');
                            if (errEl) errEl.textContent = err.msg;
                        }
                    });
                    alertList += '</ul>';
                    showAlert(alertList, 'danger');
                } else if (data.message) {
                    showAlert(data.message, 'danger');
                } else {
                    showAlert('Đăng ký không thành công. Vui lòng kiểm tra lại dữ liệu!', 'danger');
                }
            }
        } catch (error) {
            console.error('Lỗi kết nối API đăng ký:', error);
            showAlert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!', 'danger');
        } finally {
            setLoading(false);
        }
    });

    // Helper xóa lỗi hiển thị cũ
    function clearErrors() {
        alertContainer.innerHTML = '';
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    }

    // Helper hiển thị thông báo alert
    function showAlert(message, type) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Helper trạng thái button
    function setLoading(isLoading) {
        if (isLoading) {
            btnRegister.disabled = true;
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
        } else {
            btnRegister.disabled = false;
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    }
});
