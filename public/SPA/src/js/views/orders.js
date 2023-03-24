import "../components/utility/ConfirmDeleteModal.js";
export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-info text-white text-center p-3">Order List</h3>
            <div class="card-body text-white">
                <div class="row">
                    <div class="col-md-3">
                        <a href="/admin/order/add" class="btn btn-outline-info" data-link>Create New Order</a>
                    </div>
                </div>
                <div class="row mt-3">
                    
                    <table id="foodTables" class="table table-striped table-responsive">

                    </table>
                </div>
            </div>
        </div>
    </div>
    <confirm-delete-modal></confirm-delete-modal>
    <div class="modal fade" id="detailOrderModal" tabindex="-1" aria-labelledby="detailOrderModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-info">
                    <h5 class="modal-title" id="detailOrderModalLabel">Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 row">
                        <label for="detail_order_number" class="col-sm-3 col-form-label">Order Number</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_order_number">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_table_number" class="col-sm-3 col-form-label">Table Number</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_table_number">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_foods" class="col-sm-3 col-form-label">Menu List</label>
                        <div class="col-sm-9">
                            <ul class="form-control-plaintext" id="detail_foods">

                            </ul>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_total_price" class="col-sm-3 col-form-label">Total</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_total_price">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_created_at" class="col-sm-3 col-form-label">Created at</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_created_at">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_status" class="col-sm-3 col-form-label">Status</label>
                        <div class="col-sm-9">
                            <span class="form-control-plaintext badge rounded-pill" id="detail_status" ></span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
`;
