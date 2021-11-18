import { toast } from 'react-toastify';
import { Toast } from "../components"

const defaultTimeout = 3000
const currentToastList = []

export const showToast = (text = '', options: any = {}) => {
  let isShow = true
  if (currentToastList.some(x => x.text === text)) {
    isShow = false
  }

  if (isShow) {
    const id = Math.random().toString(36).substr(2, 9)
    currentToastList.push({
      text,
      id
    })

    setTimeout(() => {
      const index = currentToastList.findIndex(x => x.id === id)
      if (index > -1) {
        currentToastList.splice(index, 1)
      }
    }, defaultTimeout)

    toast.info(<Toast text={text} />, {
    position: "top-center",
      autoClose: options?.timeout || defaultTimeout,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
  });
}
};
