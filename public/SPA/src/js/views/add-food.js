export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body">
                <div class="row ">
                    <h2 class="text-dark text-center">Create New Food</h2>
                </div>
                <div class="row mt-3 d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <form method="post" id="addFoodForm">
                            <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                            <div class="row mb-3">
                                <label for="food_name" class="col-sm-3 col-form-label">Name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" id="food_name" name="food_name">
                                    <div class="invalid-feedback" id="food_name_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="food_categories" class="col-sm-3 col-form-label">Categories</label>
                                <div class="col-sm-9">
                                    <select class="form-select" id="food_categories">
                                        <option selected>--Choose Category--</option>
                                    </select>
                                    <div class="invalid-feedback" id="food_categories_feedback"></div>
                                    <div type="text" class="form-control mt-2" id="selected_categories">
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="food_price" class="col-sm-3 col-form-label">Price</label>
                                <div class="col-sm-9">
                                    <input type="number" min="0" class="form-control" id="food_price" name="food_price" placeholder="Contoh : 10000">
                                    <div class="invalid-feedback" id="food_price_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="food_description" class="col-sm-3 col-form-label">Description</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" name="food_description" id="food_description" rows="3">
                                    </textarea>
                                    <div class="invalid-feedback" id="food_description_feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="food_image" class="col-sm-3 col-form-label">Image</label>
                                <div class="col-sm-9">
                                    <input type="file" class="form-control" id="food_image" name="food_image">
                                    <div class="invalid-feedback" id="food_image_feedback"></div>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <button type="submit" class="form-control btn btn-success">Create</button>
                            </div
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
