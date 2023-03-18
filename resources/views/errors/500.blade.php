<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Aplikasi Kasir Kafe</title>
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
        <div class="container text-center pt-32">
            <h1 class='error-title'>500</h1>
            <p>Terjadi error pada sistem. Silahkan hubungi Administrator</p>
            <a href="{{ url('/') }}" class='btn btn-primary'>Kembali</a>
        </div>
    </div>
</body>

</html>