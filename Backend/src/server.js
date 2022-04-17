///const { PORT = 5000 } = process.env;

const path = require("path");
const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));
const port = process.env.PORT || 5000
const listener = () => console.log(`Listening on Port ${port}!`);
app.listen(port, listener);
