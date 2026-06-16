import {
    getAllData, showModal, closeModal, modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside, openAuthContainerBtn, openAddProductBtn, AuthContainer,
    authModeSwitch, Form, authBtn, authHintText, authLink, authTitle, formNameContainer,
    CardsContainer, AddProductContainer,
    products, filters, applyFilters, SearchInput, nameInput, emailInput, passwordInput,
    updateNavUI

} from "./ts/functions";
import { addToCart, renderCartItems } from "./ts/cartFunctions";
import { getCategories, getMe, registerUser, loginUser } from "./ts/requests";
import { clearFormError, clearInputError, validateAuthForm } from "./ts/validation";

let authMode: "login" | "register" = "login";

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


SearchInput.addEventListener('input', () => {
    filters.search = SearchInput.value;

    applyFilters();
})

authModeSwitch.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    authMode = target.dataset.mode as "login" | "register";

    if (authMode === "login") {
        formNameContainer.classList.add("hidden");
        authBtn.textContent = "Login";
        authHintText.textContent = "No account?";
        authLink.textContent = "Register";
        authTitle.textContent = "Welcome Back";
        clearInputError(emailInput);
        clearInputError(passwordInput);
        clearFormError();
        Form.reset();
    } else {
        formNameContainer.classList.remove("hidden");
        authBtn.textContent = "Create account";
        authHintText.textContent = "Already registered?";
        authLink.textContent = "Login";
        authTitle.textContent = "Create account";
        clearInputError(nameInput);
        clearInputError(emailInput);
        clearInputError(passwordInput);
        clearFormError();
        Form.reset()
    }
});

[nameInput, emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
        clearInputError(input);
    });
});


Form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(Form);
    const data = Object.fromEntries(formData.entries());

    try {

        if (authMode === "register") {
            const isValid = validateAuthForm(
                nameInput,
                emailInput,
                passwordInput,
                true
            );

            if (!isValid) return;

            await registerUser({
                name: data.name as string,
                email: data.email as string,
                password: data.password as string
            });

            const user = await getMe();

            updateNavUI(user);

            closeModal();
            Form.reset();
            clearFormError();

            clearInputError(nameInput);
            clearInputError(emailInput);
            clearInputError(passwordInput);

            
        } else {
            const isValid = validateAuthForm(
                nameInput,
                emailInput,
                passwordInput,
                false
            );

            if (!isValid) return;

            await loginUser({
                email: data.email as string,
                password: data.password as string
            });

            const user = await getMe();

            updateNavUI(user);
            
            closeModal();
            Form.reset();
            clearFormError();

            clearInputError(nameInput);
            clearInputError(emailInput);
            clearInputError(passwordInput);
        }

    } catch (error) {
        console.error(error)
    }

})

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const user = await getMe();

  updateNavUI(user);
});

getAllData();
getCategories();

