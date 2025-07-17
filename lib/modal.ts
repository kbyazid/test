// lib/modal.ts

export const useModal = () => {
    const openModal = (modalId: string) => {
      const modal = document.getElementById(modalId) as HTMLDialogElement | null;
      modal?.showModal();
    };
  
    const closeModal = (modalId: string) => {
      const modal = document.getElementById(modalId) as HTMLDialogElement | null;
      modal?.close();
    };
  
    return { openModal, closeModal };
  };