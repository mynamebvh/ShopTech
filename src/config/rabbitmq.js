const amqp = require("amqplib");
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://user:123456@18.136.107.139:5672");
    console.info("connect to RabbitMQ success");

    connection.on("error", function (err) {
      console.log(err);
      setTimeout(connectRabbitMQ, 10000);
    });

    connection.on("close", function () {
      console.error("connection to RabbitQM closed!");
      setTimeout(connectRabbitMQ, 10000);
    });

    return connection;
  } catch (err) {
    console.error(err);
    setTimeout(connectRabbitMQ, 10000);
  }
}


module.exports = connectRabbitMQ;