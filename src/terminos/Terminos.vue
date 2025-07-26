<script setup>
import HeaderPage from "../components/HeaderPage.vue";
import Section from "../components/Section.vue";
</script>

<template>
  <HeaderPage route="/registro" title="Términos y condiciones" />
  <Section>
    <p>
      Esta aplicación móvil es propiedad y está operada por Doble 5 S.A
    </p>
    <p>
      Estos términos establecen las condiciones bajo las cuales puedes usar nuestra aplicación móvil y nuestros servicios. Doble 5 ofrece a los usuarios la posibilidad de localizar canchas, crear y gestionar partidos, sumarse a juegos, chatear y formar una red social deportiva. Al acceder o usar la aplicación, aceptas haber leído, entendido y estar sujeto a estos términos:
    </p>

    <div>
      <h3>INFORMACIÓN RELEVANTE</h3>
      <p>
        Para utilizar algunas funciones, es necesario registrarse con datos reales y crear una contraseña. El usuario es responsable de mantener la confidencialidad de su cuenta. Doble 5 no se responsabiliza por el uso indebido de la cuenta por terceros. Toda acción en la aplicación está sujeta a validaciones internas (verificación de identidad, correo electrónico, comportamiento de uso, etc.).
      </p>
    </div>

    <div>
      <h3>LICENCIA</h3>
      <p>
        Doble 5 concede al usuario una licencia limitada, no exclusiva e intransferible para utilizar los servicios de la app conforme a estos términos. Esta licencia no permite la reventa ni el uso indebido de la plataforma.
      </p>
    </div>

    <div>
      <h3>USO NO AUTORIZADO</h3>
      <!-- prettier-ignore -->
      <p>
        Queda prohibido:
        - Copiar, distribuir, modificar o vender los contenidos de la aplicación. 
        - Usar la aplicacióncon fines fraudulentos, maliciosos o para generar spam o acoso.
        generar spam o acoso. 
        - Compartir contenido ofensivo, ilegal o que infrinja derechos de terceros.
      </p>
    </div>

    <div>
      <h3>PROPIEDAD INTELECTUAL</h3>
      <p>
        Todos los elementos visuales, logotipo, nombre, diseño, funcionalidades, base de datos y software de la App son propiedad exclusiva de Doble 5 S.A. Está prohibido su uso sin autorización expresa.
      </p>
    </div>

    <div>
      <h3>POLÍTICA DE REEMBOLSO</h3>
      <p>
        La aplicación ofrece servicios intangibles en modalidad de suscripción gratuita. En caso de introducir futuras funciones de pago, los servicios contratados no serán reembolsables una vez activados, salvo error técnico o incumplimiento.
      </p>
      <p>
        El usuario podrá ejercer su derecho de desistimiento en un plazo de 14 días naturales desde la contratación del servicio, conforme a la legislación vigente.
      </p>
    </div>

    <div>
      <h3>SUSPENSIÓN O CANCELACIÓN DE CUENTA</h3>
      <p>
        Doble 5 podrá suspender temporal o definitivamente la cuenta de un usuario si detecta incumplimiento de estos términos o cualquier ley aplicable. El usuario puede solicitar la baja de su cuenta en cualquier momento.
      </p>
    </div>

    <div>
      <h3>LIMITACIÓN DE RESPONSABILIDAD</h3>
      <!-- prettier-ignore -->
      <p>
        Doble 5 no se responsabiliza por: 
        - Daños, lesiones o pérdidas derivados de encuentros deportivos organizados a través de la aplicación. 
        - Uso indebido o negligente por parte de otros usuarios.
        - Errores técnicos o interrupciones en el servicio.
        El usuario acepta que el uso de la aplicación es bajo su propia responsabilidad.
      </p>
    </div>

    <div>
      <h3>DERECHO A MODIFICAR LOS TÉRMINOS</h3>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Se notificará cualquier cambio sustancial con al menos 30 días de anticipación a través de la aplicación y/o correo electrónico. El uso continuado implicará la aceptación de los nuevos términos.
      </p>
    </div>

    <div>
      <h3>LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h3>
      <p>
        Estos Términos se rigen por las leyes de la República Argentina. Toda disputa será resuelta por los tribunales competentes de la Ciudad Autónoma de Buenos Aires, salvo que una normativa imperativa indique lo contrario.
      </p>
    </div>

    <div>
      <h3>PRIVACIDAD</h3>
      <p>
        Doble 5 protege los datos personales conforme a la Ley de Protección de Datos Personales. La información recopilada se utilizará únicamente con fines operativos del servicio y no se compartirá con terceros sin consentimiento, salvo requerimiento legal.
      </p>
      <!-- <p>Más información disponible en nuestra Política de Privacidad.</p> -->
    </div>
  </Section>
</template>

<style scoped>
h3 {
  color: var(--primary-color);
}
</style>
