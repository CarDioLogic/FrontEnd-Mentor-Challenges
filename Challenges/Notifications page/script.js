import { Notifications } from "./notifications.js";
import { SeedData } from "./data/seedData.js";

const notificationsService = new Notifications();
const seedData = new SeedData();

let date = new Date(2024, 1, 3, 14, 0);
notificationsService.CalculateTimePassed(date);

ShowNotifications(seedData.notificationsList);

let markAllReadBtn = document.getElementById("markAllReadBtn");
markAllReadBtn.addEventListener("click", () => {
  MarkAllRead(seedData.notificationsList);
});

function ShowNotifications(notificationsData) {
  const notificationsElement = document.getElementById("notifications");
  notificationsElement.innerHTML = "";
  const numberUnreadNotificationsElement =
    document.getElementById("nbrNotifications");
  let numberUnreadNotifications = 0;

  notificationsData.forEach((notification) => {
    notificationsService.CreateReactedToNotificationElement(
      notification,
      notificationsElement
    );

    if (notification.isRead == false) {
      numberUnreadNotifications++;
    }
  });
  console.log(`Unread notifcations: ${numberUnreadNotifications}`);
  numberUnreadNotificationsElement.innerHTML = numberUnreadNotifications;
}

function MarkAllRead(notificationsData) {
  notificationsData.forEach((notification) => {
    notification.isRead = true;
  });

  ShowNotifications(notificationsData);
}
