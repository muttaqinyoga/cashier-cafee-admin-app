<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Aplikasi Kasir Kafe</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <style>
        #error {
            background-color: #ebf3ff;
            padding: 5rem 0
        }

        #error .error-title {
            font-size: 4rem;
            margin-top: 3rem
        }

        body.theme-dark #error {
            background-color: #151521
        }
    </style>
</head>

<body>
    <div id="error">
        <div class="error-page container">
            <div class="col-md-8 col-12 offset-md-2">
                <div class="text-center">
                    <h1 class="error-title">404 NOT FOUND</h1>
                    <p class='fs-5 text-gray-600'>Halaman tidak ada</p>
                    <a href="{{ url('/') }}" class='btn btn-primary'>Kembali</a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>