import record_routes from "../../routes/record";
import RecordService from "../record";

var cronJob = require("cron").CronJob;
var myJob = new cronJob("0 0 * * *", function () {
    RecordService.clean_inactive_records();
    console.log("cron ran");
});
myJob.start();
