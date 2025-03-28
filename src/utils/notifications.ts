//Variable pour l'interval des notifications
let notificationInterval :number | null = null;

//Fonction pour l'autorisation des notifications
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("❌ Les notifications ne sont pas supportées.");
    return;
  }

  if (Notification.permission === "granted") {
    console.log("✅ Notifications déjà autorisées !");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("✅ Notifications activées !");
  } else {
    console.warn("⚠️ Autorisation refusée.");
  }
}

//Fonction pour l'exécution des notifs
export function scheduleDailyNotification() {
  if (Notification.permission !== "granted") {
    console.warn("⚠️ Notifications non autorisées.");
    return;
  }

  // Empêcher plusieurs exécutions en même temps
  if (notificationInterval) {
    console.warn("⚠️ Les notifications sont déjà planifiées.");
    return;
  }

  // Définir l'heure de la notification (ex: 9h du matin)
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(9, 0, 0, 0); // 09:00:00

  // Si l'heure cible est déjà passée, planifier pour demain
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const delay = targetTime.getTime() - now.getTime(); // Temps avant la notif en ms

  setTimeout(() => {
    sendNotification();

    // Ensuite, planifier une notification tous les jours à 9h
    notificationInterval = setInterval(() => {
      sendNotification();
    }, 24 * 60 * 60 * 1000); // 24h en millisecondes
  }, delay);

  console.log("✅ Notification quotidienne programmée !");
}

// Fonction d'envoi de notification
function sendNotification() {
  new Notification("📖 Temps de révision !", {
    body: "Prenez quelques minutes pour revoir vos cartes !",
    icon: "/icons/notification-icon.png",
  });
}
//fonction pour stopper les notifications si les notifications sont activé ainsi que l'interval avant la prochaine
export function stopNotifications() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
    console.log(" Notifications arrêtées !");
  } else {
    console.warn("Aucune notification en cours.");
  }
}
