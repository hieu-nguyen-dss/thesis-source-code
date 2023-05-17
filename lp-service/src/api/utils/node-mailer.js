const nodemailer = require('nodemailer')
const os = require('os')
const { nodemailer: config, client, port } = require('../../config/vars')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.user,
    pass: config.pass
    // clientId: config.clientId,
    // clientSecret: config.clientSecret,
    // refreshToken: config.refreshToken
  },
  from: config.user
})

const sendInviteMail = async (to, ogzName, ogzId, acceptToken) => {
  try {
    const response = await transporter.sendMail({
      from: 'Learning Path System',
      to,
      subject: 'Invite collaborate',
      html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation</title>
  <style>
    body {
      font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
  </style>
</head>

<body>
  <h3>You receive an invitation from Organization ${ogzName}</h3>
  <h4>You can visit their website here: <a href="${client}/organizations/information/${ogzId}">${ogzName}</a></h4>

  <a href="http://${os.hostname()}:${port}/organizations/members/accept?token=${acceptToken}" target="_blank" style="border: 2px solid lightgreen; border-radius: 5px; padding: 5px; text-decoration: none;">Accept</a>
  <a href="#" target="_blank" style="border: 2px solid orange; border-radius: 5px; padding: 5px; text-decoration: none;" >Deny</a>
</body>

</html>
      `
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendInviteMail
