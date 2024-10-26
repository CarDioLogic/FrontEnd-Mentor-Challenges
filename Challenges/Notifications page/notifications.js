export class Notifications {
  constructor() {}

  CreateReactedToNotificationElement(notificationData, notificationsElement) {
    /* div */
    let notification = document.createElement("div");
    notification.classList.add("notification");
    notification.id = notificationData.id;

    /* div */
    let userImageContainer = document.createElement("div");
    userImageContainer.classList.add("imgProfileUser");
    let userImage = document.createElement("img");
    userImage.src = notificationData.image;
    userImageContainer.appendChild(userImage);
    /* /div */

    /* div */
    let notificationContent = document.createElement("div");
    notificationContent.classList.add("notificationContentSection");

    let target = "";
    if (notificationData.type === "reacted") {
      target = `<a class="post" href='${notificationData.userProfileLink}'>${notificationData.target}</a>`;
    } else if (notificationData.type === "joined") {
      target = `<a class="group" href='${notificationData.userProfileLink}'>${notificationData.target}</a>`;
    }

    let text = document.createElement("p");
    text.classList.add("notificationContent");
    text.innerHTML =
      `<a class="user" href='${notificationData.userProfileLink}'>${notificationData.userName}</a>` +
      " " +
      notificationData.notificationText +
      " " +
      target;

    if (notificationData.isRead == false) {
      notification.classList.add("unreadNotification");
      text.classList.add("unreadNotificationContent");
    }
    notification.addEventListener("click", () => {
    
    if(notificationData.isRead == false){
      const nbrNotifications = document.getElementById('nbrNotifications');
      nbrNotifications.textContent = parseInt(nbrNotifications.textContent) - 1;
    }

    notificationData.isRead = true;
      //call to function to update read status of notification on db
      notification.classList.remove("unreadNotification");
      text.classList.remove("unreadNotificationContent");
    });

    let textTimePassed = document.createElement("p");
    textTimePassed.textContent = this.CalculateTimePassed(
      notificationData.date
    );

    notificationContent.appendChild(text);
    notificationContent.appendChild(textTimePassed);

    notification.appendChild(userImageContainer);
    notification.appendChild(notificationContent);

    let targetImageContainer = "";
    if (notificationData.type === "commented") {
      targetImageContainer = document.createElement("div");
      targetImageContainer.classList.add("imgPost");
      let targetImage = document.createElement("img");
      targetImage.src = notificationData.targetImg;
      targetImageContainer.appendChild(targetImage);
      notification.appendChild(targetImageContainer);
    }

    let commentContainer = "";
    if (notificationData.type === "messaged") {
      commentContainer = document.createElement("div");
      commentContainer.classList.add("notificationComment");
      let comment = document.createElement("p");
      comment.textContent = notificationData.commentTxt;
      commentContainer.appendChild(comment);
      notificationContent.appendChild(commentContainer);
    }

    notificationsElement.appendChild(notification);
  }

  CalculateTimePassed(date) {
    /*     if (!isValidDate(date)) {
        return "Invalid date";
      } */

    let now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    console.log(`Current date: ${now}`);
    console.log(`Current date: ${date}`);

    const intervals = [
      { value: 31536000, description: "year" },
      { value: 2592000, description: "month" },
      { value: 86400, description: "day" },
      { value: 3600, description: "hour" },
      { value: 60, description: "minute" },
    ];

    let duration = 0;
    let interval = 0;
    let count = 0;
    for (let i = 0; i < intervals.length; i++) {
      interval = intervals[i];
      count = Math.floor(seconds / interval.value);
      if (count > 0) {
        duration = count;
        break;
      }
    }

    if (duration === 0) {
      return "just now";
    }

    const pluralize = duration > 1 ? "s" : "";
    console.log(`${duration} ${interval.description}${pluralize} ago`);
    return `${duration} ${interval.description}${pluralize} ago`;
  }
}
