import {
    showModal, closeModal, modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside, openAuthContainerBtn, openAddProductBtn, AuthContainer, logOutBtn, myProductsBtn,
    authModeSwitch, Form, authBtn, authHintText, authLink, authTitle, formNameContainer,
    CardsContainer, AddProductContainer,
    filters, applyFilters, SearchInput, nameInput, emailInput, passwordInput,
    updateNavUI, setFavoriteIds,
    favoriteIds

} from "./ts/functions";
import { addToCart, renderCartItems, updateCartTotalPrice } from "./ts/cartFunctions";
import { clearFavoriteCheckboxes, clearFavoritesUI, renderFavoriteCards } from "./ts/favoriteFunctions";
import { getMe, registerUser, loginUser, getData, getCarts } from "./ts/requests";
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


SearchInput.addEventListener('input', () => {
    filters.search = SearchInput.value.trim();

    setTimeout(() => {
        applyFilters();
    }, 1000)
});

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

logOutBtn.addEventListener('click', async () => {
    localStorage.removeItem("token");

    updateNavUI(null);
    setFavoriteIds([]);
    clearFavoritesUI();
    clearFavoriteCheckboxes();
    getData(false);
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

            if (!isValid) {
                return;
            } else {
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
                getData(true);
            };


        } else {
            const isValid = validateAuthForm(
                nameInput,
                emailInput,
                passwordInput,
                false
            );

            if (!isValid) {
                return;
            } else {
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
                getData(true);
            };

        }

    } catch (error) {
        console.error(error)
    }

})

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (token) {
        const user = await getMe();
        if (user) {
            setFavoriteIds(user.favorites);
            updateNavUI(user);
            await getData(true);
        } else {
            getData(false)
        }
    } else {
        getData(false)
    };
});



