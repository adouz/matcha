<template>
    <div class="texto">
        <p class="title size has-text-danger has-text-centered is-is-family-code is-hidden-touch">404</p>
        <p class="title size-mobile has-text-danger has-text-centered is-is-family-code is-hidden-desktop">404</p>
        <p class="title has-text-centered is-is-family-code">Page not found</p>
        <div class="buttons has-addons is-centered">
            <span class="button is-info" @click="goback"><i class="el-icon-back"></i> Go Back</span>
        </div>

    </div>
</template>

<script>
export default {
    methods:{
        goback(){
            this.$router.push({ name: 'dashboard' });
        }
    }
}
</script>

<style scoped>

.texto{
    margin-top: 15%;
}
.size {
    font-size: 15rem;
}
.size-mobile {
    font-size: 10rem;
}
</style>
