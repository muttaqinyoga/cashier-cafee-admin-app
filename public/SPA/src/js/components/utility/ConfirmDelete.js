class DeleteModal extends HTMLElement {
    constructor() {
        super();
        const formModal = {
            id: "deleteConfirmModal",
            name: "food_id",
        };
        const propId = this.getAttribute("id");
        if (propId == "deleteConfirmFood") {
            formModal.id = propId;
            formModal.name = "food_delete_id";
        }
        this.innerHTML = `<div class="modal fade text-left" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModal" role="dialog">
                                    <div class="modal-dialog modal-dialog-top modal-dialog-scrollable" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header bg-danger">
                                                <h4 class="modal-title text-light">Confirm Delete</h4>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

                                                </button>
                                            </div>
                                            <form method="post" id="${formModal.id}">
                                                <input type="hidden" name="${formModal.name}" id="${formModal.name}">
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
customElements.define("delete-modal", DeleteModal);
