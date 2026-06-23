import { type Card } from "./types";
import { deleteMyProduct } from "./requests";
import { categoryInput, descriptionTextArea, previewImage, priceInput, showModal, titleInput } from "./functions";
import { setEditingProduct } from "./productState";

export let myProducts: Card[] = [];
export const MyProductsContainer = document.querySelector("#my-products-container") as HTMLElement;

export function createMyProduct(data: Card) {
    const product = document.createElement("div");
    product.classList.add('border-1', 'border-light-gray', 'rounded-8px', 'px-0-5rem', 'py-0-5rem', 'flex', 'gap-0-5rem');
    product.innerHTML = `
        <div>
            <img src="${data.imageUrl}" alt="${data.title}" loading="lazy" class="rounded-8px pointer-events-none border-1 border-light-gray btn-42">
        </div>

        <div class="flex flex-col gap-0-5rem">
            <div class="flex flex-col items-start gap-0-3rem">
                <h4 class="leading-tight text-0-8rem">${data.title}</h4>
                <p class="text-gray text-0-7rem flex items-center gap-0-3rem">
                <span class="capitalize">${data.category}</span> •
                <span>$${data.price.toFixed(2)}</span>
                </p>
                <span class="${data.status === "pending" ? "bg-light-yellow text-brown" : "bg-light-green text-green"} font-700 text-0-7rem uppercase rounded-8px px-0-5rem">${data.status}</span>
            </div>

            <div class="flex gap-0-5rem">
              <button type="button" data-id="${data.id}" data-action="edit" class="border-1 border-blue bg-transparent text-blue text-0-7rem rounded-8px px-0-5rem py-0-5rem font-500 transition-all-03s-ease hover-bg-blue-text-white">
                <i class="fa-solid fa-pen pointer-events-none"></i>
                Edit
              </button>

              <button type="button" data-id="${data.id}" data-action="remove" class="border-1 border-light-gray bg-transparent text-gray text-0-7rem rounded-8px px-0-5rem py-0-5rem font-500">
                <i class="fa-solid fa-trash pointer-events-none"></i>
                Delete
              </button>
            </div>
        </div>
    `;

    MyProductsContainer.appendChild(product);
};

export function renderMyProducts(data: Card[]) {
  myProducts = data;
  MyProductsContainer.innerHTML = "";

  data.forEach((product) => {
    createMyProduct(product);
  });
};

MyProductsContainer.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const action = target.dataset.action;
    if (!action) return;

    const productId = target.dataset.id;
    if (!productId) return;

    if (action === "remove") {
        const originalProducts = [...myProducts];

        const updatedList = myProducts.filter(product => product.id !== productId);
        renderMyProducts(updatedList);

        try {
            await deleteMyProduct(productId);
        } catch (error) {
            console.error("Failed to delete product:", error);
            renderMyProducts(originalProducts);
        }
    }

    if (action === "edit") {
        const targetProduct = myProducts.find(item => item.id === productId);
        if (!targetProduct) return;

        titleInput.value = targetProduct.title;
        categoryInput.value = targetProduct.category;
        priceInput.value = String(targetProduct.price);
        descriptionTextArea.value = targetProduct.description || "";
        previewImage.src = targetProduct.imageUrl;

        setEditingProduct(productId, "edit");

        const modalTitle = document.querySelector('#modal-title') as HTMLHeadElement;
        modalTitle.textContent = "Edit Product";
        showModal("add-product");
        
    }
})