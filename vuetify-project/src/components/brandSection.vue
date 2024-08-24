<template>
    <v-container
        fluid
        class="my-v-container bg"
        >
            <v-parallax
            src="@/assets/bg/bg-03-04.png"
            scale="0.75"
        >
                <div class="d-flex flex-column align-center justify-center text-center w-100 h-100">
                    <div class="text-h4 font-weight-black text-white ga-1">
                        玉食堂 JADE
                    </div>
                    <p class="text-h5 font-weight-medium mb-2 text-white">
                        歡迎來到玉食堂!
                    </p>
                    <p class="text-h8 font-weight-light mb-2 text-white">
                        讓我們一起在森林，享受美食吧!
                    </p>
                </div>
            </v-parallax>
    </v-container>
</template>

<script setup>

</script>

<style scoped lang="scss">
.my-v-container{
padding: 0;
margin: 0px;
height: 320px;
}

.bg{
background-color: #2C3E31;
}
</style>