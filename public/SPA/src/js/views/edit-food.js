import "./header.js";
import "../components/utility/toast.js";
export default () =>
    /*html*/
    `
    <header-app></header-app>
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body">
                <div class="row ">
                    <h2 class="text-dark text-center">Edit Food</h2>
                </div>
                <div class="row mt-3 d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <form action="" method="post" id="editFoodForm">
                            <input type="hidden" name="_token" value="${csrf}" >
                            <div class="row mb-3">
                                <label for="edit_food_name" class="col-sm-2 col-form-label">Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="edit_food_name" name="edit_food_name">
                                    <div class="invalid-feedback" id="edit_food_name_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_categories" class="col-sm-2 col-form-label">Categories</label>
                                <div class="col-sm-10">
                                    <select class="form-select" id="edit_food_categories">
                                        <option selected>--Choose Category--</option>
                                    </select>
                                    <div class="invalid-feedback" id="edit_food_categories_feedback"></div>
                                    <div type="text" class="form-control mt-2" id="edit_selected_categories">
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_price" class="col-sm-2 col-form-label">Price</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="edit_food_price">
                                    <div class="invalid-feedback" id="edit_food_price_feedback"></div>
                                </div>
                                
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_description" class="col-sm-2 col-form-label">Description</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="edit_food_description" id="edit_food_description" rows="3">
                                    </textarea>
                                    <div class="invalid-feedback" id="edit_food_description_feedback"></div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="edit_food_image" class="col-sm-2 col-form-label">Image</label>
                                <div class="col-sm-10">
                                    <input type="file" class="form-control" id="edit_food_image" name="edit_food_image">
                                    <div class="invalid-feedback" id="edit_food_image_feedback"></div>
                                </div>
                            </div>
                            <div class="form-group mt-3">
                                <button type="submit" class="form-control btn btn-warning">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <toast-app status="danger" message="berhasil"></toast-app>
`;
