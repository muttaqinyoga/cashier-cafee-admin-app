<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Aplikasi Kasir Kafe</title>
    <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
    <link rel="stylesheet" href="{{ asset('css/simple-datatables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">

</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container" style="padding-right: 5rem; padding-left: 3rem;">
            <a class="navbar-brand" href="javascript:">Mtq Kafe</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link admin" href="/admin" data-link>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link category" href="/admin/category" data-link>Category List</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link food" href="/admin/food" data-link>Food List</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link dinningtables" href="/admin/dinningtables" data-link>Dinning Tables</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link order" href="/admin/order" data-link>Orders</a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="javascript:" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Akun
                        </a>
                        <ul class="dropdown-menu col-md-4" aria-labelledby="navbarDropdownMenuLink">
                            <li class="dropdown-item">{{ Auth::user()->username }}</li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#ubahPasswordModal" href="javascript:;">Change Password</a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="javascript:" id="logoutBtn">Sign out</a>
                                <form action="{{ url('auth/logout') }}" id="formLogout" method="post" style="display: none;">
                                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                                </form>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div id="app">
    </div>

    <div class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x">
        <div id="toastApp" class="toast border-0 " role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body text-light">

                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>

    <!-- Modal Ubah Password -->
    <div class="modal fade" id="ubahPasswordModal" tabindex="-1" aria-labelledby="ubahPasswordLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="ubahPasswordLabel">Change Password</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="changePasswordForm" method="post">
                    <div class="modal-body">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                        <div class="mb-3" id="changePasswordMessage">

                        </div>
                        <div class="mb-3">
                            <label for="oldPassword" class="col-form-label">Current Password</label>
                            <input type="text" autocomplete="off" class="form-control" id="oldPassword" name="oldPassword">
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="col-form-label">New Password</label>
                            <input type="text" autocomplete="off" class="form-control" id="newPassword" name="newPassword">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>

            </div>
        </div>
    </div>
    <script>
        const logoutBtn = document.querySelector("#logoutBtn");
        const formLogout = document.querySelector("#formLogout");

        logoutBtn.addEventListener("click", function() {
            formLogout.submit();
        });
    </script>
    <script src="{{ asset('js/loadingOverlay.js') }}"></script>
    <script src="{{ asset('js/bootstrap.js') }}"></script>
    <script src="{{ asset('js/qrcode.js') }}"></script>
    <script>
        const TOAST = document.querySelector("#toastApp");
        const TOAST_BODY = document.querySelector(
            "#toastApp .toast-body"
        );
        const TOAST_APP = new bootstrap.Toast(TOAST);
        const APP_STATE = Object.freeze({
            username: "{{ Auth::user()->username }}",
            csrf: "{{ csrf_token() }}",
            baseUrl: "{{ url('') }}",
            assetUrl: "{{ asset('') }}"
        });

        function init() {
            const ubahPasswordModal = new bootstrap.Modal('#ubahPasswordModal');
            const changePasswordForm = document.querySelector('#changePasswordForm')
            const changePasswordMessage = document.querySelector('#changePasswordMessage');
            changePasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                if (!formData.get('oldPassword') || !formData.get('newPassword')) {
                    changePasswordMessage.innerHTML = `<strong class="text-danger">All field are required</strong>`;
                    return;
                }
                ubahPasswordModal.hide();
                fetch(APP_STATE.assetUrl + 'api/admin/password/update', {
                        method: 'POST',
                        headers: {
                            accept: "application/json",
                        },
                        credentials: "same-origin",
                        body: formData,
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (!result.status) {
                            TOAST_BODY.classList.remove('bg-primary');
                            TOAST_BODY.classList.add('bg-danger')
                            TOAST_BODY.textContent = result.message;
                        } else {
                            TOAST_BODY.classList.remove('bg-danger');
                            TOAST_BODY.classList.add('bg-primary');
                            TOAST_BODY.textContent = result.message;

                        }
                        changePasswordForm.reset();
                        TOAST_APP.show();
                    })
                    .catch(err => {
                        console.log(err);

                    })
            })


        }
        (init())
    </script>
    <script type="module" src="{{asset('SPA/src/js/main.js')}}"></script>

</body>

</html>