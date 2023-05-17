export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-info text-center p-3">Order List</h3>
            <div class="card-body">
                <div class="row ">
                    <h2 class="text-dark text-center">Edit Order</h2>
                </div>
                <div class="row mt-3 d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <div class="row mb-2" id="errorMessage">
                            
                        </div>
                        <form method="post" id="addOrderForm">
                            <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                            <div class="mb-3 row">
                                <label for="order_food" class="col-sm-2 col-form-label">Menu</label>
                                <div class="col-sm-10" id="order_food">
                                    
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <button type="button" class="btn btn-primary" id="addMoreMenu" data-bs-toggle="modal" data-bs-target="#addFoodOrderModal">+</button>  
                            </div>
                            <div class="mb-3 row">
                                <label for="order_table_number" class="col-form-label">Dining Table Number</label>
                                <select class="form-control" id="order_table_number" name="order_table_number">
                                </select>
                                <div class="invalid-feedback" id="order_table_number_feedback"></div>
                            </div>
                            <div class="mb-3 row">
                                <button type="submit" class="form-control btn btn-warning">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade text-left" id="addFoodOrderModal" tabindex="-1" aria-labelledby="addFoodOrderModal" role="dialog">
        <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h4 class="modal-title text-light">Add Ordered Food</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                    </button>
                </div>
                <form method="post" id="addFoodOrderedForm">
                    <div class="modal-body">
                        <label>Food</label>
                        <div class="form-group">
                            <select class="form-select" id="food_ordered" name="food_ordered">
                                <option selected value="">--Choose Food--</option>
                            </select>
                            <div class="invalid-feedback" id="food_ordered_feedback"></div>
                        </div>
                        <label>Quantity</label>
                        <div class="form-group">
                            <input class="form-control" type="number" id="food_ordered_quantity" name="food_ordered_quantity" min="1" value="1">
                        </div>
                        <div class="invalid-feedback" id="food_ordered_quantity_feedback"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary ml-1">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;
