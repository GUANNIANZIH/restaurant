<template>
    <v-card
        :disabled="loading"
        :loading="loading"
        class="mx-auto my-12"
        min-width="374"
        max-width="374"
    >
        <template v-slot:loader="{ isActive }">
        <v-progress-linear
            :active="isActive"
            color="#D78A24"
            height="4"
            indeterminate
        ></v-progress-linear>
        </template>

        <!-- 商品卡獨立頁面 :to="'/products/' -->
        <router-link :to="'/products/' + props._id" class="no-underline">
        <!-- 修改 :src -->
        <v-img height="250" :src="props.image" cover></v-img>
        </router-link>

        <v-card-item>
        <router-link :to="'/products/' + props._id" class="no-underline">
            <v-card-title class="a-custom">
            {{ props.name }}
            </v-card-title>
        </router-link>

        <v-card-title>
            <span class="me-1">{{ props.category }}</span>
        </v-card-title>

        <v-card-subtitle>
            <span class="me-1">{{ props.description }}</span>
            <v-icon color="#D78A24" icon="mdi-fire-circle" size="small"></v-icon>
        </v-card-subtitle>
        </v-card-item>

        <v-card-text>
        <v-row class="mx-0">
            <v-rating
            :model-value="4.5"
            color="amber"
            density="compact"
            size="small"
            half-increments
            readonly
            ></v-rating>
            <div class="text-grey ms-4">
            4.5 (413)
            </div>
        </v-row>
        <div class="my-4 text-subtitle-1">
            ${{ props.price }}
        </div>
        </v-card-text>

        <v-divider class="mx-4 mb-1"></v-divider>

        <v-card-title class="v-card-title-text">客製化口味</v-card-title>
        <div class="px-4 mb-2">
        <v-chip-group v-model="selection" selected-class="bg-y" column>
            <v-chip>
            加辣
            <v-select
                v-model="spicyLevel"
                :items="spicyLevels"
                label="選擇辣度"
                class="ml-2"
                dense
            />
            </v-chip>
            <v-chip>
            <v-checkbox v-model="addEgg" class="hidden-checkbox" />
            加蛋 +15
            </v-chip>
            <v-chip>
            <v-checkbox v-model="addRice" class="hidden-checkbox" />
            加飯 +15
            </v-chip>
            <v-chip>
            <v-checkbox v-model="addShacha" class="hidden-checkbox" />
            加沙茶 +15
            </v-chip>
            <v-chip>
            <v-checkbox v-model="addIngredient" class="hidden-checkbox" />
            加料 +45
            </v-chip>
        </v-chip-group>
        </div>

        <v-card-actions>
        <v-btn
            color="#D78A24"
            @click="addCart"
            :loading="loading"
            block
        >加入購物車</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
    import { ref } from 'vue'
    import { useUserStore } from '@/stores/user.js'
    import { useRouter } from 'vue-router'
    import { useSnackbar } from 'vuetify-use-dialog'

    const props = defineProps({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sell: {
        type: Boolean,
        required: true
    }
    })

    const user = useUserStore()
    const router = useRouter()
    const createSnackbar = useSnackbar()

    const selection = ref([])

    const spicyLevel = ref('不辣')
    const spicyLevels = ['不辣', '微辣', '小辣', '中辣', '大辣']

    const addEgg = ref(false);
    const addRice = ref(false);
    const addShacha = ref(false);
    const addIngredient = ref(false);
    const loading = ref(false)

    const addCart = async () => {
    if (!user.isLogin){
        router.push('/member')
        return
    }
    loading.value = true

    const customizations = {
        spicyLevel: spicyLevel.value,
        addEgg: addEgg.value,
        addRice: addRice.value,
        addShacha: addShacha.value,
        addIngredient: addIngredient.value,
    };
    const result = await user.addCart(props._id, 1, customizations)
    createSnackbar({
        text: result.text,
        snackbarProps: {
        color: result.color
        }
    })
    loading.value = false
    }
    setTimeout(() => {
    loading.value = false
    }, 2000)
</script>

<style scoped>
    .v-chip-group {
        display: flex;
        flex-direction: column;
    }
    .v-chip {
        display: flex;
        align-items: center;
        margin-bottom:12px; /* 增加項目間距 */
    }
    .a-custom {
        font-size: 22px;
        font-weight: bolder;
        color: #D78A24;
    }
    .v-card-title-text{
        font-size: 18px;
        font-weight: 500;
        color: #D78A24;
    }
    .v-card{
        padding: 0;
        margin: 0;
    }
    a {
        text-decoration: none;
    }
    .bg-y{
        background-color: #D78A24;
        color: white;
    }
    .ml-2 {
        margin-left: 8px;
    }
    .hidden-checkbox {
        display: none;
    }
</style>
