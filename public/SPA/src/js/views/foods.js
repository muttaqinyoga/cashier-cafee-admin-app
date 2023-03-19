import "../components/utility/ConfirmDeleteModal.js";
export default () =>
    /*html*/
    `
    <div class="container mt-5">
        <div class="card">
            <h3 class="card-header bg-success text-white text-center p-3">Food List</h3>
            <div class="card-body text-white">
                <div class="row">
                    <div class="col-md-3">
                        <a href="/admin/food/add" class="btn btn-outline-success" data-link>Add New Food</a>
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
`;
