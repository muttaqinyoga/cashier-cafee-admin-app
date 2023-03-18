const formatter = {
    reverseRupiah: function (angka) {
        let strAngka = angka.toString().trim();
        let angkaArr = strAngka.split(".");
        let numStr = "";
        angkaArr.forEach((e, i) => {
            if (i > 0) {
                numStr += e;
            }
        });
        return numStr;
    },
    formatRupiah: function (angka) {
        if (angka < 0) {
            return "";
        }
        let number_string = angka.replace(/[^,\d]/g, "").toString();
        const split = number_string.split(",");
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
        if (ribuan) {
            const separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
        return rupiah ? "Rp. " + rupiah : "";
    },
};

export default formatter;
