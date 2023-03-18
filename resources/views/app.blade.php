<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <script>
        const logoutBtn = document.querySelector("#logoutBtn");
        const formLogout = document.querySelector("#formLogout");

        logoutBtn.addEventListener("click", function() {
            formLogout.submit();
        });
        const navLinks = document.querySelectorAll(".nav-link");
        const currUrl = window.location.pathname.split("/").pop();
        navLinks.forEach((e) => {
            e.classList.remove = "active";
            if (e.classList.contains(currUrl)) {
                e.classList.add("active");
            }
        });
    </script>
    <script src="{{ asset('js/loadingOverlay.js') }}"></script>
    <script src="{{ asset('js/bootstrap.js') }}"></script>
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
    </script>
    <script type="module" src="{{asset('SPA/src/js/main.js')}}"></script>

</body>

</html>