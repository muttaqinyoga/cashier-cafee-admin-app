class Toast extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<div class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x">
                            <div id="toastAlert" class="toast border-0 " role="alert" aria-live="assertive" aria-atomic="true" >
                                <div class="d-flex">
                                    <div class="toast-body text-light">
                                        
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>`;
    }
}
customElements.define("toast-app", Toast);
