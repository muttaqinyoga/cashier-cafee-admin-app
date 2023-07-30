export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h5 class="card-header bg-success text-light">Home</h5>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <h5 class="card-title">Aplikasi Kasir Kafe</h5>
                        <p class="card-text">Selamat datang, ${APP_STATE.username}</p>
                    </div>
                    <div class="col-md-9">
                        <div class="row">
                        <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-warning text-light"><h5 class="card-title">Pendapatan Hari ini</h5></div>
                                    <div class="card-body">
                                        <p class="card-text" id="dayPendapatan"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card mb-3">
                                    <div class="card-header bg-primary text-light"><h5 class="card-title">Pendapatan Bulan ini</h5></div>
                                    <div class="card-body">
                                        <p class="card-text" id="monthPendapatan"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2>
                        <h5 class="card-title">Tabel Pendapatan</h5>
                    </div>
                    <div class="col-md-10 col-sm-12">
                        <table id="pendapatanTable" class="table table-striped table-responsive">
                        
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
