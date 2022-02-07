import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.js'

// 宣告 Modal 的變數
let productModal = null;
let delProductModal = null;

createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'ejmusic',
            products: [],
            isNew: false,
            tempProduct: {
                // 預先設定空陣列，避免 vue 讀取不到
                imagesUrl: [],
            },
        }
    },
    mounted() {
        // 實體化 Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });

        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jojoyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        // 驗證登入狀態
        this.checkAdmin();
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    // 取得產品資料
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message)
                    window.location = './login.html';
                })
        },
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url).then((response) => {
                this.products = response.data.products;
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';
            
            // 預設為新增產品
            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.tempProduct }).then((response) => {
                alert(response.data.message);
                productModal.hide();
                // 重新取得產品資料
                this.getData();
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        openModal(status, item) {
            // 利用傳入的參數區分執行動作
            if (status === 'new') {
                // 先清空資料
                this.tempProduct = {
                    imagesUrl: [],
                };
                // 切換狀態
                this.isNew = true;
                productModal.show();
            } else if (status === 'edit') {
                // 淺拷貝物件
                this.tempProduct = { ...item };
                // 切換狀態
                this.isNew = false;
                productModal.show();
            } else if (status === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url).then((response) => {
                alert(response.data.message);
                delProductModal.hide();
                // 重新取得產品資料
                this.getData();
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        createImages() {
            // 新增空白陣列
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },
}).mount('#app');