<template>
<div>
    <div class="columns is-centered">
        <div class="column is-one-quarter is-mobile is-hidden-mobile" style="background-color: rgb(238, 241, 246)">
            <div class="columns users is-mobile" >
                <div class="column is-mobile">
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>
                    <div class="item columns is-mobile">
                        <div class="column is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="columnlol " style="background-color: rgb(238, 241, 246)">
            <div class="colums box">
                <div class="column">
                    <div class="columns is-mobile">
                        <div class="column is-1 is-mobile">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                        <div class="column is-mobile">
                            <h1 class="title is-6">F'ING USER</h1>
                            <h2 class="subtitle is-7">offline</h2>
                        </div>
                        <div class="column is-1 is-mobile">
                            <b-dropdown aria-role="list" class="is-right">
                                <button class="button is-info" slot="trigger">
                                    <i class="el-icon-caret-bottom"></i>
                                </button>
                                <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
                                <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
                                <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <div class="column textbox" style="background-color: rgb(300, 300, 200); ">
                    <div class="notification is-success has-text-centered">Say Hello To your Future X</div>
                    <div class="notification is-info" >Say something?</div>
                    <div class="notification user-msg" v-for="message in messages" :key="message">{{ message.message }}</div>
                </div>
                <div class="column inputbox" style="background-color: rgb(238, 241, 246)">
                <el-input  placeholder="Please input" v-model="newMessage">
                    <el-button slot="append" icon="el-icon-top-right" @click="send"></el-button>
                </el-input>
                </div>
            </div>
        </div>
    </div> 
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
/*::-webkit-scrollbar { 
    display: none; 
}*/


@media screen and (min-width: 769px){
.column.is-one-quarter, .column.is-one-quarter-tablet {
    width: 60px;
}
}
.row{
  display: table-row;

}
.users{
    height: 800px;
    width: 60px;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 2px;
}

.user-msg{
      margin-left: 160px;
}
.textbox{
    height: 700px;
    max-width: 700px;
    margin-bottom: 5px;
    overflow-y: scroll;
    overflow-x: hidden;
}
.inputbox{
    height: 60px;
    max-width: 700px;
    margin-bottom: 5px;
    overflow: hidden;
}
.notification{
    width: 500px;
}
.item{
    height: 60px;
    cursor: pointer;
    background-color: rgb(238, 241, 246);
    overflow: hidden;
}
.columnlol{
    padding: 0.75rem;
    display: block;
    flex-basis: 0;
}

</style>
