import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { ApplicationModal, setOpenModal } from './actions'

// export function useModalOpen(modal: ApplicationModal): boolean {
//   const openModal = useSelector((state: AppState) => state.modals.openModal)
//   return openModal === modal
// }
//
// export function useToggleModal(modal: ApplicationModal): () => void {
//   const open = useModalOpen(modal)
//   const dispatch = useDispatch<AppDispatch>()
//   return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
// }
//
// export function useOpenModal(modal: ApplicationModal): () => void {
//   const dispatch = useDispatch<AppDispatch>()
//   return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
// }
//
// export function useCloseModals(): () => void {
//   const dispatch = useDispatch<AppDispatch>()
//   return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
// }


const useModals = () => {
  const dispatch = useDispatch<AppDispatch>()
  const selector = useSelector((state: AppState) => state.modals);

  const methods = useMemo(
    () => ({
      isModalOpen: (modal: ApplicationModal): boolean => {
        const openModal = selector.openModal;
        return openModal === modal
      },
      toggleModal: (modal: ApplicationModal): void => {
        const open = methods.isModalOpen(modal)
        dispatch(setOpenModal(open ? null : modal))
      },
      openModal: (modal: ApplicationModal): void => {
        dispatch(setOpenModal(modal));
      },
      closeModals: (): void => {
        dispatch(setOpenModal(null))
      }
    }),
    [dispatch, selector]
  );

  return useMemo(
    () => ({
      ...methods
    }),
    [methods]
  );
};

export default useModals;
