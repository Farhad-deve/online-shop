import {
    AddProductContainer, addProductForm, Aside, AuthContainer, CartContainer,
    checkoutBar, FavoriteContainer, loader, modal, modalTitle, MyProductsContainer,
    openAuthContainerBtn, previewImage, previewImageContainer, profileBtn,
    profileEmail, profileLetter, profileName
} from "./dom";
import type { User } from "./types";



export function loading(state: boolean) {
    if (state) {
        loader.classList.replace('opacity-0', 'opacity-100');
    } else {
        loader.classList.replace('opacity-100', 'opacity-0');
    }
};

export function showModal(type: string) {
    if (type === "favorites") {
        FavoriteContainer.classList.remove('hidden');
        MyProductsContainer.classList.add('hidden');
        CartContainer.classList.add('hidden');
        AuthContainer.classList.add('hidden');
        checkoutBar.classList.add('hidden')
        AddProductContainer.classList.add('hidden');
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.classList.replace('pointer-events-none', 'pointer-events-auto');
        Aside.classList.replace('translate-x-full', 'translate-x-0');
        modalTitle.textContent = "Favorites";
    } else if (type === "cart") {
        CartContainer.classList.remove('hidden');
        MyProductsContainer.classList.add('hidden');
        FavoriteContainer.classList.add('hidden');
        AddProductContainer.classList.add('hidden');
        AuthContainer.classList.add('hidden');
        checkoutBar.classList.remove('hidden')
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.classList.replace('pointer-events-none', 'pointer-events-auto');
        Aside.classList.replace('translate-x-full', 'translate-x-0');
        modalTitle.textContent = "Cart";
    } else if (type === "auth-mode") {
        AuthContainer.classList.remove('hidden');
        MyProductsContainer.classList.add('hidden');
        FavoriteContainer.classList.add('hidden');
        CartContainer.classList.add('hidden');
        AddProductContainer.classList.add('hidden');
        Aside.classList.replace('translate-x-0', 'translate-x-full');
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    } else if (type === "add-product") {
        AddProductContainer.classList.remove('hidden');
        MyProductsContainer.classList.add('hidden');
        FavoriteContainer.classList.add('hidden');
        CartContainer.classList.add('hidden');
        AuthContainer.classList.add('hidden');
        Aside.classList.replace('translate-x-0', 'translate-x-full');
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.classList.replace('pointer-events-none', 'pointer-events-auto');
    } else if (type === "my-products") {
        MyProductsContainer.classList.remove('hidden');
        FavoriteContainer.classList.add('hidden');
        CartContainer.classList.add('hidden');
        AuthContainer.classList.add('hidden');
        checkoutBar.classList.add('hidden')
        AddProductContainer.classList.add('hidden');
        Aside.classList.replace('translate-x-full', 'translate-x-0');
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.classList.replace('pointer-events-none', 'pointer-events-auto');
        modalTitle.textContent = "My Products";
    }
};

export function closeModal() {
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.classList.replace('pointer-events-auto', 'pointer-events-none');
    Aside.classList.replace('translate-x-0', 'translate-x-full');
    addProductForm.reset();
    previewImageContainer.classList.add('hidden');
    previewImage.src = '';
};

export function updateNavUI(user: User | null) {
    if (!user) {
        openAuthContainerBtn.classList.remove('hidden');
        profileBtn.classList.add('hidden');
        return;
    }

    const currentUser = user;

    openAuthContainerBtn.classList.add('hidden');

    profileName.forEach((name) => { name.textContent = currentUser.name });
    profileEmail.textContent = currentUser.email;
    profileLetter.textContent = currentUser.name.charAt(0).toUpperCase();

    profileBtn.classList.remove('hidden');
};