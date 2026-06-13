import {
    getAllData, showModal, closeModal, modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside, openAuthContainerBtn, openAddProductBtn, AuthContainer, categoryInputs,
    authModeInputs, Form, authBtn, authHintText, authLink, authTitle, formNameContainer,
    CardsContainer, AddProductContainer,
    products, filters, applyFilters, SearchInput

} from "./ts/functions";
import { addToCart, renderCartItems } from "./ts/cartFunctions";
import { getMe, registerUser } from "./ts/requests";
import { type RegUser } from "./ts/types";

openFavoriteBtn.addEventListener('click', () => showModal("favorites"));
openCartBtn.addEventListener('click', () => showModal("cart"));
openAuthContainerBtn.addEventListener('click', () => showModal("auth-mode"));
openAddProductBtn.addEventListener('click', () => showModal("add-product"));

AuthContainer.addEventListener('click', (e) => e.stopPropagation());
Aside.addEventListener('click', (e) => e.stopPropagation());
AddProductContainer.addEventListener('click', (e) => e.stopPropagation());

modal.addEventListener('click', () => closeModal());
closeModalBtn.forEach(btn => btn.addEventListener('click', () => closeModal()));

CardsContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;

    if (!target.classList.contains('add-to-cart-btn')) return;

    const id = target.dataset.id;

    const product = products.find(p => p.id === id);

    if (!product) return;

    addToCart(product);
    renderCartItems();
});

categoryInputs.forEach(input => {
    const category = input.dataset.category as string;
    input.addEventListener('change', () => {
        filters.category = category;

        applyFilters();
    })
});

SearchInput.addEventListener('input', () => {
    filters.search = SearchInput.value;

    applyFilters(); 
})

authModeInputs.forEach(input => {
    input.addEventListener('change', () => {
        const mode = input.dataset.mode as string;
        if (mode === "login") {
            Form.reset();
            formNameContainer.classList.add("hidden");
            authBtn.textContent = "Login";
            authHintText.textContent = "No account?";
            authLink.textContent = "Register";
            authTitle.textContent = "Welcome Back";
        } else {
            Form.reset();
            formNameContainer.classList.remove("hidden");
            authBtn.textContent = "Create account";
            authHintText.textContent = "Already registered?";
            authLink.textContent = "Login";
            authTitle.textContent = "Create account";
        }
    })
})


Form.addEventListener('submit', (e : SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(Form);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
    
})

getAllData();


