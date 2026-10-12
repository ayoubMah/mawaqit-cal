"use strict";

const translations = {
  fr: {
    unknownMosque: "Cette mosquée n’est pas disponible. Choisissez une mosquée dans la liste ci-dessous.", workOutlook: "Outlook : compte professionnel ou scolaire ↗",
    skip: "Aller au contenu", language: "Langue", eyebrow: "VOTRE MOSQUÉE, VOTRE AGENDA",
    hero: ["Vos prières.", "Dans votre quotidien."], intro: "Les horaires de votre mosquée, iqama comprise, dans l’agenda que vous utilisez déjà.",
    promise: "Gratuit. Sans compte supplémentaire. Un abonnement qui suit les mises à jour.",
    step1: "Votre mosquée", step2: "Votre agenda", step3: "Votre téléphone", journey: "Étapes",
    loading: "Chargement des mosquées…", loadError: "Impossible de charger les calendriers. Réessayez plus tard.", emptyCatalog: "Aucun calendrier n’est disponible pour le moment.",
    stepOne: "ÉTAPE 01", find: "Trouvez votre mosquée", searchLabel: "Nom de la mosquée", searchPlaceholder: "Créteil, Sahaba…",
    catalogNote: "Seules les mosquées avec un calendrier disponible sont affichées.", noResults: "Aucune mosquée disponible pour cette recherche.",
    preview: "APERÇU DES HORAIRES", today: "Aujourd’hui", noTimes: "Ce calendrier ne couvre pas aujourd’hui. Consultez la mosquée pour les horaires actuels.",
    stale: "La dernière vérification remonte à plus de 48 h. Confirmez les horaires auprès de la mosquée.",
    source: "Voir la mosquée sur Mawaqit ↗", updated: "Horaires vérifiés : ", timezone: "Fuseau horaire : ", adhan: "Adhan", jumua: "Jumu’a",
    stepTwo: "ÉTAPE 02", choose: "Choisissez votre agenda", providerLabel: "Application calendrier", subscribeIntro: "Abonnez-vous au lien du calendrier pour recevoir ses mises à jour.",
    feedLabel: "Lien d’abonnement", copy: "Copier le lien", copied: "Lien copié.", copyFallback: "Sélectionnez le lien ci-dessus et copiez-le manuellement.",
    importNote: "Un abonnement se met à jour. Un fichier téléchargé puis importé reste une copie fixe.",
    localWarning: "Aperçu local : pour vous abonner, utilisez le lien du site publié. Ce lien local ne sera pas accessible à votre agenda.",
    stepThree: "ÉTAPE 03 · NE L’OUBLIEZ PAS", phone: "Vérifiez sur votre téléphone", phoneIntro: "Être connecté au même compte ne suffit pas toujours : activez aussi ce calendrier sur votre téléphone.",
    confirm: "Je vois les prières sur mon téléphone.", confirmed: "Vous êtes prêt. Votre agenda suivra les mises à jour à son rythme.",
    limits: "Votre agenda décide quand actualiser l’abonnement. Les changements peuvent prendre du temps. Pour l’adhan et les notifications, gardez votre application de prière.",
    footer: "Les horaires de votre mosquée. Une place dans votre journée.", code: "Code source ↗", title: "Salat · Votre mosquée, votre agenda", help: "Aide officielle ↗", syncSelect: "Calendriers Google à synchroniser ↗",
    google: { heading: "Ajouter à Google Calendar", action: "Ouvrir Google Calendar ↗", setup: ["Copiez le lien d’abonnement ci-contre.", "Sur un ordinateur, ouvrez Google Calendar avec le compte utilisé sur votre téléphone. Vérifiez le compte sélectionné en haut à droite.", "À côté de « Autres agendas », cliquez sur + → À partir de l’URL.", "Collez le lien puis cliquez sur « Ajouter un agenda »."], phone: ["Avec l’app Google Calendar : ouvrez-la avec le même compte, touchez ☰ et cochez « Salat · {name} ».", "Sur Android, si les prières sont absentes : ☰ → Paramètres → Afficher plus → ce calendrier → Synchroniser, puis ☰ → Actualiser.", "Sur iPhone avec l’app Calendrier d’Apple : ouvrez le lien de synchronisation Google ci-dessous avec le même compte, cochez « Salat · {name} » et enregistrez. Dans Calendrier → Calendriers, cochez-le aussi.", "Revenez à aujourd’hui dans votre app de calendrier et vérifiez qu’une prière est visible."] },
    apple: { heading: "Ajouter à Apple Calendar", action: "S’abonner avec Apple Calendar ↗", setup: ["Sur votre iPhone, touchez le bouton d’abonnement ci-dessous et confirmez dans Calendrier.", "Si le bouton ne fonctionne pas : Calendrier → Calendriers → Ajouter un calendrier → Ajouter un calendrier avec abonnement.", "Collez le lien d’abonnement, puis confirmez l’ajout."], phone: ["Ouvrez Calendrier sur votre iPhone et touchez « Calendriers » en bas.", "Cochez le calendrier « Salat · {name} », puis touchez « OK ».", "Revenez à aujourd’hui et vérifiez qu’une prière est visible."] },
    outlook: { heading: "Ajouter à Outlook", action: "Ouvrir Outlook ↗", setup: ["Copiez le lien d’abonnement ci-contre.", "Ouvrez le calendrier Outlook dans votre navigateur.", "Choisissez Ajouter un calendrier → S’abonner à partir du web.", "Collez le lien, donnez un nom au calendrier puis confirmez l’ajout."], phone: ["Ouvrez Outlook sur votre téléphone avec le même compte.", "Ouvrez Calendrier puis la liste des calendriers.", "Activez le calendrier que vous venez d’ajouter.", "Revenez à aujourd’hui et vérifiez qu’une prière est visible."] },
  },
  en: {
    unknownMosque: "This mosque is not available. Choose a mosque from the list below.", workOutlook: "Outlook: work or school account ↗",
    skip: "Skip to content", language: "Language", eyebrow: "YOUR MOSQUE, YOUR CALENDAR", hero: ["Your prayers.", "Part of your day."],
    intro: "Your mosque’s prayer times, including iqama, in the calendar you already use.", promise: "Free. No extra account. A subscription that follows updates.",
    step1: "Your mosque", step2: "Your calendar", step3: "Your phone", journey: "Steps", loading: "Loading mosques…", loadError: "Unable to load calendars. Please try again later.", emptyCatalog: "No calendars are available yet.",
    stepOne: "STEP 01", find: "Find your mosque", searchLabel: "Mosque name", searchPlaceholder: "Créteil, Sahaba…", catalogNote: "Only mosques with an available calendar are listed.", noResults: "No available mosque matches this search.",
    preview: "PRAYER TIMES PREVIEW", today: "Today", noTimes: "This calendar does not cover today. Check with your mosque for current times.", stale: "Times were last checked more than 48 hours ago. Confirm them with your mosque.", source: "View mosque on Mawaqit ↗", updated: "Times checked: ", timezone: "Time zone: ", adhan: "Adhan", jumua: "Jumu’a",
    stepTwo: "STEP 02", choose: "Choose your calendar", providerLabel: "Calendar application", subscribeIntro: "Subscribe to the calendar link to receive its updates.", feedLabel: "Subscription link", copy: "Copy link", copied: "Link copied.", copyFallback: "Select the link above and copy it manually.", importNote: "A subscription updates. A downloaded and imported file stays a fixed copy.", localWarning: "Local preview: subscribe using the published site’s link. Your calendar service cannot access this local link.",
    stepThree: "STEP 03 · DON’T SKIP THIS", phone: "Check your phone", phoneIntro: "Using the same account is not always enough: enable this calendar on your phone too.", confirm: "I can see the prayers on my phone.", confirmed: "You’re ready. Your calendar will fetch updates on its own schedule.", limits: "Your calendar decides when to refresh the subscription. Changes may take time to appear. Keep your prayer app for adhan and notifications.", footer: "Your mosque’s times. A place in your day.", code: "Source code ↗", title: "Salat · Your mosque, your calendar", help: "Official help ↗", syncSelect: "Select Google calendars to sync ↗",
    google: { heading: "Add to Google Calendar", action: "Open Google Calendar ↗", setup: ["Copy the subscription link shown here.", "On a computer, open Google Calendar with the account you use on your phone. Check the selected account in the top right.", "Next to ‘Other calendars’, select + → From URL.", "Paste the link and select ‘Add calendar’."], phone: ["Using the Google Calendar app: open it with the same account, tap ☰ and tick ‘Salat · {name}’.", "On Android, if prayers are missing: ☰ → Settings → Show more → this calendar → Sync, then ☰ → Refresh.", "On iPhone using Apple’s Calendar app: open Google’s sync selection link below with the same account, tick ‘Salat · {name}’ and save. Also select it in Calendar → Calendars.", "Return to today in your calendar app and check that a prayer is visible."] },
    apple: { heading: "Add to Apple Calendar", action: "Subscribe with Apple Calendar ↗", setup: ["On your iPhone, tap the subscription button below and confirm in Calendar.", "If the button does not work: Calendar → Calendars → Add Calendar → Add Subscription Calendar.", "Paste the subscription link and confirm."], phone: ["Open Calendar on your iPhone and tap ‘Calendars’ at the bottom.", "Select ‘Salat · {name}’, then tap ‘Done’.", "Return to today and check that a prayer is visible."] },
    outlook: { heading: "Add to Outlook", action: "Open Outlook ↗", setup: ["Copy the subscription link shown here.", "Open your Outlook calendar in a browser.", "Select Add calendar → Subscribe from web.", "Paste the link, name the calendar and confirm."], phone: ["Open Outlook on your phone with the same account.", "Open Calendar, then the calendar list.", "Enable the calendar you just added.", "Return to today and check that a prayer is visible."] },
  },
  ar: {
    unknownMosque: "هذا المسجد غير متاح. اختر مسجدًا من القائمة أدناه.", workOutlook: "Outlook: حساب العمل أو الدراسة ↗",
    skip: "انتقل إلى المحتوى", language: "اللغة", eyebrow: "مسجدك، تقويمك", hero: ["صلواتك.", "جزء من يومك."], intro: "مواقيت الصلاة في مسجدك، مع أوقات الإقامة، في التقويم الذي تستخدمه بالفعل.", promise: "مجاني. دون حساب إضافي. اشتراك يتابع التحديثات.",
    step1: "مسجدك", step2: "تقويمك", step3: "هاتفك", journey: "الخطوات", loading: "جارٍ تحميل المساجد…", loadError: "تعذر تحميل التقويمات. حاول مجددًا لاحقًا.", emptyCatalog: "لا توجد تقويمات متاحة حاليًا.",
    stepOne: "الخطوة 01", find: "ابحث عن مسجدك", searchLabel: "اسم المسجد", searchPlaceholder: "Créteil, Sahaba…", catalogNote: "تظهر فقط المساجد التي يتوفر لها تقويم.", noResults: "لا يوجد مسجد متاح يطابق هذا البحث.", preview: "معاينة مواقيت الصلاة", today: "اليوم", noTimes: "هذا التقويم لا يشمل اليوم. راجع مسجدك لمعرفة المواقيت الحالية.", stale: "مضى أكثر من 48 ساعة منذ آخر تحقق. تأكد من المواقيت لدى مسجدك.", source: "عرض المسجد على مواقيت ↗", updated: "آخر تحقق من المواقيت: ", timezone: "المنطقة الزمنية: ", adhan: "الأذان", jumua: "الجمعة",
    stepTwo: "الخطوة 02", choose: "اختر تقويمك", providerLabel: "تطبيق التقويم", subscribeIntro: "اشترك في رابط التقويم لتلقي تحديثاته.", feedLabel: "رابط الاشتراك", copy: "نسخ الرابط", copied: "تم نسخ الرابط.", copyFallback: "حدد الرابط أعلاه وانسخه يدويًا.", importNote: "الاشتراك يتحدث تلقائيًا. تنزيل الملف واستيراده يعطي نسخة ثابتة.", localWarning: "معاينة محلية: للاشتراك استخدم رابط الموقع المنشور. لا يستطيع تقويمك الوصول إلى هذا الرابط المحلي.",
    stepThree: "الخطوة 03 · لا تنسها", phone: "تحقق على هاتفك", phoneIntro: "استخدام الحساب نفسه لا يكفي دائمًا: فعّل هذا التقويم على هاتفك أيضًا.", confirm: "أرى الصلوات على هاتفي.", confirmed: "أنت جاهز. سيجلب تقويمك التحديثات حسب جدوله الخاص.", limits: "يحدد تطبيق التقويم وقت تحديث الاشتراك. قد تتأخر التغييرات. احتفظ بتطبيق الصلاة للأذان والإشعارات.", footer: "مواقيت مسجدك. مكان في يومك.", code: "الكود المصدري ↗", title: "Salat · مسجدك، تقويمك", help: "المساعدة الرسمية ↗", syncSelect: "اختيار تقويمات Google للمزامنة ↗",
    google: { heading: "إضافة إلى Google Calendar", action: "فتح Google Calendar ↗", setup: ["انسخ رابط الاشتراك المعروض هنا.", "على جهاز كمبيوتر، افتح Google Calendar بالحساب المستخدم على هاتفك. تحقق من الحساب المحدد في أعلى الصفحة.", "بجانب «تقاويم أخرى»، اختر + ثم «من عنوان URL».", "الصق الرابط ثم اختر «إضافة تقويم»."], phone: ["عند استخدام تطبيق Google Calendar: افتحه بالحساب نفسه، واضغط ☰ وحدد «Salat · {name}».", "على Android، إن لم تظهر الصلوات: ☰ ← الإعدادات ← عرض المزيد ← هذا التقويم ← المزامنة، ثم ☰ ← تحديث.", "على iPhone عند استخدام تطبيق تقويم Apple: افتح رابط اختيار مزامنة Google أدناه بالحساب نفسه، وحدد «Salat · {name}» واحفظ. حدده أيضًا في التقويم ← التقويمات.", "ارجع إلى اليوم في تطبيق تقويمك وتأكد من ظهور صلاة."] },
    apple: { heading: "إضافة إلى Apple Calendar", action: "الاشتراك عبر Apple Calendar ↗", setup: ["على iPhone، اضغط زر الاشتراك أدناه وأكد في تطبيق التقويم.", "إذا لم يعمل الزر: التقويم ← التقويمات ← إضافة تقويم ← إضافة تقويم اشتراك.", "الصق رابط الاشتراك وأكد الإضافة."], phone: ["افتح التقويم على iPhone واضغط «التقويمات» في الأسفل.", "حدد «Salat · {name}» ثم اضغط «تم».", "ارجع إلى اليوم وتأكد من ظهور صلاة."] },
    outlook: { heading: "إضافة إلى Outlook", action: "فتح Outlook ↗", setup: ["انسخ رابط الاشتراك المعروض هنا.", "افتح تقويم Outlook في المتصفح.", "اختر إضافة تقويم ثم الاشتراك من الويب.", "الصق الرابط وسمّ التقويم وأكد الإضافة."], phone: ["افتح Outlook على هاتفك بالحساب نفسه.", "افتح التقويم ثم قائمة التقويمات.", "فعّل التقويم الذي أضفته.", "ارجع إلى اليوم وتأكد من ظهور صلاة."] },
  },
};

const $ = (id) => document.getElementById(id);
const supportedLanguages = Object.keys(translations);
const query = new URLSearchParams(location.search);
let language = supportedLanguages.includes(query.get("lang")) ? query.get("lang") : "fr";
let provider = "google";
let mosques = [];
let selected = null;
let loadState = "loading";

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function todayInTimezone(timezone) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (name) => parts.find((p) => p.type === name).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function locale() { return { fr: "fr-FR", en: "en-GB", ar: "ar" }[language]; }
function words() { return translations[language]; }

function localizeEventText(text) {
  const replacements = language === "ar" ? [
    ["Shuruq (sunrise)", "الشروق"], ["— end of Fajr", "— نهاية وقت الفجر"],
    ["Jumu'a", "الجمعة"], ["Fajr", "الفجر"], ["Dhuhr", "الظهر"], ["Asr", "العصر"],
    ["Maghrib", "المغرب"], ["Isha", "العشاء"], ["iqama", "الإقامة"], ["Iqama", "الإقامة"], ["Adhan", "الأذان"],
  ] : language === "fr" ? [["Shuruq (sunrise)", "Lever du soleil"], ["— end of Fajr", "— fin du Fajr"]] : [];
  for (const [source, translated] of replacements) text = text.replaceAll(source, translated);
  return text;
}

function writeURL() {
  const url = new URL(location.href);
  if (selected) url.searchParams.set("mosque", selected.id);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
}

function applyLanguage() {
  const t = words();
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title = t.title;
  $("language").value = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t[node.dataset.i18n];
    if (Array.isArray(value)) {
      node.replaceChildren(document.createTextNode(value[0]), document.createElement("br"), document.createTextNode(value[1]));
    } else if (typeof value === "string") node.textContent = value;
  });
  $("journey").setAttribute("aria-label", t.journey);
  $("provider-group").setAttribute("aria-label", t.providerLabel);
  $("search").placeholder = t.searchPlaceholder;
  if (loadState !== "ready") $("load-status").textContent = t[loadState];
  $("copy-status").textContent = "";
  renderMosques();
  renderSelectionState();
  if (selected) { renderPreview(); renderSetup(); }
  if (loadState === "ready") writeURL();
}

function renderSelectionState() {
  const hasSelection = selected !== null;
  for (const id of ["preview-panel", "subscribe-panel", "phone-panel", "subscription-limits"]) $(id).hidden = !hasSelection;
  $("selection-grid").classList.toggle("without-selection", !hasSelection);
  $("selection-notice").hidden = hasSelection || loadState !== "ready";
}

function renderMosques() {
  const term = normalize($("search").value.trim());
  const matches = mosques.filter((m) => normalize(`${m.name} ${m.id}`).includes(term));
  $("mosque-list").replaceChildren(...matches.map((m) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mosque-option";
    button.dataset.mosqueId = m.id;
    button.textContent = m.name;
    button.setAttribute("aria-pressed", String(m === selected));
    button.addEventListener("click", () => selectMosque(m));
    return button;
  }));
  $("no-results").hidden = matches.length > 0;
}

function selectMosque(m) {
  selected = m;
  $("confirmed").checked = false;
  $("confirmed-message").textContent = "";
  $("copy-status").textContent = "";
  renderSelectionState();
  writeURL();
  // Keep the clicked button in place so keyboard focus is retained.
  document.querySelectorAll(".mosque-option").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mosqueId === selected.id)));
  renderPreview(); renderSetup();
}

function renderPreview() {
  const t = words();
  const today = todayInTimezone(selected.timezone);
  const events = selected.events.filter((e) => e.date === today);
  $("mosque-name").textContent = selected.name;
  $("preview-date").textContent = new Intl.DateTimeFormat(locale(), { timeZone: selected.timezone, dateStyle: "full" }).format(new Date());
  $("prayer-list").replaceChildren(...events.map((event) => {
    const row = document.createElement("li");
    const label = document.createElement("div");
    const title = document.createElement("div");
    title.className = "prayer-name";
    title.textContent = localizeEventText(event.title.replace(/^🕌\s*/, ""));
    const details = document.createElement("div");
    details.className = "prayer-details";
    // The final description line is the mosque name, already shown above.
    details.textContent = localizeEventText(event.description.split("\n").slice(0, -1).join(" · "));
    label.append(title, details);
    const timeColumn = document.createElement("div");
    timeColumn.className = "time-column";
    const timeLabel = document.createElement("span");
    timeLabel.className = "time-label";
    timeLabel.textContent = event.title.includes("Jumu'a") ? t.jumua : t.adhan;
    const time = document.createElement("time");
    time.className = "prayer-time";
    time.dateTime = event.start;
    time.dir = "ltr";
    time.textContent = new Intl.DateTimeFormat(locale(), { timeZone: selected.timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(event.start));
    timeColumn.append(timeLabel, time);
    row.append(label, timeColumn);
    return row;
  }));
  $("no-times").hidden = events.length > 0;
  $("source-link").href = selected.source_url;
  const fetched = new Date(selected.source_fetched_at);
  $("updated").textContent = t.updated + new Intl.DateTimeFormat(locale(), { timeZone: selected.timezone, dateStyle: "medium", timeStyle: "short" }).format(fetched);
  $("timezone").textContent = t.timezone + selected.timezone;
  $("stale").hidden = Date.now() - fetched.getTime() <= 48 * 60 * 60 * 1000;
}

function orderedSteps(id, steps) {
  $(id).replaceChildren(...steps.map((text) => {
    const item = document.createElement("li");
    item.textContent = text.replaceAll("{name}", selected.name);
    return item;
  }));
}

function helpLink(text, url) {
  const link = document.createElement("a");
  link.textContent = text; link.href = url;
  link.target = "_blank"; link.rel = "noopener noreferrer";
  return link;
}

function renderSetup() {
  const t = words();
  const setup = t[provider];
  const feed = new URL(selected.feed, location.href);
  $("feed-url").value = feed.href;
  $("setup-heading").textContent = setup.heading;
  $("open-calendar").textContent = setup.action;
  orderedSteps("setup-steps", setup.setup);
  orderedSteps("phone-steps", setup.phone);
  const local = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "[::1]" || location.protocol === "file:";
  $("local-warning").hidden = !local;
  const links = {
    google: "https://calendar.google.com/calendar/r/settings/addbyurl",
    apple: feed.href.replace(/^https?:/, "webcal:"),
    outlook: "https://outlook.live.com/calendar/",
  };
  // Never launch a calendar client with a loopback feed that it cannot fetch.
  if (local && provider === "apple") {
    $("open-calendar").removeAttribute("href");
    $("open-calendar").setAttribute("aria-disabled", "true");
  } else {
    $("open-calendar").href = links[provider];
    $("open-calendar").removeAttribute("aria-disabled");
  }
  document.querySelectorAll("[data-provider]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.provider === provider)));
  const sources = {
    google: "https://support.google.com/calendar/answer/6261951",
    apple: "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios",
    outlook: "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c",
  };
  const linksToShow = [helpLink(t.help, sources[provider])];
  if (provider === "google") linksToShow.push(helpLink(t.syncSelect, "https://calendar.google.com/calendar/syncselect"));
  $("work-outlook").hidden = provider !== "outlook";
  $("phone-links").replaceChildren(...linksToShow);
  $("confirmed-message").textContent = $("confirmed").checked ? t.confirmed : "";
}

async function loadCatalog() {
  try {
    const response = await fetch("catalog.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Catalog unavailable");
    const data = await response.json();
    if (data.version !== 1 || !Array.isArray(data.mosques)) throw new Error("Invalid catalog");
    mosques = data.mosques;
    if (mosques.length === 0) {
      loadState = "emptyCatalog"; applyLanguage(); return;
    }
    // A shared link is a specific request: never substitute a different mosque.
    selected = query.has("mosque") ? mosques.find((m) => m.id === query.get("mosque")) || null : mosques[0];
    // Render before exposing the interface; malformed data goes to the error state.
    loadState = "ready";
    applyLanguage();
    $("load-status").hidden = true;
    $("app").hidden = false;
  } catch {
    loadState = "loadError";
    selected = null;
    mosques = [];
    $("load-status").hidden = false;
    $("app").hidden = true;
    $("load-status").textContent = words().loadError;
  }
}

$("language").addEventListener("change", (event) => { language = event.target.value; applyLanguage(); });
$("search").addEventListener("input", renderMosques);
document.querySelectorAll("[data-provider]").forEach((button) => button.addEventListener("click", () => {
  provider = button.dataset.provider;
  $("confirmed").checked = false;
  renderSetup();
}));
$("confirmed").addEventListener("change", () => { $("confirmed-message").textContent = $("confirmed").checked ? words().confirmed : ""; });
$("copy").addEventListener("click", async () => {
  const value = $("feed-url").value;
  $("copy-status").textContent = "";
  try {
    await navigator.clipboard.writeText(value);
    // Selection may have changed while the browser requested clipboard access.
    if ($("feed-url").value === value) $("copy-status").textContent = words().copied;
  } catch {
    $("feed-url").focus(); $("feed-url").select();
    $("copy-status").textContent = words().copyFallback;
  }
});

applyLanguage();
loadCatalog();
// Keep "today" correct when the page stays open across midnight.
setInterval(() => { if (selected && loadState === "ready") renderPreview(); }, 60_000);
