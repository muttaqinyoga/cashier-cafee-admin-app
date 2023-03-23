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
                    <h5 class="modal-title" id="detailOrderModalLabel">Food Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 row">
                        <label for="detail_food_name" class="col-sm-3 col-form-label">Name</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_food_name">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_food_categories" class="col-sm-3 col-form-label">Categories</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_food_categories">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_food_price" class="col-sm-3 col-form-label">Price</label>
                        <div class="col-sm-9">
                            <input type="text" readonly class="form-control-plaintext" id="detail_food_price">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_food_status" class="col-sm-3 col-form-label">Status</label>
                        <div class="col-sm-9">
                            <span class="form-control-plaintext badge rounded-pill" id="detail_food_status" ></span>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_food_description" class="col-sm-3 col-form-label">Description</label>
                        <div class="col-sm-9">
                            <textarea class="form-control-plaintext" id="detail_food_description" rows="3">
                            </textarea>
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="detail_food_image" class="col-sm-3 col-form-label">Image</label>
                        <div class="col-sm-9">
                            <img src="" class="form-control-plaintext img-fluid mx-auto d-block" alt="food" width="100" id ="detail_food_image">
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
