import {
    modal,
    openFavoriteBtn, closeModalBtn, openCartBtn, Aside, openAuthContainerBtn, openAddProductBtn, AuthContainer, logOutBtn,
    authModeSwitch, Form, addProductForm, authBtn, authHintText, authLink, authTitle, formNameContainer, AddProductContainer,
    SearchInput, nameInput, emailInput, passwordInput,
    openMyProductsBtn, imageInput, previewImage, previewImageContainer, titleInput, categoryInput, priceInput, uploadLabel

} from "./ts/dom";
import { registerUser, loginUser, getData, addProduct, updateMyProduct } from "./ts/requests";

import { clearFavoriteCheckboxes, clearFavoritesUI } from "./ts/favoriteFunctions";
import { applyFilters } from "./ts/renderers";
import { showModal, closeModal, updateNavUI } from "./ts/ui";
import { clearFormError, clearInputError, validateAddProductForm, validateAuthForm } from "./ts/validation";
import { filters, setFavoriteIds, } from "./ts/state";
import * as ProductState from "./ts/state";

let authMode: "login" | "register" = "login"


openFavoriteBtn.addEventListener('click', () => showModal("favorites"));
openCartBtn.addEventListener('click', () => showModal("cart"));
openAuthContainerBtn.addEventListener('click', () => showModal("auth-mode"));
openMyProductsBtn.addEventListener('click', () => showModal("my-products"));

AuthContainer.addEventListener('click', (e) => e.stopPropagation());
Aside.addEventListener('click', (e) => e.stopPropagation());
AddProductContainer.addEventListener('click', (e) => e.stopPropagation());

modal.addEventListener('click', () => closeModal());
closeModalBtn.forEach(btn => btn.addEventListener('click', () => closeModal()));


let searchTimer: number | undefined;
SearchInput.addEventListener('input', () => {
    filters.search = SearchInput.value.trim();

    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
        applyFilters();
    }, 400);
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

[titleInput, categoryInput, priceInput].forEach((input) => {
    input.addEventListener('input', () => {
        input.classList.remove('bg-light-red', 'placeholder-text-red', 'error-focus');
        const errorMsg = input.parentElement?.querySelector('.error-message');

        if (errorMsg) {
            errorMsg.textContent = '';
        }
    })
});

imageInput.addEventListener('change', () => {
    if (imageInput.files && imageInput.files.length > 0) {
        uploadLabel.classList.remove('bg-light-red', 'border-1', 'border-red');
    }
})


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

                

                closeModal();
                Form.reset();
                clearFormError();

                clearInputError(nameInput);
                clearInputError(emailInput);
                clearInputError(passwordInput);
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

                closeModal();
                Form.reset();
                clearFormError();

                clearInputError(nameInput);
                clearInputError(emailInput);
                clearInputError(passwordInput);
            };

        }
        await getData(true);

    } catch (error) {
        console.error(error)
    }

});

addProductForm.addEventListener('submit', async (e : SubmitEvent) => {
    e.preventDefault();

    const mode = ProductState.productFormMode;
    const editingId = ProductState.currentEditingProductId;

    const isFormValid = validateAddProductForm(
        titleInput,
        categoryInput,
        priceInput,
        mode === "create" ? imageInput : null
    );

    if (!isFormValid) return;

    const rawFormData = new FormData(addProductForm);
    const priceValue = rawFormData.get('price') as string;
    const cleanPrice = parseFloat(priceValue) || 0;
    rawFormData.set('price', String(cleanPrice));

    if (mode === "edit" && imageInput.files?.length === 0) {
        rawFormData.delete('image');
    }

    try {
       if (mode === "create") {
            // Run normal create process
            await addProduct(rawFormData);
        } else if (mode === "edit" && editingId) {
            // Run our new update API call instead!
            await updateMyProduct(editingId, rawFormData);
        }

        addProductForm.reset();
        previewImage.src = '';

        ProductState.setEditingProduct(null, "create");

        closeModal();
        await getData(true);
        
    } catch (error) {
        console.error("Could not add product: ", error);
    }
})

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (token) {
        getData(true);
    } else {
        getData(false)
    };
});

openAddProductBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        showModal("auth-mode");
        return
    } 

    ProductState.setEditingProduct(null, "create");
    
    if (addProductForm) {
        addProductForm.reset();
        if (previewImage) previewImage.src = "";
    }
    
    const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;
    if (modalTitle) modalTitle.textContent = "Add Product";

    showModal("add-product");
})

previewImageContainer.classList.add('hidden');
imageInput.addEventListener('change', () => {
    const file = imageInput.files?.[0];

    if (file) {
        const objectUrl = URL.createObjectURL(file);

        previewImage.src = objectUrl;
        previewImageContainer.classList.remove('hidden');

        previewImage.onload = () => {
            URL.revokeObjectURL(objectUrl);
        }
    }
});



