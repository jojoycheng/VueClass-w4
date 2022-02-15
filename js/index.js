// 引入 Vue
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.js'
// 引入區域元件
import pagination from './pagination.js'

// 設定 api 路徑 
const apiUrl = 'https://vue3-course-api.hexschool.io/v2'
const apiPath = 'ejmusic'

// 根元件
const app = createApp({
    data() {
        return {
            products: [],
            isNew: false,
            tempProduct: {
                // 預先設定空陣列，避免 vue 讀取不到
                imagesUrl: [],
            },
            pagination: {},
        }
    },
    mounted() {
        // 驗證登入狀態
        this.checkAdmin()
    },
    // 註冊區域元件
    components: {
        pagination
    },
    methods: {
        checkAdmin() {
            // 取出 Token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jojoyToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
            axios.defaults.headers.common.Authorization = token
            // 確認登入狀態
            const url = `${apiUrl}/api/user/check`;
            axios.post(url)
                .then(() => {
                    // 取得產品資料
                    this.getData();
                })
                .catch((err) => {
                    alert(err.data.message)
                    // 重新導向登入頁面
                    window.location = './login.html';
                })
        },
        getData(page = 1) { // 參數預設值，預設分頁
            const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
            axios.get(url).then(res => {
                this.products = res.data.products;
                this.pagination = res.data.pagination
            }).catch(err => {
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
                this.$refs.productModalDom.openModal()
            } else if (status === 'edit') {
                // 淺拷貝物件
                this.tempProduct = { ...item };
                // 切換狀態
                this.isNew = false;
                this.$refs.productModalDom.openModal()
            } else if (status === 'delete') {
                this.tempProduct = { ...item };
                this.$refs.delModalDom.openModal()
            }
        },
    },
})

// 產品元件全域註冊
app.component('product-modal', {
    props: ['tempProduct', 'isNew'],
    template: '#templateForProductModal',
    data() {
        return {
            productModal: '',
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
    },
    methods: {
        updateProduct() {
            // 預設為新增產品
            let url = `${apiUrl}/api/${apiPath}/admin/product`;
            let http = 'post';

            // 切換為修改產品
            if (!this.isNew) {
                url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }

            axios[http](url, { data: this.tempProduct }).then(res => {
                alert(res.data.message);
                this.hideModal()
                // 重新取得產品資料
                // 用 emit 呼叫外層方法
                this.$emit('update')
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        openModal() {
            this.productModal.show()
        },
        hideModal() {
            this.productModal.hide()
        },
        createImages() {
            // 新增空白陣列
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    }
})

// 刪除產品元件
app.component('del-modal', {
    props: ['tempProduct'],
    template: '#templateForDelete',
    data() {
        return {
            delProductModal: '',
        }
    },
    mounted() {
        this.delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
    },
    methods: {
        delProduct() {
            const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url).then(res => {
                alert(res.data.message);
                this.hideModal();
                // 重新取得產品資料
                // 用 emit 呼叫外層方法
                this.$emit('update')
            }).catch(err => {
                alert(err.data.message);
            })
        },
        openModal() {
            this.delProductModal.show()
        },
        hideModal() {
            this.delProductModal.hide()
        },
    }
})

app.mount('#app');