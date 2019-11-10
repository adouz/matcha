<template>
    <div>
        <div class="columns">
            <div class="column users">
            <div class="user">
                <div class="card">
                <div class="card-content" >
                    <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">John Smith</p>
                        <p class="subtitle is-6">last message</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="column is-two-thirds">
                <div class="box">
                    <div class="messages">
                        <div class="notification is-info user1">
                            Hello World
                        </div>
                        <div class="notification user2">
                            Hello World
                        </div>
                        <div class="notification is-info user1">
                            Hello World
                        </div>
                        <div class="notification  user2">
                            Hello World
                        </div>
                        <div class="notification  user2">
                            Hello World
                        </div>
                    </div>
                    <div class="controls field has-addons">
                        <div class="control is-expanded">
                            <input class="input" type="text" placeholder="Find a repository">
                        </div>
                        <div class="control">
                            <a class="button is-info">
                            Send
                            </a>
                        </div>
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

.messages{
    overflow-y: scroll;
    height: 500px;
}
.user1{
    width: 300px;
    clear:both;
}
.user2{
    width: 300px;
    float: right;
    clear:both;
}
.users{
    height: 600px;
    overflow-y: scroll;

}
</style>
