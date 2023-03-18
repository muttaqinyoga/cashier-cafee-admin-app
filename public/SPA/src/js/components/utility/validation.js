const validation = {
    run: function (idElem) {
        const elem = document.querySelector(`#${idElem}`);
        const elemFeedBack = document.querySelector(`#${idElem}_feedback`);
        if (elem && elemFeedBack) {
            const val = elem.value.trim();
            if (val) {
                elem.classList.remove("is-invalid");
                return true;
            }
            elem.classList.add("is-invalid");
            elemFeedBack.textContent = `This field is required`;
            elem.value = "";
        }
        return false;
    },
    checkFile: function (nameElem) {
        const file = document.getElementsByName(`${nameElem}`)[0];
        const fileFeedback = document.querySelector(`#${nameElem}_feedback`);

        if (
            !["image/jpg", "image/jpeg", "image/png"].includes(
                file.files[0].type
            )
        ) {
            file.classList.add("is-invalid");
            fileFeedback.textContent = `Only jpg, jpeg and png file format are allowed`;
            file.value = "";
            return false;
        }
        if (file.files[0].size > 100000) {
            file.classList.add("is-invalid");
            fileFeedback.textContent = `File must be lower than 100Kb`;
            file.value = "";
            return false;
        }
        file.classList.remove("is-invalid");
        return true;
    },
};

export default validation;
