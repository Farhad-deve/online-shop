const authErrorMessage = document.querySelector('#auth-error') as HTMLSpanElement;

export function showInputError(input: HTMLInputElement, message: string) {
    input.classList.add('bg-light-red', 'placeholder-text-red', 'error-focus');

    const errorElement = input.parentElement?.querySelector('.error-message')

    if (errorElement) {
        errorElement.textContent = message;
    }
};

export function clearInputError(input: HTMLInputElement) {
    input.classList.remove('bg-light-red', 'placeholder-text-red', 'error-focus');

    const errorElement = input.parentElement?.querySelector('.error-message')

    if (errorElement) {
        errorElement.textContent = '';
    }
};

export function showFormError(message: string) {
    authErrorMessage.textContent = message;
    authErrorMessage.classList.remove('hidden');
};

export function clearFormError() {
    authErrorMessage.textContent = '';
    authErrorMessage.classList.add('hidden');
};

export function validateAuthForm(
    nameInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    isRegister: boolean
): boolean {

    let isValid = true;

    clearInputError(emailInput);
    clearInputError(passwordInput);
    clearInputError(nameInput);

    if (isRegister && !nameInput.value.trim()) {
        showInputError(nameInput, "Name is required");
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.trim()) {
        showInputError(emailInput, "Email is required");
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showInputError(emailInput, "Invalid email format");
        isValid = false;
    }

    if (!passwordInput.value.trim()) {
        showInputError(passwordInput, "Password is required");
        isValid = false;
    } else if (passwordInput.value.length < 6) {
        showInputError(passwordInput, "Password must be at least 6 characters");
        isValid = false;
    }

    return isValid

};

export function validateAddProductForm(
    titleInput : HTMLInputElement,
    categoryInput : HTMLInputElement,
    priceInput : HTMLInputElement,
    imageInput : HTMLInputElement
) : boolean {
    let isValid = true;

    if (!titleInput.value.trim()) {
        showInputError(titleInput, "Title is required");
        isValid = false;
    }

    if (!categoryInput.value.trim()) {
        showInputError(categoryInput, "Category is required");
        isValid = false;
    }

    const priceValue = parseFloat(priceInput.value);
    if (!priceInput.value.trim() || isNaN(priceValue) || priceValue <= 0) {
        showInputError(priceInput, "Price must be a positive number");
        isValid = false;
    }

    if (!imageInput.files || imageInput.files.length === 0) {
        const uploadLabel = document.querySelector('label[for="imageInput"]')
        if (uploadLabel) uploadLabel.classList.add('bg-light-red', 'border-1', 'border-red')
        isValid = false;
    }

    return isValid;
}
