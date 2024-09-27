const generateDate = () => {
  const data = new Date();
  return `${data.getFullYear()}-${
    data.getMonth() + 1
  }-${data.getDate()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
};

const resetPasswordEmailTemplate = (_url: string) => {
  const html = ` 
        <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .container {
                  background-color: #f0f8ff;
                  border: 1px solid #4682b4;
                  border-radius: 5px;
                  padding: 20px;
              }
              h1 {
                  color: #0000cd;
              }
              .btn {
                  display: inline-block;
                  background-color: #0000cd;
                  color: black;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .expiration {
                  font-size: 0.9em;
                  color: #666;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Recuperación de Contraseña</h1>
              <p>Estimado usuario,</p>
              <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en nuestro sistema de comentarios. Si usted no ha realizado esta solicitud, por favor ignore este correo.</p>
              <p>Para restablecer su contraseña, por favor haga clic en el siguiente botón:</p>
              <a href="#" class="btn">Restablecer Contraseña</a>
              <p class="expiration">Este enlace expirará en 5 minutos.</p>
              <p>Fecha de solicitud: <span id="currentDate">
              ${generateDate()}
              </span></p>
              <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
              <p>Atentamente,<br>El equipo de Soporte</p>
          </div>
      </body>
      </html>      
      `;
  return html;
};

const verifyEmailTemplate = (_url: string) => {
  const html = `
            <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validación de Cuenta</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #e6f2ff;
                    border: 1px solid #4682b4;
                    border-radius: 5px;
                    padding: 20px;
                }
                h1 {
                    color: #0052cc;
                }
                .btn {
                    display: inline-block;
                    background-color: #0052cc;
                    color: black;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .expiration {
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 20px;
                }

                .ii a[href] {
                color: #fff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Bienvenido a Nuestro Sistema de Comentarios</h1>
                <p>Estimado usuario,</p>
                <p>Gracias por crear una cuenta en nuestro sistema de comentarios. Estamos emocionados de tenerte con nosotros. Para completar el proceso de registro y activar tu cuenta, por favor haz clic en el siguiente botón:</p>
                <a href="#" class="btn">Validar mi Cuenta</a>
                <p class="expiration">Este enlace de validación expirará en 48 horas.</p>
                <p>Fecha de registro: <span id="currentDate">${generateDate()}</span></p>
                <p>Si no has creado una cuenta en nuestro sistema, por favor ignora este correo.</p>
                <p>Una vez que hayas validado tu cuenta, podrás comenzar a participar en las discusiones y dejar tus comentarios.</p>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
                <p>¡Esperamos verte pronto en nuestras conversaciones!</p>
                <p>Saludos cordiales,<br>El equipo de Soporte</p>
            </div>
        </body>
        </html>
    `;

  return html;
};

export { resetPasswordEmailTemplate, verifyEmailTemplate };
