import { createApp } from 'vue'
import Notification2 from '../components/Notification2.vue'

type AlertType = 'warning' | 'error' | 'success'

let currentNotification: ReturnType<typeof createApp> | null = null

const notificationService = {
  show(type: AlertType, message: string) {
    // Si ya hay una notificación mostrándose, no hacer nada
    if (currentNotification !== null) {
      return
    }

    const notificationComponent = createApp(Notification2, {
      type,
      message
    })
    const notificationElement = document.createElement('div')
    document.body.appendChild(notificationElement)
    currentNotification = notificationComponent
    notificationComponent.mount(notificationElement)

    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
      if (currentNotification !== null) {
        currentNotification.unmount()
        document.body.removeChild(notificationElement)
        currentNotification = null
      }
    }, 5000)

    // Cerrar la notificación al hacer clic en cualquier parte de la pantalla
    const closeNotificationOnClick = () => {
      if (currentNotification !== null) {
        currentNotification.unmount()
        document.body.removeChild(notificationElement)
        currentNotification = null
        document.removeEventListener('click', closeNotificationOnClick)
      }
    }

    document.addEventListener('click', closeNotificationOnClick)
  }
}

export default notificationService
