<template>
    <div class="table">
        <Common :typeOnly="typeNum"/>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import Common from '@/components/common/common'
    export default {
        name: 'basetable2',
        components: {
            Common: Common
        },
        data() {
            return {
                typeNum: '1-2',
            }
        },
        created() {
            bus.$on('type', msg => {
                console.log(msg);
                this.typeNum = msg;
                
            })
        },
    }

</script>

