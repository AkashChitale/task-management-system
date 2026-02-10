import { reminderQueue } from "../queues/reminder.queue.ts";
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
