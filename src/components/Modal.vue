<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    bodyText: {
        type: String,
        required: false
    },
    closeButtonText: {
        type: String,
        required: false
    },
    saveButtonText: {
        type: String,
        required: false
    }
});

const emit = defineEmits(['close', 'save', 'closex']);

const handleClose = (value) => {
    emit('close', value);
};

const handleCloseX = () => {
    emit('closex');
};

const handleSave = () => {
    emit('save');
};
</script>

<template>
    <div class="overlay" @click="emit('close')">
        <div class="modals" @click.stop>
            <header>
                <h3 class="title">{{ title }}</h3>
                <button @click="handleCloseX()"><img src="../assets/img/circulo-cruzado.png" alt="close icon"></button>
            </header>
            <main>
                <p>{{ bodyText }}</p>
            </main>
            <footer>
                <button class="boton btn btn-primary" @click="handleClose()">{{ closeButtonText }}</button>
                <button class="boton btn btn-primary" @click="handleSave()">{{ saveButtonText }}</button>
            </footer>
        </div>
    </div>
</template>


<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    /* Fondo negro con opacidad */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modals {
    position: absolute;
    top: 50;
    left: 50;
    background-color: white;
    color: black;
    padding: 20px;
    border-radius: 10px;
    width: 70%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-rows: 50px 1fr 50px;
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
        margin: 0;
    }

    button {
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        border: none;
        background-color: transparent;

        img {
            margin: 0;
            width: 1.5rem;
            height: 1.5rem;
        }
    }
}

footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.boton {
    width: 100%;
}

.boton :first-child {
    margin-right: .5rem;
}
</style>
