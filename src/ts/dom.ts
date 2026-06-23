// Containers
export const CardsContainer = document.querySelector("#cards-container") as HTMLElement;
export const FavoriteContainer = document.querySelector("#favorite-container") as HTMLElement;
export const AuthContainer = document.querySelector("#auth-container") as HTMLElement;
export const AddProductContainer = document.getElementById("add-product-container") as HTMLElement;
export const MyProductsContainer = document.querySelector("#my-products-container") as HTMLElement;
export const CategoriesContainer = document.querySelector("#categories-container") as HTMLElement;
export const CartContainer = document.querySelector("#cart-container") as HTMLElement;

// Related to modal
export const modal = document.querySelector('#modal') as HTMLDivElement;
export const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;
export const authTitle = document.querySelector('#auth-title') as HTMLHeadElement;
export const Aside = document.querySelector('#aside') as HTMLElement;

// Related to open buttons
export const openFavoriteBtn = document.querySelector('#open-favorite-btn') as HTMLButtonElement;
export const openCartBtn = document.querySelector('#open-cart-btn') as HTMLButtonElement;
export const openAuthContainerBtn = document.querySelector('#open-auth-container-btn') as HTMLButtonElement;
export const openAddProductBtn = document.querySelector('#open-add-product-btn') as HTMLButtonElement;
export const openMyProductsBtn = document.querySelector('#open-my-products-btn') as HTMLButtonElement;

// Related to close buttons
export const closeModalBtn = document.querySelectorAll('#close-modal-btn') as NodeListOf<HTMLButtonElement>;

// Related to profile
export const profileBtn = document.querySelector('#profile-btn') as HTMLDivElement;
export const profileName = document.querySelectorAll('#profile-name') as NodeListOf<HTMLSpanElement>;
export const profileLetter = document.querySelector('#profile-letter') as HTMLSpanElement;
export const profileEmail = document.querySelector('#profile-email') as HTMLSpanElement;
export const logOutBtn = document.querySelector('#logout-btn') as HTMLButtonElement;
export const myProductsBtn = document.querySelector('#my-products-btn') as HTMLButtonElement;

export const SearchInput = document.querySelector('#search-input') as HTMLInputElement;

// Related to forms
export const nameInput = document.querySelector('#nameInput') as HTMLInputElement;
export const emailInput = document.querySelector('#emailInput') as HTMLInputElement;
export const passwordInput = document.querySelector('#passwordInput') as HTMLInputElement;

// forms
export const Form = document.querySelector('#auth-form') as HTMLFormElement;
export const addProductForm = document.getElementById('add-product-form') as HTMLFormElement;

// Related to add product form
export const imageInput = document.querySelector('#imageInput') as HTMLInputElement;
export const previewImage = document.querySelector('#preview-image') as HTMLImageElement;
export const previewImageContainer = document.querySelector('#preview-image-container') as HTMLDivElement;
export const titleInput = document.querySelector('#TitleInput') as HTMLInputElement;
export const categoryInput = document.querySelector('#categoryInput') as HTMLInputElement;
export const priceInput = document.querySelector('#priceInput') as HTMLInputElement;
export const descriptionTextArea = document.querySelector('#descriptionTextArea') as HTMLTextAreaElement;
export const uploadLabel = document.querySelector('label[for="imageInput"]') as HTMLLabelElement;

// Related to auth
export const authModeInputs = document.querySelectorAll('input[name="auth-mode"]') as NodeListOf<HTMLInputElement>;
export const authModeSwitch = document.querySelector('#auth-mode-switch') as HTMLDivElement;
export const formNameContainer = document.querySelector('#form-name-container') as HTMLDivElement;
export const authBtn = document.querySelector('#auth-btn') as HTMLButtonElement;
export const authHintText = document.querySelector('#auth-hint-text') as HTMLSpanElement;
export const authLink = document.querySelector('#auth-link') as HTMLAnchorElement;

// Others
export const checkoutBar = document.querySelector('#checkout-bar') as HTMLDivElement;

export const loader = document.querySelector('#loader') as HTMLDivElement;

