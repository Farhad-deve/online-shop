import { 
    getAllData, showModal, closeModal, modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside

} from "./functions";

openFavoriteBtn.addEventListener('click', () => showModal("favorites"));
openCartBtn.addEventListener('click', () => showModal("cart"));

Aside.addEventListener('click', (e) => e.stopPropagation());

modal.addEventListener('click', () => closeModal());
closeModalBtn.addEventListener('click', () => closeModal());

getAllData();