<template>
    <div class="pcb">
      <div class="detail" v-for='(value,key) in item'>
        <div >
          {{key}}:{{value}};
        </div>
      </div>

    </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
    .pcb{
      flex:auto;
      height:200px;
      font-size:10px;
      border:1px solid black;

    }

</style>
<script>
    export default{
        props:['item'],
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{

        }
    }
</script>
