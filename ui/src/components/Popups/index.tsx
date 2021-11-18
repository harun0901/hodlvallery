import { Confirmation } from "../../modals"
import useModals from '../../state/modals/hooks'
import { ApplicationModal } from "../../state/modals/actions";

const Popups: React.FC = () => {
  const { isModalOpen } = useModals();

  return (
    <>
      <Confirmation isOpen={isModalOpen(ApplicationModal.CONFIRMATION)} />
    </>
  )
}

export default Popups
