document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra nếu đã đăng nhập thì tự động chuyển sang dashboard
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const alertContainer = document.getElementById('alertContainer');
    const btnLogin = document.getElementById('btnLogin');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // 2. Lắng nghe sự kiện nộp form đăng nhập
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showAlert('', 'clear');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate client đơn giản
        if (!email || !password) {
            showAlert('Vui lòng nhập đầy đủ Email và Mật khẩu.', 'danger');
            return;
        }

        // Bật trạng thái loading
        setLoading(true);

        try {
            // 3. Gọi API Đăng nhập
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // 4. Lưu JWT Token vào localStorage
                localStorage.setItem('token', data.token);
                showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');

                // Chuyển trang sau 1 giây
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // Hiển thị lỗi từ backend
                const errorMsg = data.message || data.error || 'Email hoặc mật khẩu không chính xác';
                showAlert(errorMsg, 'danger');
            }
        } catch (error) {
            console.error('Lỗi kết nối API đăng nhập:', error);
            showAlert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!', 'danger');
        } finally {
            setLoading(false);
        }
    });

    // Helper hiển thị thông báo alert
    function showAlert(message, type) {
        if (type === 'clear') {
            alertContainer.innerHTML = '';
            return;
        }
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Helper trạng thái button khi bấm
    function setLoading(isLoading) {
        if (isLoading) {
            btnLogin.disabled = true;
            btnText.classList.add('d-none');
            btnSpinner.classList.remove('d-none');
        } else {
            btnLogin.disabled = false;
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    }
});
