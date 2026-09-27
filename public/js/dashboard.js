document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra JWT Token trong localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Dom Elements
    const btnLogout = document.getElementById('btnLogout');
    const alertContainer = document.getElementById('alertContainer');
    const userTableBody = document.getElementById('userTableBody');
    const searchInput = document.getElementById('searchInput');
    const btnOpenAddModal = document.getElementById('btnOpenAddModal');
    const userForm = document.getElementById('userForm');
    const userModalEl = document.getElementById('userModal');
    const bsModal = new bootstrap.Modal(userModalEl);
    const userModalLabel = document.getElementById('userModalLabel');
    const modalAlert = document.getElementById('modalAlert');
    const modalUserId = document.getElementById('modalUserId');

    // Stat Elements
    const statTotalUsers = document.getElementById('statTotalUsers');
    const statTotalAdmins = document.getElementById('statTotalAdmins');
    const statRegularUsers = document.getElementById('statRegularUsers');
    const statAvgAge = document.getElementById('statAvgAge');

    // Pagination Elements
    const paginationList = document.getElementById('paginationList');
    const pageCountText = document.getElementById('pageCountText');

    // State Variables
    let currentPage = 1;
    let currentLimit = 10;
    let currentSearch = '';
    let searchTimeout = null;

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // Initial Load
    initDashboard();

    async function initDashboard() {
        await fetchProfile();
        await fetchUsers();
    }

    // 2. Fetch Current User Profile (/api/profile)
    async function fetchProfile() {
        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: authHeaders
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();
            const user = data.user || data;

            if (user) {
                const initial = (user.name || 'U').charAt(0).toUpperCase();
                document.getElementById('navAvatar').textContent = initial;
                document.getElementById('profileAvatar').textContent = initial;
                document.getElementById('navName').textContent = user.name || 'N/A';
                document.getElementById('navEmail').textContent = user.email || '';

                document.getElementById('profileName').textContent = user.name || 'N/A';
                document.getElementById('profileEmail').textContent = user.email || 'N/A';
                document.getElementById('profileAge').textContent = user.age !== undefined ? user.age : 'N/A';
                document.getElementById('profileId').textContent = user._id || user.id || 'N/A';

                const roleBadge = document.getElementById('profileRoleBadge');
                roleBadge.textContent = (user.role || 'user').toUpperCase();
                roleBadge.className = user.role === 'admin' ? 'badge badge-role-admin' : 'badge badge-role-user';
            }
        } catch (error) {
            console.error('Lỗi lấy profile:', error);
            showAlert('Lỗi khi tải thông tin hồ sơ!', 'danger');
        }
    }

    // 3. Fetch User List with Search & Pagination
    async function fetchUsers() {
        try {
            const url = new URL('/api/users', window.location.origin);
            url.searchParams.set('page', currentPage);
            url.searchParams.set('limit', currentLimit);
            if (currentSearch) {
                url.searchParams.set('search', currentSearch);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: authHeaders
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const userRes = await response.json();

            let usersList = [];
            let totalUsers = 0;
            let totalPages = 1;

            if (Array.isArray(userRes)) {
                usersList = userRes;
                totalUsers = usersList.length;
            } else if (userRes && Array.isArray(userRes.data)) {
                usersList = userRes.data;
                totalUsers = userRes.totalUsers || usersList.length;
                totalPages = userRes.totalPages || 1;
            }

            renderUserTable(usersList);
            renderPagination(totalPages);
            updateStats(usersList, totalUsers);
        } catch (error) {
            console.error('Lỗi lấy danh sách user:', error);
            userTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">Lỗi kết nối máy chủ!</td></tr>`;
        }
    }

    // 4. Update Header Metrics Stat Cards
    function updateStats(usersList, totalUsersCount) {
        statTotalUsers.textContent = totalUsersCount;

        const admins = usersList.filter(u => u.role === 'admin').length;
        const regulars = usersList.filter(u => u.role !== 'admin').length;
        
        statTotalAdmins.textContent = admins;
        statRegularUsers.textContent = regulars;

        if (usersList.length > 0) {
            const totalAge = usersList.reduce((acc, curr) => acc + (curr.age || 0), 0);
            statAvgAge.textContent = Math.round(totalAge / usersList.length);
        } else {
            statAvgAge.textContent = '0';
        }
    }

    // 5. Render User Table
    function renderUserTable(users) {
        pageCountText.textContent = users.length;

        if (users.length === 0) {
            userTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                        Không tìm thấy người dùng nào phù hợp
                    </td>
                </tr>
            `;
            return;
        }

        userTableBody.innerHTML = users.map((u, index) => {
            const initial = (u.name || 'U').charAt(0).toUpperCase();
            return `
                <tr>
                    <td class="text-muted fw-mono">${(currentPage - 1) * currentLimit + index + 1}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2.5">
                            <div class="user-avatar-sm">${initial}</div>
                            <span class="fw-bold">${escapeHtml(u.name)}</span>
                        </div>
                    </td>
                    <td class="text-secondary">${escapeHtml(u.email)}</td>
                    <td class="fw-semibold">${u.age !== undefined ? u.age : '-'}</td>
                    <td>
                        <span class="${u.role === 'admin' ? 'badge badge-role-admin' : 'badge badge-role-user'}">
                            <i class="bi bi-${u.role === 'admin' ? 'shield-fill-check' : 'person-fill'}"></i>
                            ${(u.role || 'user').toUpperCase()}
                        </span>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1 btn-edit px-2.5" data-user='${JSON.stringify(u)}'>
                            <i class="bi bi-pencil-square"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-delete px-2.5" data-id="${u._id}">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Action Handlers
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const userData = JSON.parse(btn.getAttribute('data-user'));
                openEditModal(userData);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteUser(id);
            });
        });
    }

    // 6. Render Pagination Controls
    function renderPagination(totalPages) {
        if (totalPages <= 1) {
            paginationList.innerHTML = '';
            return;
        }

        let items = '';

        // Previous button
        items += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></a>
            </li>
        `;

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            items += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        items += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></a>
            </li>
        `;

        paginationList.innerHTML = items;

        paginationList.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (page && page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    fetchUsers();
                }
            });
        });
    }

    // 7. Live Search Event Listener
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        currentSearch = e.target.value.trim();
        currentPage = 1; // Reset to page 1 on new search

        searchTimeout = setTimeout(() => {
            fetchUsers();
        }, 300);
    });

    // 8. Open Add User Modal
    btnOpenAddModal.addEventListener('click', () => {
        userModalLabel.textContent = 'Thêm Người Dùng Mới';
        userForm.reset();
        modalUserId.value = '';
        modalAlert.innerHTML = '';
        document.getElementById('modalPassword').setAttribute('required', 'required');
        document.getElementById('passwordHelpText').textContent = 'Bắt buộc nhập mật khẩu khi tạo tài khoản mới (Tối thiểu 6 ký tự).';
        bsModal.show();
    });

    // 9. Open Edit User Modal
    function openEditModal(user) {
        userModalLabel.textContent = 'Cập Nhật Thông Tin Người Dùng';
        modalAlert.innerHTML = '';
        modalUserId.value = user._id;
        document.getElementById('modalName').value = user.name || '';
        document.getElementById('modalEmail').value = user.email || '';
        document.getElementById('modalAge').value = user.age || '';
        document.getElementById('modalRole').value = user.role || 'user';
        document.getElementById('modalPassword').value = '';
        document.getElementById('modalPassword').removeAttribute('required');
        document.getElementById('passwordHelpText').textContent = 'Để trống nếu không muốn thay đổi mật khẩu hiện tại.';
        bsModal.show();
    }

    // 10. Handle Modal Form Submit (Create & Edit)
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        modalAlert.innerHTML = '';

        const id = modalUserId.value;
        const name = document.getElementById('modalName').value.trim();
        const email = document.getElementById('modalEmail').value.trim();
        const age = parseInt(document.getElementById('modalAge').value);
        const role = document.getElementById('modalRole').value;
        const password = document.getElementById('modalPassword').value.trim();

        const isEdit = Boolean(id);
        const url = isEdit ? `/api/users/${id}` : '/api/users';
        const method = isEdit ? 'PUT' : 'POST';

        const payload = { name, email, age, role };
        if (password) {
            payload.password = password;
        }

        setModalLoading(true);

        try {
            const response = await fetch(url, {
                method: method,
                headers: authHeaders,
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                bsModal.hide();
                showAlert(isEdit ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng mới thành công!', 'success');
                await fetchUsers();
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    showModalAlert(data.errors.map(err => err.msg).join('<br>'), 'danger');
                } else {
                    showModalAlert(data.message || data.error || 'Có lỗi xảy ra', 'danger');
                }
            }
        } catch (error) {
            console.error('Lỗi thao tác user:', error);
            showModalAlert('Lỗi kết nối máy chủ!', 'danger');
        } finally {
            setModalLoading(false);
        }
    });

    // 11. Delete User
    async function deleteUser(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không? Action này không thể hoàn tác.')) return;

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Đã xóa người dùng thành công!', 'success');
                await fetchUsers();
            } else {
                showAlert(data.message || data.error || 'Không thể xóa người dùng', 'danger');
            }
        } catch (error) {
            console.error('Lỗi xóa user:', error);
            showAlert('Lỗi máy chủ khi xóa người dùng!', 'danger');
        }
    }

    // 12. Logout
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    function handleUnauthorized() {
        localStorage.removeItem('token');
        alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = 'login.html';
    }

    function showAlert(message, type) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show border-0 shadow-sm mb-4" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => {
            const alertEl = alertContainer.querySelector('.alert');
            if (alertEl) {
                const bsAlert = new bootstrap.Alert(alertEl);
                bsAlert.close();
            }
        }, 4000);
    }

    function showModalAlert(message, type) {
        modalAlert.innerHTML = `
            <div class="alert alert-${type} py-2 mb-3 border-0" role="alert">
                <i class="bi bi-exclamation-circle-fill me-1"></i> ${message}
            </div>
        `;
    }

    function setModalLoading(isLoading) {
        const btnSave = document.getElementById('btnSaveUser');
        const txt = document.getElementById('modalBtnText');
        const spinner = document.getElementById('modalBtnSpinner');
        if (isLoading) {
            btnSave.disabled = true;
            txt.classList.add('d-none');
            spinner.classList.remove('d-none');
        } else {
            btnSave.disabled = false;
            txt.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
