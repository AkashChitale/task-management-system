// @ts-ignore
import { reminderQueue } from "../queues/reminder.queue.ts";
// @ts-ignore
import { sendEmail } from "../services/email.service.ts";

console.log("Reminder worker started...");

reminderQueue.process("todo-reminder", async (job) => {
  const { title, email } = job.data;
  await sendEmail(
    email,
    "Todo Reminder",
    `Reminder: ${title}`
  );
});
