import { modalProvider } from './symbols.js';
import Modal from '../components/Modal.vue';

const data = ref({
    message: "",
    type: "",
    title: "",
    closable: true,
});

function openModal({ title, bodytext, closeButtonText, saveButtonText, onClose, onSave }){
    data.value = {
        ...feedback.value,
        title,
        bodytext,
        closeButtonText,
        saveButtonText,
        onClose,
        onSave
    }
}
function closeModal(){

}

provide(modalProvider, {
    openModal,
    closeModal
});