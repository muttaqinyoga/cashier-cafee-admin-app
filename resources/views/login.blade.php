<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in - Aplikasi Kasir Kafe</title>
    <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
    <style>
        #auth {
            background-color: #ebf3ff;
            min-height: 100vh;
            padding-top: 100px;
        }
    </style>
</head>

<body>
    <div id="auth">
        <div class="container">
            <div class="row">
                <div class="col-md-5 col-sm-12 mx-auto">
                    <div class="card pt-4 bg-dark">
                        <div class="card-body">
                            <div class="text-center mb-5">
                                <h3 class="text-light">Sign In</h3>
                                <p class="text-light">Silahkan masuk ke aplikasi dengan kredensial yang valid</p>
                            </div>
                            <form action="{{ url('auth/login') }}" method="post" id="formLogin">
                                @csrf
                                @if($message = Session::get('FailedLogin') )
                                <div class="alert alert-danger">{{ $message }}</div>
                                @endif
                                <div class="form-group">
                                    <label for="username" class="text-light">Username</label>
                                    <input type="text" class="form-control" id="username" name="username">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-light">Password</label>
                                    <input type="password" class="form-control" id="password" name="password">
                                </div>

                                <div class="form-group mt-3">
                                    <button id="loginBtn" type="submit" class="form-control btn btn-primary">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        const loginModule = {
            init: function() {
                const loginBtn = document.querySelector("#loginBtn");
                const formLogin = document.querySelector("#formLogin");
                formLogin.addEventListener("submit", e => {
                    e.preventDefault();
                    loginBtn.innerText = "Signing...";
                    loginBtn.style.cursor = "not-allowed";
                    formLogin.submit();
                });
            }
        }
        document.addEventListener("DOMContentLoaded", function() {
            loginModule.init();
        });
    </script>
</body>

</html>