import { ref } from "vue";

let resolveModalPromise;
let rejectModalPromise;

const modalData = ref({
    title: '',
    bodyText: '',
    closeButtonText: '',
    saveButtonText: '',
    isVisible: false,
});

function showModal(data) {
    modalData.value = { ...data, isVisible: true };
    
    return new Promise((resolve, reject) => {
        resolveModalPromise = resolve;
        rejectModalPromise = reject;
    });
}

function handleModalClose() {
    modalData.value.isVisible = false;
    resolveModalPromise(false);
}

function handleModalCloseX() {
    modalData.value.isVisible = false;
    resolveModalPromise('closex');
}

function handleModalSave() {
    modalData.value.isVisible = false;
    resolveModalPromise(true);
}

export function useModal() {
    return {
        modalData,
        showModal,
        handleModalClose,
        handleModalCloseX,
        handleModalSave,
    };
}