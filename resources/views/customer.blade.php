<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Muttaqin Cafe</title>
    <link rel="stylesheet" href="{{ asset('customer/bootstrap-material.css') }}">
    <style>
        .divider {
            position: relative;
            width: 100%;
            color: #f1f1f1;
            border-top: 3px solid !important;
        }
    </style>
</head>

<body class="bg-light">
    <div class="container-fluid">
        <div class="row justify-content-center mt-1 mb-1">
            <div class="col-lg-5 col-md-12 col-sm-12">
                <div class="card py-3 bg-dark" style="padding-bottom: 0 !important">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <h3 class="fw-bold text-center text-light">MTQ CAFE</h3>
                                @if($currOrderSavedByTable == null)
                                <p class="text-center text-light fw-lighter">
                                    Silahkan pesan makanan yang ada di bawah ini
                                </p>
                                <ul class="nav nav-pills nav-justified" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link active" data-bs-toggle="tab" href="#menu" role="tab">Menu</a>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Kategori</a>
                                        <ul class="dropdown-menu">
                                            <li list-value="">
                                                <a class="dropdown-item active" href="#">Semua</a>
                                            </li>
                                            @foreach($categories as $c)
                                            <li list-value="{{$c->id}}">
                                                <a class="dropdown-item" href="#">{{ $c->name }}</a>
                                            </li>
                                            @endforeach
                                        </ul>
                                    </li>
                                    <li class="nav-item position-relative" id="cartComponent">
                                        <a class="nav-link" data-bs-toggle="tab" href="#cart" role="tab">Cart</a>
                                        <span id="notifCart" class="position-absolute top-0 translate-middle p-2 bg-warning border border-light rounded-circle d-none">
                                        </span>
                                    </li>
                                </ul>
                                @endif
                            </div>
                        </div>
                        <div class="row mt-3">
                            <hr class="divider" />
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="container">
                                    @if($currOrderSavedByTable == null)
                                    <div class="tab-content" id="myTabContent">
                                        <div class="tab-pane fade show active" id="menu" role="tabpanel">
                                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"></div>
                                        </div>
                                        <div class="tab-pane fade" id="cart" role="tabpanel"></div>
                                    </div>
                                    @else
                                    <h5 class="text-center text-primary">Pesanan sudah dibuat. Silahkan menuju kasir</h5>
                                    <p class="text-center text-light">Ringkasan Pesanan</p>
                                    <ul class="list-group">
                                        @foreach($currOrderSavedByTable->foods as $f)
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            {{$f->name}} (Rp. {{ $f->price }})
                                            <span class="badge bg-primary rounded-pill">{{$f->pivot->quantity_ordered}}</span>
                                        </li>
                                        @endforeach
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Total
                                            <span class="badge bg-primary rounded-pill">Rp. {{$currOrderSavedByTable->total_price}}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Nomor Meja
                                            <span class="badge bg-warning rounded-pill">{{$currOrderSavedByTable->table->number}}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Atas Nama
                                            <span>{{$currOrderSavedByTable->customer_name}}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Catatan
                                            <span>{{$currOrderSavedByTable->notes}}</span>
                                        </li>
                                    </ul>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <hr class="divider" />
                        </div>
                        <div class="row">
                            <div id="textYear" class="card-body text-light fw-bold text-center p-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @if($currOrderSavedByTable == null)
    <div class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x">
        <div id="toastApp" class="toast border-0 " role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body text-light">

                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
    <script src="{{ asset('js/loadingOverlay.js') }}"></script>
    <script src="{{ asset('customer/bootstrap.js') }}"></script>
    <script>
        const TOAST = document.querySelector("#toastApp");
        const TOAST_BODY = document.querySelector(
            "#toastApp .toast-body"
        );
        const TOAST_APP = new bootstrap.Toast(TOAST);
        const APP_STATE = Object.freeze({
            csrf: "{{ csrf_token() }}",
            baseUrl: "{{ url('') }}",
            assetUrl: "{{ asset('') }}"
        });
        const tableNumber = '{{ $tableNumber }}';
        const code = '{{ $tableId }}';
    </script>
    <script src="{{ asset('customer/app.js') }}"></script>
    @endif

</body>

</html>