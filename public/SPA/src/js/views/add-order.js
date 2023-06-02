export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-info text-center p-3">Order List</h3>
            <div class="card-body">
                <div class="row ">
                    <h2 class="text-dark text-center">Create New Order</h2>
                </div>
                <div class="row mt-3 d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <div class="row mb-2" id="errorMessage">
                            
                        </div>
                        <form method="post" id="addOrderForm">
                            <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                            <div class="mb-3 row">
                                <label for="order_food" class="col-sm-3 col-form-label">Menu</label>
                                <div class="col-sm-9" id="order_food">
                                    
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <button type="button" class="btn btn-primary" id="addMoreMenu" data-bs-toggle="modal" data-bs-target="#addFoodOrderModal">+</button>  
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-3 col-form-label">Type Order</label>
                                <div class="col-sm-9">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="type_order" id="dineIn" value="dine_in">
                                        <label class="form-check-label" for="dineIn">
                                            Dine in
                                        </label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="type_order" id="direct" value="direct">
                                        <label class="form-check-label" for="direct">
                                            Direct
                                        </label>
                                    </div>
                                    <small class="text-danger d-none" id="type_order_feedback">Choose one of type orders</small>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="order_customer_name" class="col-sm-3 col-form-label">Customer Name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" name="order_customer_name" id="order_customer_name">
                                    <div class="invalid-feedback" id="order_customer_name_feedback"></div>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="order_notes" class="col-sm-3 col-form-label">Notes</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" name="order_notes" id="order_notes" row="3" max="100">
                                    </textarea>
                                    <div class="invalid-feedback">Notes must be lower than 100 characters</div>
                                </div>
                            </div>
                            <div class="mb-3 row" id="fieldTable">
                                
                            </div>
                            <div class="mb-3 row">
                                <button type="submit" class="form-control btn btn-info">Create</button>
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
