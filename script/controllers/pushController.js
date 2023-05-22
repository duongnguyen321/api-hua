const { exec } = require("child_process");
const { logSuccess, logError } = require("../views/consoleView");

const pushGit = (text) => {
  console.log("Pushing code to Git...");

  return new Promise((resolve, reject) => {
    const pushChild = exec(
      `git add . && git commit -m "${text}" && git push heroku master`
    );

    pushChild.stdout.on("data", (data) => {
      console.log(data);
    });

    pushChild.stderr.on("data", (data) => {
      console.error(data);
    });

    pushChild.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    pushChild.on("close", (code) => {
      if (code === 0) {
        logSuccess("Git push completed");
        resolve();
      } else {
        logError(`Git push failed with code ${code}`);
        reject(`Git push failed with code ${code}`);
      }
    });
  });
};

const deployHeroku = () => {
  console.log("Deploying to Heroku...");

  return new Promise((resolve, reject) => {
    const herokuChild = exec("git push heroku main");

    herokuChild.stdout.on("data", (data) => {
      console.log(data);
    });

    herokuChild.stderr.on("data", (data) => {
      console.error(data);
    });

    herokuChild.on("error", (error) => {
      console.error(error);
      reject(error);
    });

    herokuChild.on("close", (code) => {
      if (code === 0) {
        logSuccess("Heroku deployment completed");
        resolve();
      } else {
        logError(`Heroku deployment failed with code ${code}`);
        reject(`Heroku deployment failed with code ${code}`);
      }
    });
  });
};

const pushAndDeploy = (text) => {
  return pushGit(text).then(() => deployHeroku());
};

module.exports = {
  pushAndDeploy,
};
