const welcomeTemplate = (data) => {
  const { name, username, password } = data;
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style type="text/css">
        body {
          background-color: aliceblue;
        }
      </style>
  </head>
  <body>
      <h1>Hi ${name}!</h1>
      <p>Welcome to our platform that will facilitate the administration of laboratory tests</p>
      <p>username: ${username}</p>
      <p>password: ${password}</p>
  </body>
  </html>
`;
};

module.exports = welcomeTemplate;
