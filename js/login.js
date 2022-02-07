import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.js'

const app = {
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'enjmusic',
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            const url = `${this.apiUrl}/admin/signin`
            axios.post(url, this.user)
                .then(res => {
                    const {token, expired} = res.data
                    document.cookie = `jojoyToken=${token}; expires=${new Date(expired)}`

                    window.location = './index.html'
                })
                .catch(err => {
                    alert(err.data.message)
                })
        }
    }
}

createApp(app).mount('#app')