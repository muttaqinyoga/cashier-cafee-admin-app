import "./header.js";
import "../components/utility/toast.js";
import "../components/utility/ConfirmDelete.js";
export default (params = null) =>
    /*html*/
    `
    <header-app></header-app>
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body text-white">
                <div class="row">
                    <div class="col-md-3">
                        <a href="/admin/food/add" class="btn btn-outline-primary" data-link>Add New Food</a>
                    </div>
                </div>
                <div class="row mt-3">
                    
                    <table id="foodTables" class="table table-striped table-responsive">

                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade text-left" id="addFoodModal" tabindex="-1" aria-labelledby="addFoodModal" role="dialog">
        <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h4 class="modal-title text-light">Add Food</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="addFoodForm">
                        <input type="hidden" name="_token" value="${csrf}" >
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" placeholder="Enter food name..." class="form-control" name="food_name" id="food_name">
                            <div class="invalid-feedback" id="food_name_feedback">

                            </div>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select class="form-select" id="food_categories">
                                <option selected>--Choose category--</option>
                            </select>
                            <div class="invalid-feedback" id="food_categories_feedback">

                            </div>
                        </div>
                        <div class="form-group mt-2">
                            <div type="text" class="form-control" id="selected_categories">
                                <small id="ctgPlaceholder">No category selected</small>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Sell Price</label>
                            <input type="number" min="0" placeholder="ex. 10000" class="form-control" name="food_price" id="food_price">
                            <div class="invalid-feedback" id="food_price_feedback">

                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-control" name="food_description" id="food_description" rows="3"></textarea>
                            <div class="invalid-feedback" id="food_description_feedback">

                            </div>
                        </div>
                        <div class="form-group">
                            <label>Image</label>
                            <div class="form-group">
                                <input class="form-control" type="file" name="food_image" id="food_image">
                                <div class="invalid-feedback" id="food_image_feedback">

                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary ml-1">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <delete-modal id="deleteConfirmFood"></delete-modal>
    <toast-app status="danger" message="berhasil"></toast-app>
`;
