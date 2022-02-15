export default {
    props: ['pages'],
    template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
        <li class="page-item" :class="{ disabled: !pages.has_pre }">
            <a class="page-link" @click="$emit('pre-page', pages.current_page - 1)">&laquo;</a>
        </li>
        <li class="page-item" :class="{ active: page === pages.current_page}"
        v-for="page in pages.total_pages" :key="page + '123'">
            <a class="page-link" @click="$emit('get-product', page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pages.has_next }">
            <a class="page-link" @click="$emit('next-page', pages.current_page + 1)">&raquo;</a>
        </li>
    </ul>
</nav>`
}