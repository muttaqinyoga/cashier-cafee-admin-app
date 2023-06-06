import "../components/utility/ConfirmDeleteModal.js";
export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h4 class="card-header bg-info text-white text-center p-2">Dinning Table List</h4>
            <div class="card-body text-white">
                <div class="row">
                    <div class="col-md-3">
                        <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#addDinningTableModal">
                            Add New Dinning Table
                        </button>
                    </div>
                </div>
                <div class="row mt-3">
                    <table id="foodTables" class="table table-striped table-responsive table-bordered">

                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade text-left" id="addDinningTableModal" tabindex="-1" aria-labelledby="addDinningTableModal" role="dialog">
        <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header bg-info">
                    <h4 class="modal-title text-light">Add New Dinning Table</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                    </button>
                </div>
                <form method="post" id="addDinningTableForm">
                    <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                    <div class="modal-body">
                        <label for="dinning_table_number">Dinning Table Number</label>
                        <div class="form-group">
                            <input type="number"  class="form-control" name="dinning_table_number" id="dinning_table_number" min="1">
                            <div class="invalid-feedback" id="dinning_table_number_feedback">

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-info ml-1">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade text-left" id="editDinningTableModal" tabindex="-1" aria-labelledby="editDinningTableModal" role="dialog">
        <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header bg-warning">
                    <h4 class="modal-title text-light">Edit Dinning Table</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                    </button>
                </div>
                <form method="post" id="editDinningTableForm">
                    <input type="hidden" name="_token" value="${APP_STATE.csrf}" >
                    <input type="hidden" name="dinning_table_edit_id" id="dinning_table_edit_id">
                    <div class="modal-body">
                        <label for="dinning_table_edit_number">Name</label>
                        <div class="form-group">
                            <input type="number" class="form-control" name="dinning_table_edit_number" id="dinning_table_edit_number">
                            <div class="invalid-feedback" id="dinning_table_edit_number_feedback">
                            
                            </div>
                        </div>
                        <label>Status</label>
                        <div class="form-group">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="edit_food_status" id="dinning_table_status_1" value="AVALIABLE">
                                <label class="form-check-label" for="dinning_table_status_1">AVALIABLE</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="edit_food_status" id="dinning_table_status_2" value="UNAVALIABLE">
                                <label class="form-check-label" for="dinning_table_status_2">UNAVALIABLE</label>
                            </div>
                            <small class="text-danger d-none" id="edit_food_status_feedback">Choose one of status</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-warning ml-1">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <confirm-delete-modal></confirm-delete-modal>
`;
