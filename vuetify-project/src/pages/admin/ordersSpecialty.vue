<template>
    <v-container>
        <v-row>
        <v-col cols="12">
            <h1 class="text-center text-cus">預購私廚訂單管理</h1>
        </v-col>
        <v-divider></v-divider>
        <v-col cols="12">
            <v-data-table
            :items="sortedItems"
            :headers="headers"
            >
            <template #[`item.cartSpecialties`]="data">
                <ul>
                <li v-for="item in data.item.cartSpecialties" :key="item._id">
                    {{ item.p_id.name }} * {{ item.quantity }}
                </li>
                </ul>
            </template>
            <template v-slot:item.status="{ item }">
                <div>
                <v-btn 
                    v-for="status in ['in-processing', 'completed']"
                    :key="status"
                    @click="changeStatus(item, status)"
                    class="mt-2 mb-2 w-75 bg-dark"
                    :disabled="isDisabled(item.status)"
                >
                    {{ status }}
                </v-btn>
                <v-btn 
                title="canceled" 
                @click="canceled(item)"
                class="mt-2 mb-2 w-75 bg-er"
                :disabled="isDisabled(item.status)"
                >Canceled</v-btn>
                </div>
            </template>
            </v-data-table>
        </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue'
    import { useApi } from '@/composables/axios'
    import { useSnackbar } from 'vuetify-use-dialog'
    import { definePage } from 'vue-router/auto'

    definePage({
    meta: {
        title: '玉食堂 | 預購私廚訂單管理',
        login: true,
        admin: true
    }
    })

    const { apiAuth } = useApi()
    const createSnackbar = useSnackbar()
    const items = ref([])
    const headers = [
    { title: '訂單編號', key: '_id' },
    { title: '會員帳號', key: 'user.account' },
    { title: '下單日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
    { title: '訂單商品', key: 'cartSpecialties', sortable: false},
    {
        title: '訂單金額',
        key: 'price',
        value: item => {
        return item.cartSpecialties.reduce((total, current) => {
            return total + current.quantity * current.p_id.price
        }, 0)
        }
    },
    { title: '訂單狀態', key: 'status', sortable: false },
    ]

    // 取得所有訂單
    const loadItems = async () => {
    try {
        // apiAuth.get('/order/all') 取得所有訂單
        const { data } = await apiAuth.get('/order/allSpecialty')
        // items 陣列存取所有訂單
        // data 是上面的 { data } 解構出來的
        // ...data.result 是將 data.result 的內容展開
        items.value.push(...data.result)
    } catch (error) {
        console.log(error)
        createSnackbar({
        text: error?.response?.data?.message || '發生錯誤',
        snackbarProps: {
            color: 'red'
        }
        })
    }
    }
    loadItems()

    const changeStatus = async (item, status) => {
    try {
        const { data } = await apiAuth.patch('/order/allSpecialty', { _id: item._id, status });
        createSnackbar({
        text: data.message,
        snackbarProps: {
            color: '#3C5D44'
        }
        });
        loadItems();
    } catch (error) {
        console.log(error);
        createSnackbar({
        text: error?.response?.data?.message || '發生錯誤',
        snackbarProps: {
            color: 'red'
        }
        });
    }
    };

    // 取消訂單狀態
    const canceled = async (item) => {
    await changeStatus(item, 'canceled');
    };

    // 使用 computed 來判斷按鈕是否需要禁用
    const isDisabled = (status) => {
    return ['completed', 'canceled'].includes(status);
    };

    // 自定義排序函數
    // computed 來生成排序過的 items 列表 :
    // 排序依據是 statusOrder 中的順序：pending、in-process 狀態的訂單會排在前面，completed 和 canceled 排在後面。
    const sortedItems = computed(() => {
        return items.value.slice().sort((a, b) => {
            const statusOrder = ['in-process', 'completed', 'canceled', 'canceled'];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        })
    })

</script>

<style scoped>
    .bg-dark{
    background-color: #3C5D44;
    color: white;
    }
    .bg-er{
    background-color: #D66425;
    color: white;
    }
    .text-cus{
    color: #2C3E31;
    font-weight: bold;
    }
</style>

<route lang="yaml">
meta:
    layout: admin
</route>
