class ConfirmDeleteModal extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<div class="modal fade text-left" id="ConfirmDeleteModal" tabindex="-1" aria-labelledby="ConfirmDeleteModal" role="dialog">
                                    <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header bg-danger">
                                                <h4 class="modal-title text-light">Confirm Delete</h4>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <form method="post" id="deleteConfirmForm">
                                                <input type="hidden" name="delete_id" id="delete_id">
                                                <div class="modal-body">

                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                                        Cancel
                                                    </button>
                                                    <button type="submit" class="btn btn-danger ml-1" >
                                                        Delete
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                            </div>`;
    }
}
customElements.define("confirm-delete-modal", ConfirmDeleteModal);
