const { CronJob } = require('cron')
const {subDays,startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("./sendEmail")
const allConnection = require("../Model/ConnectionSchema")
const job = new CronJob("0 8 * * *", async () => {
  try {
    console.log("Cron Running");

    const yesterday = subDays(new Date(), 1);
    const startTime = startOfDay(yesterday);
    const endTime = endOfDay(yesterday);

    const allRequest = await allConnection
      .find({
        status: "interested",
        createdAt: {
          $gt: startTime,
          $lt: endTime,
        },
      })
      .populate("toUserID");

    

    const allEmail = [
      ...new Set(
        allRequest
          .filter((elm) => elm.toUserID)
          .map((elm) => elm.toUserID.emailId)
      ),
    ];
    for(let email of allEmail){
        try{
            const res = await sendEmail.run(`You have pending connection requests for ${email} waiting for your response.`,`Hope You Doing Well`)
            console.log(res)
        }
        catch(err){
            console.log(err)
        }
    }
    
  } catch (err) {
    console.error(err);
  }
});
job.start()