export let productFormMode: "create" | "edit" = "create";
export let currentEditingProductId: string | null = null;

export function setEditingProduct(id: string | null, mode: "create" | "edit") {
    productFormMode = mode;
    currentEditingProductId = id;
}