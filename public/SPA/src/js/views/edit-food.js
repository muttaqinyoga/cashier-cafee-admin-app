export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body">
                <div class="row">
                    <h2 class="text-dark text-center">Edit Food</h2>
                </div>
                <div class="row mt-3 d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <form method="post" id="editFoodForm">
                            <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                            <div class="row mb-3">
                                <label for="edit_food_name" class="col-sm-3 col-form-label">Name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="edit_food_name" name="edit_food_name">
                                    <div class="invalid-feedback" id="edit_food_name_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_categories" class="col-sm-3 col-form-label">Categories</label>
                                <div class="col-sm-9">
                                    <select class="form-select" id="edit_food_categories">
                                        <option selected>--Choose Category--</option>
                                    </select>
                                    <div class="invalid-feedback" id="edit_food_categories_feedback"></div>
                                    <div type="text" class="form-control mt-2" id="edit_selected_categories">
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_price" class="col-sm-3 col-form-label">Price</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" name="edit_food_price" id="edit_food_price">
                                    <div class="invalid-feedback" id="edit_food_price_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_description" class="col-sm-3 col-form-label">Description</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" name="edit_food_description" id="edit_food_description" rows="3">
                                    </textarea>
                                    <div class="invalid-feedback" id="edit_food_description_feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_image" class="col-sm-3 col-form-label">Image</label>
                                <div class="col-sm-9">
                                    <input type="file" class="form-control" id="edit_food_image" name="edit_food_image">
                                    <div class="invalid-feedback" id="edit_food_image_feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_status" class="col-sm-3 col-form-label">Status</label>
                                <div class="col-sm-9">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="edit_food_status" id="food_status_1" value="Tersedia">
                                        <label class="form-check-label" for="food_status_1">Tersedia</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="edit_food_status" id="food_status_2" value="Tidak Tersedia">
                                        <label class="form-check-label" for="food_status_2">Tidak Tersedia</label>
                                    </div>
                                    <div class="invalid-feedback" id="edit_food_status_feedback"></div>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <button type="submit" class="form-control btn btn-warning">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
