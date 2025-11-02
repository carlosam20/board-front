<template>
    <div class="home">
        <div class="content">
            <h1>Welcome to BoardCollab</h1>
            <p>Start collaborating on your projects today</p>
            <fwb-button  color="purple">Get Started</fwb-button>
        </div>
    </div>
</template>



<script lang = "ts">
export default {
    name: 'Home'
}
// import { useRoute } from 'vue-router';
// import { computed } from 'vue';
import { FwbButton } from 'flowbite-vue'


</script>

<style scoped>
.home {
    min-height: 100vh;
    background: linear-gradient(135deg, #01153b 0%, #6009b3 100%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    text-align: center;
    color: white;
    padding: 2rem;
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background-color: #ffffff;
    color: #1e3c72;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
}

.cta-button:hover {
    transform: scale(1.05);
}
</style>